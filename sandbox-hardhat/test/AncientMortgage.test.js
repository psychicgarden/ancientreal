const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AncientMortgage Contract Tests", function () {
  let ancientMortgage;
  let usdt;
  let owner;
  let borrower;
  let treasury;
  let lendingPool;
  let appraiser;

  const PROPERTY_PRICE = ethers.utils.parseUnits("135000", 6); // $135k USDT (6 decimals)
  const DOWN_PAYMENT = ethers.utils.parseUnits("27000", 6);   // $27k down payment (20%)
  const PRINCIPAL = ethers.utils.parseUnits("108000", 6);     // $108k principal

  beforeEach(async function () {
    [owner, borrower, treasury, lendingPool, appraiser] = await ethers.getSigners();

    // Deploy mock USDT
    const MockUSDT = await ethers.getContractFactory("MockERC20");
    usdt = await MockUSDT.deploy("Mock USDT", "USDT", 6);
    await usdt.deployed();

    // Deploy AncientMortgage
    const AncientMortgage = await ethers.getContractFactory("AncientMortgage");
    ancientMortgage = await AncientMortgage.deploy(
      usdt.address,
      treasury.address,
      lendingPool.address,
      appraiser.address
    );
    await ancientMortgage.deployed();

    // Setup borrower with USDT
    const totalNeeded = PROPERTY_PRICE.add(ethers.utils.parseUnits("4050", 6)); // Include 3% fee
    await usdt.mint(borrower.address, totalNeeded);
    await usdt.connect(borrower).approve(ancientMortgage.address, totalNeeded);

    // Set KYC and accredited status
    await ancientMortgage.setKYCVerified(borrower.address, true);
    await ancientMortgage.setAccreditedInvestor(borrower.address, true);
  });

  describe("✅ REQUIREMENT: 3% Platform Fee Collection", function () {
    it("Should collect exactly 3% platform fee on purchase", async function () {
      const expectedFee = ethers.utils.parseUnits("4050", 6); // 3% of $135k = $4,050
      
      const treasuryBalanceBefore = await usdt.balanceOf(treasury.address);
      
      await ancientMortgage.connect(borrower).purchaseProperty(PROPERTY_PRICE, DOWN_PAYMENT);
      
      const treasuryBalanceAfter = await usdt.balanceOf(treasury.address);
      const feeCollected = treasuryBalanceAfter.sub(treasuryBalanceBefore);
      
      expect(feeCollected).to.equal(expectedFee);
    });
  });

  describe("✅ REQUIREMENT: Correct Monthly Payment Calculation", function () {
    it("Should calculate exactly $1,310.19 monthly payment for $108k@8%/120months", async function () {
      await ancientMortgage.connect(borrower).purchaseProperty(PROPERTY_PRICE, DOWN_PAYMENT);
      
      const tokenId = 1;
      const mortgageDetails = await ancientMortgage.getMortgageDetails(tokenId);
      
      // Expected monthly payment: $1,310.19 (calculated using standard amortization)
      const expectedPayment = ethers.utils.parseUnits("1310.19", 6);
      
      expect(mortgageDetails.monthlyPayment).to.be.closeTo(expectedPayment, ethers.utils.parseUnits("0.01", 6));
    });
  });

  describe("✅ REQUIREMENT: First Payment Breakdown", function () {
    it("Should show correct balance after first payment: $107,409.81", async function () {
      await ancientMortgage.connect(borrower).purchaseProperty(PROPERTY_PRICE, DOWN_PAYMENT);
      
      const tokenId = 1;
      let mortgageDetails = await ancientMortgage.getMortgageDetails(tokenId);
      const monthlyPayment = mortgageDetails.monthlyPayment;
      
      // Approve and make first payment
      await usdt.connect(borrower).approve(ancientMortgage.address, monthlyPayment);
      await ancientMortgage.connect(borrower).makePayment(tokenId);
      
      mortgageDetails = await ancientMortgage.getMortgageDetails(tokenId);
      
      // Expected balance after first payment: $107,409.81
      const expectedBalance = ethers.utils.parseUnits("107409.81", 6);
      
      expect(mortgageDetails.currentBalance).to.be.closeTo(expectedBalance, ethers.utils.parseUnits("0.01", 6));
    });
  });

  describe("✅ REQUIREMENT: ERC721 Property Ownership", function () {
    it("Should mint property NFT to contract, not borrower", async function () {
      await ancientMortgage.connect(borrower).purchaseProperty(PROPERTY_PRICE, DOWN_PAYMENT);
      
      const tokenId = 1;
      const owner = await ancientMortgage.ownerOf(tokenId);
      
      expect(owner).to.equal(ancientMortgage.address);
      expect(owner).to.not.equal(borrower.address);
    });

    it("Should transfer NFT to borrower only when mortgage is completed", async function () {
      await ancientMortgage.connect(borrower).purchaseProperty(PROPERTY_PRICE, DOWN_PAYMENT);
      
      const tokenId = 1;
      let mortgageDetails = await ancientMortgage.getMortgageDetails(tokenId);
      
      // Simulate all 120 payments
      for (let i = 0; i < 120; i++) {
        const payment = mortgageDetails.monthlyPayment;
        await usdt.mint(borrower.address, payment);
        await usdt.connect(borrower).approve(ancientMortgage.address, payment);
        await ancientMortgage.connect(borrower).makePayment(tokenId);
        
        mortgageDetails = await ancientMortgage.getMortgageDetails(tokenId);
        if (mortgageDetails.paymentsRemaining.eq(0)) break;
      }
      
      // After completion, borrower should own the NFT
      const finalOwner = await ancientMortgage.ownerOf(tokenId);
      expect(finalOwner).to.equal(borrower.address);
    });
  });

  describe("✅ REQUIREMENT: Year-10 Appraisal (Payment-Index Trigger)", function () {
    it("Should only allow appraisal after 120 payments completed", async function () {
      await ancientMortgage.connect(borrower).purchaseProperty(PROPERTY_PRICE, DOWN_PAYMENT);
      
      const tokenId = 1;
      const appraisedValue = ethers.utils.parseUnits("250000", 6); // $250k new value
      
      // Should fail before 120 payments
      await expect(
        ancientMortgage.connect(appraiser).triggerYear10Appraisal(tokenId, appraisedValue, "0x")
      ).to.be.revertedWith("120 payments not completed");
      
      // Complete all payments
      let mortgageDetails = await ancientMortgage.getMortgageDetails(tokenId);
      for (let i = 0; i < 120; i++) {
        const payment = mortgageDetails.monthlyPayment;
        await usdt.mint(borrower.address, payment);
        await usdt.connect(borrower).approve(ancientMortgage.address, payment);
        await ancientMortgage.connect(borrower).makePayment(tokenId);
        
        mortgageDetails = await ancientMortgage.getMortgageDetails(tokenId);
        if (mortgageDetails.paymentsRemaining.eq(0)) break;
      }
      
      // Now should succeed
      await expect(
        ancientMortgage.connect(appraiser).triggerYear10Appraisal(tokenId, appraisedValue, "0x")
      ).to.not.be.reverted;
    });
  });

  describe("✅ REQUIREMENT: 50/40/10 Appreciation Distribution", function () {
    it("Should distribute $115k appreciation correctly: $57.5k buyer, $46k treasury, $11.5k pool", async function () {
      await ancientMortgage.connect(borrower).purchaseProperty(PROPERTY_PRICE, DOWN_PAYMENT);
      
      const tokenId = 1;
      
      // Complete all payments first
      let mortgageDetails = await ancientMortgage.getMortgageDetails(tokenId);
      for (let i = 0; i < 120; i++) {
        const payment = mortgageDetails.monthlyPayment;
        await usdt.mint(borrower.address, payment);
        await usdt.connect(borrower).approve(ancientMortgage.address, payment);
        await ancientMortgage.connect(borrower).makePayment(tokenId);
        
        mortgageDetails = await ancientMortgage.getMortgageDetails(tokenId);
        if (mortgageDetails.paymentsRemaining.eq(0)) break;
      }
      
      // Trigger appraisal: $135k → $250k = $115k appreciation
      const appraisedValue = ethers.utils.parseUnits("250000", 6);
      await ancientMortgage.connect(appraiser).triggerYear10Appraisal(tokenId, appraisedValue, "0x");
      
      // Fund contract for distribution
      const totalAppreciation = ethers.utils.parseUnits("115000", 6);
      await usdt.mint(ancientMortgage.address, totalAppreciation);
      
      // Record balances before distribution
      const borrowerBalanceBefore = await usdt.balanceOf(borrower.address);
      const treasuryBalanceBefore = await usdt.balanceOf(treasury.address);
      const poolBalanceBefore = await usdt.balanceOf(lendingPool.address);
      
      // Distribute appreciation
      await ancientMortgage.distributeAppreciationShares(tokenId);
      
      // Check distributions
      const borrowerBalanceAfter = await usdt.balanceOf(borrower.address);
      const treasuryBalanceAfter = await usdt.balanceOf(treasury.address);
      const poolBalanceAfter = await usdt.balanceOf(lendingPool.address);
      
      const buyerShare = borrowerBalanceAfter.sub(borrowerBalanceBefore);
      const treasuryShare = treasuryBalanceAfter.sub(treasuryBalanceBefore);
      const poolShare = poolBalanceAfter.sub(poolBalanceBefore);
      
      // Expected: 50% = $57.5k, 40% = $46k, 10% = $11.5k
      expect(buyerShare).to.equal(ethers.utils.parseUnits("57500", 6));
      expect(treasuryShare).to.equal(ethers.utils.parseUnits("46000", 6));
      expect(poolShare).to.equal(ethers.utils.parseUnits("11500", 6));
    });
  });

  describe("✅ REQUIREMENT: Refinancing Option", function () {
    it("Should allow refinancing after Year-10 completion", async function () {
      await ancientMortgage.connect(borrower).purchaseProperty(PROPERTY_PRICE, DOWN_PAYMENT);
      
      const tokenId = 1;
      
      // Complete mortgage and trigger Year-10
      let mortgageDetails = await ancientMortgage.getMortgageDetails(tokenId);
      for (let i = 0; i < 120; i++) {
        const payment = mortgageDetails.monthlyPayment;
        await usdt.mint(borrower.address, payment);
        await usdt.connect(borrower).approve(ancientMortgage.address, payment);
        await ancientMortgage.connect(borrower).makePayment(tokenId);
        
        mortgageDetails = await ancientMortgage.getMortgageDetails(tokenId);
        if (mortgageDetails.paymentsRemaining.eq(0)) break;
      }
      
      const appraisedValue = ethers.utils.parseUnits("250000", 6);
      await ancientMortgage.connect(appraiser).triggerYear10Appraisal(tokenId, appraisedValue, "0x");
      
      await usdt.mint(ancientMortgage.address, ethers.utils.parseUnits("115000", 6));
      await ancientMortgage.distributeAppreciationShares(tokenId);
      
      // Request refinancing
      await expect(
        ancientMortgage.connect(borrower).requestRefi(tokenId)
      ).to.not.be.reverted;
    });
  });
});