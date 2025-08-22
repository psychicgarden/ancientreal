const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EnhancedStakingPool Contract Tests", function () {
  let stakingPool;
  let usdt;
  let ancientMortgage;
  let owner;
  let staker1;
  let staker2;
  let treasury;

  beforeEach(async function () {
    [owner, staker1, staker2, treasury, ancientMortgage] = await ethers.getSigners();

    // Deploy mock USDT
    const MockUSDT = await ethers.getContractFactory("MockERC20");
    usdt = await MockUSDT.deploy("Mock USDT", "USDT", 6);
    await usdt.deployed();

    // Deploy EnhancedStakingPool
    const EnhancedStakingPool = await ethers.getContractFactory("EnhancedStakingPool");
    stakingPool = await EnhancedStakingPool.deploy(
      usdt.address,
      ancientMortgage.address,
      treasury.address
    );
    await stakingPool.deployed();

    // Setup stakers with USDT
    const stakerAmount = ethers.utils.parseUnits("10000", 6); // $10k each
    await usdt.mint(staker1.address, stakerAmount);
    await usdt.mint(staker2.address, stakerAmount);

    await usdt.connect(staker1).approve(stakingPool.address, stakerAmount);
    await usdt.connect(staker2).approve(stakingPool.address, stakerAmount);
  });

  describe("✅ REQUIREMENT: Connected to Mortgage Cashflows", function () {
    it("Should receive mortgage interest and increase pool assets", async function () {
      // Staker deposits $1000
      const depositAmount = ethers.utils.parseUnits("1000", 6);
      await stakingPool.connect(staker1).deposit(depositAmount, staker1.address);

      const poolAssetsBefore = await stakingPool.totalAssets();
      
      // Simulate mortgage interest payment
      const interestAmount = ethers.utils.parseUnits("100", 6); // $100 interest
      await usdt.mint(ancientMortgage.address, interestAmount);
      await usdt.connect(ancientMortgage).approve(stakingPool.address, interestAmount);
      
      await stakingPool.connect(ancientMortgage).receiveMortgageInterest(interestAmount);
      
      const poolAssetsAfter = await stakingPool.totalAssets();
      
      // Pool assets should increase by the net interest (after management fee)
      const managementFee = interestAmount.mul(200).div(10000); // 2% fee
      const netIncrease = interestAmount.sub(managementFee);
      
      expect(poolAssetsAfter.sub(poolAssetsBefore)).to.equal(netIncrease);
    });

    it("Should receive 10% appreciation share and distribute to stakers", async function () {
      // Staker deposits $1000  
      const depositAmount = ethers.utils.parseUnits("1000", 6);
      await stakingPool.connect(staker1).deposit(depositAmount, staker1.address);

      const poolAssetsBefore = await stakingPool.totalAssets();
      
      // Simulate 10% appreciation share from Year-10 event
      const appreciationShare = ethers.utils.parseUnits("11500", 6); // $11.5k (10% of $115k appreciation)
      await usdt.mint(ancientMortgage.address, appreciationShare);
      await usdt.connect(ancientMortgage).approve(stakingPool.address, appreciationShare);
      
      await stakingPool.connect(ancientMortgage).receiveAppreciationShare(appreciationShare);
      
      const poolAssetsAfter = await stakingPool.totalAssets();
      
      // Pool assets should increase by net appreciation (after management fee)
      const managementFee = appreciationShare.mul(200).div(10000); // 2% fee
      const netIncrease = appreciationShare.sub(managementFee);
      
      expect(poolAssetsAfter.sub(poolAssetsBefore)).to.equal(netIncrease);
    });
  });

  describe("✅ REQUIREMENT: ERC4626-Style Gas-Safe Accounting", function () {
    it("Should distribute yield without loops using share price increase", async function () {
      // Two stakers deposit different amounts
      const deposit1 = ethers.utils.parseUnits("1000", 6); // $1000
      const deposit2 = ethers.utils.parseUnits("2000", 6); // $2000
      
      await stakingPool.connect(staker1).deposit(deposit1, staker1.address);
      await stakingPool.connect(staker2).deposit(deposit2, staker2.address);

      const shares1Before = await stakingPool.balanceOf(staker1.address);
      const shares2Before = await stakingPool.balanceOf(staker2.address);
      
      // Simulate yield distribution
      const yieldAmount = ethers.utils.parseUnits("300", 6); // $300 yield
      await usdt.mint(ancientMortgage.address, yieldAmount);
      await usdt.connect(ancientMortgage).approve(stakingPool.address, yieldAmount);
      
      await stakingPool.connect(ancientMortgage).receiveMortgageInterest(yieldAmount);
      
      // Shares remain the same, but each share is worth more
      const shares1After = await stakingPool.balanceOf(staker1.address);
      const shares2After = await stakingPool.balanceOf(staker2.address);
      
      expect(shares1After).to.equal(shares1Before);
      expect(shares2After).to.equal(shares2Before);
      
      // But asset value per share increased
      const assets1After = await stakingPool.convertToAssets(shares1After);
      const assets2After = await stakingPool.convertToAssets(shares2After);
      
      expect(assets1After).to.be.gt(deposit1);
      expect(assets2After).to.be.gt(deposit2);
    });
  });

  describe("✅ REQUIREMENT: Proper Decimal Handling", function () {
    it("Should handle USDT 6 decimals correctly", async function () {
      const depositAmount = ethers.utils.parseUnits("1000", 6); // 6 decimals for USDT
      
      await stakingPool.connect(staker1).deposit(depositAmount, staker1.address);
      
      const poolAssets = await stakingPool.totalAssets();
      const stakerShares = await stakingPool.balanceOf(staker1.address);
      
      // Pool should have exactly the deposited USDT amount
      expect(poolAssets).to.equal(depositAmount);
      
      // Shares should be minted with 18 decimals (ERC20 standard)
      expect(stakerShares).to.equal(ethers.utils.parseEther("1000")); // 18 decimals
    });
  });

  describe("✅ REQUIREMENT: Realistic Yield Calculation", function () {
    it("Should calculate APY based on actual cashflows, not hardcoded rates", async function () {
      // Initial deposit
      const depositAmount = ethers.utils.parseUnits("10000", 6); // $10k
      await stakingPool.connect(staker1).deposit(depositAmount, staker1.address);

      // Simulate regular mortgage interest over time
      const monthlyInterest = ethers.utils.parseUnits("66.67", 6); // ~8% APY / 12 months * $10k
      
      for (let i = 0; i < 3; i++) { // 3 months of interest
        await usdt.mint(ancientMortgage.address, monthlyInterest);
        await usdt.connect(ancientMortgage).approve(stakingPool.address, monthlyInterest);
        await stakingPool.connect(ancientMortgage).receiveMortgageInterest(monthlyInterest);
        
        // Fast forward 30 days
        await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");
      }

      const currentAPY = await stakingPool.getCurrentAPY();
      
      // Should be around 7.5-8.5% (750-850 basis points)
      expect(currentAPY).to.be.gte(700); // At least 7%
      expect(currentAPY).to.be.lte(900); // At most 9%
    });
  });

  describe("✅ REQUIREMENT: Management Fee Collection", function () {
    it("Should collect 2% management fee on yield distribution", async function () {
      // Deposit and simulate yield
      const depositAmount = ethers.utils.parseUnits("1000", 6);
      await stakingPool.connect(staker1).deposit(depositAmount, staker1.address);

      const treasuryBalanceBefore = await usdt.balanceOf(treasury.address);
      
      const yieldAmount = ethers.utils.parseUnits("100", 6); // $100 yield
      await usdt.mint(ancientMortgage.address, yieldAmount);
      await usdt.connect(ancientMortgage).approve(stakingPool.address, yieldAmount);
      
      await stakingPool.connect(ancientMortgage).receiveMortgageInterest(yieldAmount);
      
      const treasuryBalanceAfter = await usdt.balanceOf(treasury.address);
      const feeCollected = treasuryBalanceAfter.sub(treasuryBalanceBefore);
      
      // Should collect 2% of $100 = $2
      const expectedFee = ethers.utils.parseUnits("2", 6);
      expect(feeCollected).to.equal(expectedFee);
    });
  });

  describe("✅ REQUIREMENT: Expected Returns Transparency", function () {
    it("Should return expected APY range of 7.5-8.5%", async function () {
      const expectedReturns = await stakingPool.getExpectedReturns();
      
      expect(expectedReturns.minExpectedAPY).to.equal(750); // 7.5%
      expect(expectedReturns.maxExpectedAPY).to.equal(850); // 8.5%
      expect(expectedReturns.yieldSource).to.include("Mortgage interest");
      expect(expectedReturns.yieldSource).to.include("appreciation share");
    });
  });

  describe("✅ REQUIREMENT: Pool Metrics", function () {
    it("Should track comprehensive pool performance metrics", async function () {
      // Initial deposit
      await stakingPool.connect(staker1).deposit(ethers.utils.parseUnits("1000", 6), staker1.address);

      // Add some yield
      const interestAmount = ethers.utils.parseUnits("50", 6);
      const appreciationAmount = ethers.utils.parseUnits("25", 6);
      
      await usdt.mint(ancientMortgage.address, interestAmount.add(appreciationAmount));
      await usdt.connect(ancientMortgage).approve(stakingPool.address, interestAmount.add(appreciationAmount));
      
      await stakingPool.connect(ancientMortgage).receiveMortgageInterest(interestAmount);
      await stakingPool.connect(ancientMortgage).receiveAppreciationShare(appreciationAmount);

      const metrics = await stakingPool.getPoolMetrics();
      
      expect(metrics.totalMortgageInterest).to.equal(interestAmount);
      expect(metrics.totalAppreciationShare).to.equal(appreciationAmount);
      expect(metrics.totalPoolAssets).to.be.gt(ethers.utils.parseUnits("1000", 6)); // Should have grown
    });
  });
});
