const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Integration Tests - All Contracts Working Together", function () {
  let ancientMortgage;
  let escrowManager;
  let stakingPool;
  let usdt;
  let owner;
  let borrower;
  let developer;
  let investor1;
  let investor2;
  let staker1;
  let treasury;
  let lendingPool;
  let appraiser;

  const PROPERTY_PRICE = ethers.utils.parseUnits("135000", 6);
  const DOWN_PAYMENT = ethers.utils.parseUnits("27000", 6);

  beforeEach(async function () {
    [owner, borrower, developer, investor1, investor2, staker1, treasury, appraiser] = await ethers.getSigners();
    lendingPool = treasury; // Simplify for integration test

    // Deploy mock USDT
    const MockUSDT = await ethers.getContractFactory("MockERC20");
    usdt = await MockUSDT.deploy("Mock USDT", "USDT", 6);
    await usdt.deployed();

    // Deploy all contracts
    const AncientMortgage = await ethers.getContractFactory("AncientMortgage");
    ancientMortgage = await AncientMortgage.deploy(
      usdt.address,
      treasury.address,
      lendingPool.address,
      appraiser.address
    );
    await ancientMortgage.deployed();

    const DeveloperEscrowManager = await ethers.getContractFactory("DeveloperEscrowManager");
    escrowManager = await DeveloperEscrowManager.deploy(usdt.address, treasury.address);
    await escrowManager.deployed();

    const EnhancedStakingPool = await ethers.getContractFactory("EnhancedStakingPool");
    stakingPool = await EnhancedStakingPool.deploy(
      usdt.address,
      ancientMortgage.address,
      treasury.address
    );
    await stakingPool.deployed();

    // Setup all participants with USDT
    const largeAmount = ethers.utils.parseUnits("1000000", 6);
    await usdt.mint(borrower.address, largeAmount);
    await usdt.mint(investor1.address, largeAmount);
    await usdt.mint(investor2.address, largeAmount);
    await usdt.mint(staker1.address, largeAmount);
    await usdt.mint(ancientMortgage.address, largeAmount); // For distributions

    // Setup approvals
    await usdt.connect(borrower).approve(ancientMortgage.address, largeAmount);
    await usdt.connect(investor1).approve(escrowManager.address, largeAmount);
    await usdt.connect(investor2).approve(escrowManager.address, largeAmount);
    await usdt.connect(staker1).approve(stakingPool.address, largeAmount);

    // Setup permissions
    await ancientMortgage.setKYCVerified(borrower.address, true);
    await ancientMortgage.setAccreditedInvestor(borrower.address, true);
  });

  describe("✅ INTEGRATION: Complete Business Flow", function () {
    it("Should execute end-to-end business model: Mortgage → Developer → Staking", async function () {
      // ========== PHASE 1: MORTGAGE CREATION ==========
      console.log("Phase 1: Creating mortgage...");
      
      const treasuryBalanceStart = await usdt.balanceOf(treasury.address);
      
      // Purchase property - should collect 3% platform fee
      await ancientMortgage.connect(borrower).purchaseProperty(PROPERTY_PRICE, DOWN_PAYMENT);
      const tokenId = 1;
      
      const treasuryBalanceAfterPurchase = await usdt.balanceOf(treasury.address);
      const platformFeeCollected = treasuryBalanceAfterPurchase.sub(treasuryBalanceStart);
      
      // Verify 3% fee collection
      expect(platformFeeCollected).to.equal(ethers.utils.parseUnits("4050", 6));
      
      // ========== PHASE 2: STAKING POOL SETUP ==========
      console.log("Phase 2: Setting up staking pool...");
      
      // Staker deposits into pool
      const stakingDeposit = ethers.utils.parseUnits("10000", 6);
      await stakingPool.connect(staker1).deposit(stakingDeposit, staker1.address);
      
      const poolAssetsInitial = await stakingPool.totalAssets();
      expect(poolAssetsInitial).to.equal(stakingDeposit);
      
      // ========== PHASE 3: DEVELOPER ESCROW ==========
      console.log("Phase 3: Testing developer escrow...");
      
      const targetFunding = ethers.utils.parseUnits("1000000", 6);
      const aboveThreshold = ethers.utils.parseUnits("810000", 6);
      
      // Create and fund developer project
      await escrowManager.connect(developer).createProject(
        "Integration Test Project",
        "Test Description",
        targetFunding,
        ethers.utils.parseUnits("1000", 6),
        30 * 24 * 60 * 60,
        90 * 24 * 60 * 60,
        ["Development Milestone"],
        [10000],
        [30 * 24 * 60 * 60]
      );
      
      await escrowManager.connect(investor1).investInProject(0, aboveThreshold);
      
      // Complete milestone and wait for dispute period
      await escrowManager.connect(developer).completeMilestone(0, 0);
      await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      
      const treasuryBeforeEscrow = await usdt.balanceOf(treasury.address);
      await escrowManager.connect(developer).releaseMilestoneFunds(0, 0);
      const treasuryAfterEscrow = await usdt.balanceOf(treasury.address);
      
      // Verify 5% escrow fee
      const escrowFee = treasuryAfterEscrow.sub(treasuryBeforeEscrow);
      expect(escrowFee).to.equal(ethers.utils.parseUnits("40500", 6)); // 5% of $810k
      
      // ========== PHASE 4: MORTGAGE PAYMENTS & YIELD ==========
      console.log("Phase 4: Processing mortgage payments...");
      
      const mortgageDetails = await ancientMortgage.getMortgageDetails(tokenId);
      const monthlyPayment = mortgageDetails.monthlyPayment;
      
      // Make several mortgage payments
      for (let i = 0; i < 6; i++) { // 6 months of payments
        await usdt.mint(borrower.address, monthlyPayment);
        await usdt.connect(borrower).approve(ancientMortgage.address, monthlyPayment);
        await ancientMortgage.connect(borrower).makePayment(tokenId);
        
        // Simulate sending interest to staking pool
        const interestPortion = monthlyPayment.mul(65).div(100); // Rough 65% interest in early payments
        await usdt.mint(ancientMortgage.address, interestPortion);
        await usdt.connect(ancientMortgage).approve(stakingPool.address, interestPortion);
        await stakingPool.connect(ancientMortgage).receiveMortgageInterest(interestPortion);
      }
      
      // Verify staking pool grew from mortgage interest
      const poolAssetsAfterPayments = await stakingPool.totalAssets();
      expect(poolAssetsAfterPayments).to.be.gt(poolAssetsInitial);
      
      // ========== PHASE 5: YEAR-10 APPRECIATION ==========
      console.log("Phase 5: Testing Year-10 appreciation...");
      
      // Complete all 120 payments (simplified for testing)
      let currentMortgage = await ancientMortgage.getMortgageDetails(tokenId);
      while (currentMortgage.paymentsRemaining.gt(0)) {
        await usdt.mint(borrower.address, currentMortgage.monthlyPayment);
        await usdt.connect(borrower).approve(ancientMortgage.address, currentMortgage.monthlyPayment);
        await ancientMortgage.connect(borrower).makePayment(tokenId);
        currentMortgage = await ancientMortgage.getMortgageDetails(tokenId);
      }
      
      // Trigger Year-10 appraisal
      const appraisedValue = ethers.utils.parseUnits("250000", 6); // $250k new value
      await ancientMortgage.connect(appraiser).triggerYear10Appraisal(tokenId, appraisedValue, "0x");
      
      // Fund and distribute appreciation
      const appreciationAmount = ethers.utils.parseUnits("115000", 6); // $250k - $135k
      await usdt.mint(ancientMortgage.address, appreciationAmount);
      
      const poolAssetsBeforeAppreciation = await stakingPool.totalAssets();
      
      await ancientMortgage.distributeAppreciationShares(tokenId);
      
      // Simulate 10% appreciation going to staking pool
      const appreciationShare = ethers.utils.parseUnits("11500", 6); // 10% of $115k
      await usdt.mint(ancientMortgage.address, appreciationShare);
      await usdt.connect(ancientMortgage).approve(stakingPool.address, appreciationShare);
      await stakingPool.connect(ancientMortgage).receiveAppreciationShare(appreciationShare);
      
      const poolAssetsAfterAppreciation = await stakingPool.totalAssets();
      const appreciationIncrease = poolAssetsAfterAppreciation.sub(poolAssetsBeforeAppreciation);
      
      // Verify staking pool received appreciation (minus management fee)
      const expectedNetAppreciation = appreciationShare.mul(98).div(100); // 98% after 2% mgmt fee
      expect(appreciationIncrease).to.be.closeTo(expectedNetAppreciation, ethers.utils.parseUnits("100", 6));
      
      // ========== FINAL VERIFICATION ==========
      console.log("Final verification...");
      
      // Check that borrower owns the property NFT
      const finalOwner = await ancientMortgage.ownerOf(tokenId);
      expect(finalOwner).to.equal(borrower.address);
      
      // Check staking pool metrics
      const metrics = await stakingPool.getPoolMetrics();
      expect(metrics.totalMortgageInterest).to.be.gt(0);
      expect(metrics.totalAppreciationShare).to.be.gt(0);
      
      // Check overall treasury collections
      const finalTreasuryBalance = await usdt.balanceOf(treasury.address);
      const totalFeesCollected = finalTreasuryBalance.sub(treasuryBalanceStart);
      
      // Should have collected: mortgage platform fee + escrow fee + staking mgmt fees
      expect(totalFeesCollected).to.be.gt(ethers.utils.parseUnits("44550", 6)); // At least the main fees
      
      console.log("✅ Integration test completed successfully!");
      console.log(`Platform fees collected: ${ethers.utils.formatUnits(platformFeeCollected, 6)} USDT`);
      console.log(`Escrow fees collected: ${ethers.utils.formatUnits(escrowFee, 6)} USDT`);
      console.log(`Total treasury balance: ${ethers.utils.formatUnits(finalTreasuryBalance, 6)} USDT`);
      console.log(`Staking pool assets: ${ethers.utils.formatUnits(poolAssetsAfterAppreciation, 6)} USDT`);
    });
  });

  describe("✅ INTEGRATION: Cross-Contract Permissions", function () {
    it("Should enforce proper access controls across contracts", async function () {
      // Only mortgage contract should be able to send yield to staking pool
      const yieldAmount = ethers.utils.parseUnits("100", 6);
      
      await expect(
        stakingPool.connect(borrower).receiveMortgageInterest(yieldAmount)
      ).to.be.revertedWith("Only mortgage contract");
      
      // Only trusted appraiser should trigger appraisals
      await ancientMortgage.connect(borrower).purchaseProperty(PROPERTY_PRICE, DOWN_PAYMENT);
      
      await expect(
        ancientMortgage.connect(borrower).triggerYear10Appraisal(1, PROPERTY_PRICE, "0x")
      ).to.be.revertedWith("Only trusted appraiser");
    });
  });

  describe("✅ INTEGRATION: End-to-End APY Calculation", function () {
    it("Should show realistic APY based on actual business cashflows", async function () {
      // Setup staking pool with deposits
      await stakingPool.connect(staker1).deposit(ethers.utils.parseUnits("10000", 6), staker1.address);
      
      // Simulate consistent monthly mortgage interest over time
      const monthlyInterest = ethers.utils.parseUnits("67", 6); // ~8% APY worth
      
      for (let month = 0; month < 12; month++) {
        await usdt.mint(ancientMortgage.address, monthlyInterest);
        await usdt.connect(ancientMortgage).approve(stakingPool.address, monthlyInterest);
        await stakingPool.connect(ancientMortgage).receiveMortgageInterest(monthlyInterest);
        
        // Fast forward 30 days
        await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");
      }
      
      const calculatedAPY = await stakingPool.getCurrentAPY();
      
      // Should be in the expected range of 7.5-8.5% (750-850 basis points)
      expect(calculatedAPY).to.be.gte(700); // At least 7%
      expect(calculatedAPY).to.be.lte(900); // At most 9%
      
      console.log(`Calculated APY: ${calculatedAPY.toNumber() / 100}%`);
    });
  });
});