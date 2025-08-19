const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeveloperEscrowManager Contract Tests", function () {
  let escrowManager;
  let usdt;
  let owner;
  let developer;
  let investor1;
  let investor2;
  let investor3;
  let treasury;

  const TARGET_FUNDING = ethers.utils.parseUnits("1000000", 6); // $1M target
  const THRESHOLD_AMOUNT = ethers.utils.parseUnits("800000", 6); // 80% = $800k
  const BELOW_THRESHOLD = ethers.utils.parseUnits("790000", 6);  // 79% = $790k
  const ABOVE_THRESHOLD = ethers.utils.parseUnits("810000", 6);  // 81% = $810k

  beforeEach(async function () {
    [owner, developer, investor1, investor2, investor3, treasury] = await ethers.getSigners();

    // Deploy mock USDT
    const MockUSDT = await ethers.getContractFactory("MockERC20");
    usdt = await MockUSDT.deploy("Mock USDT", "USDT", 6);
    await usdt.deployed();

    // Deploy DeveloperEscrowManager
    const DeveloperEscrowManager = await ethers.getContractFactory("DeveloperEscrowManager");
    escrowManager = await DeveloperEscrowManager.deploy(usdt.address, treasury.address);
    await escrowManager.deployed();

    // Setup investors with USDT
    const investorAmount = ethers.utils.parseUnits("500000", 6);
    await usdt.mint(investor1.address, investorAmount);
    await usdt.mint(investor2.address, investorAmount);
    await usdt.mint(investor3.address, investorAmount);

    await usdt.connect(investor1).approve(escrowManager.address, investorAmount);
    await usdt.connect(investor2).approve(escrowManager.address, investorAmount);
    await usdt.connect(investor3).approve(escrowManager.address, investorAmount);
  });

  describe("✅ REQUIREMENT: 80% Funding Threshold", function () {
    it("Should block milestone releases when funding is below 80%", async function () {
      // Create project
      const projectTx = await escrowManager.connect(developer).createProject(
        "Test Project",
        "Test Description",
        TARGET_FUNDING,
        ethers.utils.parseUnits("1000", 6), // Min investment
        30 * 24 * 60 * 60, // 30 days funding period
        90 * 24 * 60 * 60, // 90 days project duration
        ["Milestone 1"],
        [10000], // 100% release
        [30 * 24 * 60 * 60] // 30 days deadline
      );
      const receipt = await projectTx.wait();
      const projectId = 0; // First project

      // Fund to 79% (below threshold)
      await escrowManager.connect(investor1).investInProject(projectId, BELOW_THRESHOLD);

      // Try to complete milestone - should fail
      await expect(
        escrowManager.connect(developer).completeMilestone(projectId, 0)
      ).to.be.revertedWith("80% funding threshold not met");
    });

    it("Should allow milestone releases when funding reaches 80%", async function () {
      // Create project
      await escrowManager.connect(developer).createProject(
        "Test Project",
        "Test Description", 
        TARGET_FUNDING,
        ethers.utils.parseUnits("1000", 6),
        30 * 24 * 60 * 60,
        90 * 24 * 60 * 60,
        ["Milestone 1"],
        [10000],
        [30 * 24 * 60 * 60]
      );
      const projectId = 0;

      // Fund to 81% (above threshold)
      await escrowManager.connect(investor1).investInProject(projectId, ABOVE_THRESHOLD);

      // Complete milestone - should succeed
      await expect(
        escrowManager.connect(developer).completeMilestone(projectId, 0)
      ).to.not.be.reverted;
    });
  });

  describe("✅ REQUIREMENT: 5% Platform Fee", function () {
    it("Should collect exactly 5% platform fee on fund release", async function () {
      // Create project
      await escrowManager.connect(developer).createProject(
        "Test Project",
        "Test Description",
        TARGET_FUNDING,
        ethers.utils.parseUnits("1000", 6),
        30 * 24 * 60 * 60,
        90 * 24 * 60 * 60,
        ["Milestone 1"],
        [10000], // 100% release
        [30 * 24 * 60 * 60]
      );
      const projectId = 0;

      // Fund above threshold
      await escrowManager.connect(investor1).investInProject(projectId, ABOVE_THRESHOLD);

      const treasuryBalanceBefore = await usdt.balanceOf(treasury.address);
      const developerBalanceBefore = await usdt.balanceOf(developer.address);

      // Complete milestone
      await escrowManager.connect(developer).completeMilestone(projectId, 0);

      // Fast forward past dispute period
      await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]); // 15 days
      await ethers.provider.send("evm_mine");

      // Release funds
      await escrowManager.connect(developer).releaseMilestoneFunds(projectId, 0);

      const treasuryBalanceAfter = await usdt.balanceOf(treasury.address);
      const developerBalanceAfter = await usdt.balanceOf(developer.address);

      const platformFee = treasuryBalanceAfter.sub(treasuryBalanceBefore);
      const developerAmount = developerBalanceAfter.sub(developerBalanceBefore);

      // Expected: 5% of $810k = $40.5k to treasury, $769.5k to developer
      const expectedFee = ethers.utils.parseUnits("40500", 6);
      const expectedDeveloper = ethers.utils.parseUnits("769500", 6);

      expect(platformFee).to.equal(expectedFee);
      expect(developerAmount).to.equal(expectedDeveloper);
    });
  });

  describe("✅ REQUIREMENT: Dispute Period Enforcement", function () {
    it("Should prevent fund release during dispute period", async function () {
      // Create project and fund it
      await escrowManager.connect(developer).createProject(
        "Test Project",
        "Test Description",
        TARGET_FUNDING,
        ethers.utils.parseUnits("1000", 6),
        30 * 24 * 60 * 60,
        90 * 24 * 60 * 60,
        ["Milestone 1"],
        [10000],
        [30 * 24 * 60 * 60]
      );
      const projectId = 0;

      await escrowManager.connect(investor1).investInProject(projectId, ABOVE_THRESHOLD);

      // Complete milestone
      await escrowManager.connect(developer).completeMilestone(projectId, 0);

      // Try to release immediately - should fail
      await expect(
        escrowManager.connect(developer).releaseMilestoneFunds(projectId, 0)
      ).to.be.revertedWith("Dispute period not passed");
    });

    it("Should allow fund release after dispute period", async function () {
      // Create project and fund it
      await escrowManager.connect(developer).createProject(
        "Test Project",
        "Test Description",
        TARGET_FUNDING,
        ethers.utils.parseUnits("1000", 6),
        30 * 24 * 60 * 60,
        90 * 24 * 60 * 60,
        ["Milestone 1"],
        [10000],
        [30 * 24 * 60 * 60]
      );
      const projectId = 0;

      await escrowManager.connect(investor1).investInProject(projectId, ABOVE_THRESHOLD);

      // Complete milestone
      await escrowManager.connect(developer).completeMilestone(projectId, 0);

      // Fast forward past dispute period
      await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]); // 15 days
      await ethers.provider.send("evm_mine");

      // Now should succeed
      await expect(
        escrowManager.connect(developer).releaseMilestoneFunds(projectId, 0)
      ).to.not.be.reverted;
    });
  });

  describe("✅ REQUIREMENT: Gas-Safe Refunds", function () {
    it("Should enable individual refunds instead of loops", async function () {
      // Create project
      await escrowManager.connect(developer).createProject(
        "Test Project",
        "Test Description",
        TARGET_FUNDING,
        ethers.utils.parseUnits("1000", 6),
        2 * 24 * 60 * 60, // Very short funding period
        90 * 24 * 60 * 60,
        ["Milestone 1"],
        [10000],
        [30 * 24 * 60 * 60]
      );
      const projectId = 0;

      // Multiple investors fund below threshold
      const investment1 = ethers.utils.parseUnits("300000", 6);
      const investment2 = ethers.utils.parseUnits("200000", 6);
      const investment3 = ethers.utils.parseUnits("290000", 6); // Total: $790k (79%)

      await escrowManager.connect(investor1).investInProject(projectId, investment1);
      await escrowManager.connect(investor2).investInProject(projectId, investment2);
      await escrowManager.connect(investor3).investInProject(projectId, investment3);

      // Fast forward past funding deadline
      await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]); // 3 days
      await ethers.provider.send("evm_mine");

      // Handle project failure
      await escrowManager.handleProjectFailure(projectId);

      // Check that refunds are enabled but not automatically processed
      expect(await escrowManager.isRefundEnabled(projectId)).to.be.true;

      // Each investor can claim their refund individually
      const investor1BalanceBefore = await usdt.balanceOf(investor1.address);
      await escrowManager.connect(investor1).claimRefund(projectId);
      const investor1BalanceAfter = await usdt.balanceOf(investor1.address);

      expect(investor1BalanceAfter.sub(investor1BalanceBefore)).to.equal(investment1);
    });
  });

  describe("✅ REQUIREMENT: Project Status Management", function () {
    it("Should correctly track funding progress and threshold status", async function () {
      // Create project
      await escrowManager.connect(developer).createProject(
        "Test Project",
        "Test Description",
        TARGET_FUNDING,
        ethers.utils.parseUnits("1000", 6),
        30 * 24 * 60 * 60,
        90 * 24 * 60 * 60,
        ["Milestone 1"],
        [10000],
        [30 * 24 * 60 * 60]
      );
      const projectId = 0;

      // Check initial status
      let progress = await escrowManager.getFundingProgress(projectId);
      expect(progress.currentFunding).to.equal(0);
      expect(progress.thresholdAmount).to.equal(THRESHOLD_AMOUNT);
      expect(progress.thresholdMet).to.be.false;

      // Fund below threshold
      await escrowManager.connect(investor1).investInProject(projectId, BELOW_THRESHOLD);
      
      progress = await escrowManager.getFundingProgress(projectId);
      expect(progress.currentFunding).to.equal(BELOW_THRESHOLD);
      expect(progress.thresholdMet).to.be.false;

      // Fund above threshold
      const additionalFunding = ethers.utils.parseUnits("20000", 6);
      await escrowManager.connect(investor2).investInProject(projectId, additionalFunding);

      progress = await escrowManager.getFundingProgress(projectId);
      expect(progress.thresholdMet).to.be.true;
    });
  });
});