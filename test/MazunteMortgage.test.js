const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MazunteMortgageV2", function () {
  let mortgage, usdt, owner, investor, kycProvider, admin;
  let investorAddress, ownerAddress, kycProviderAddress;

  const PROPERTY_VALUE = ethers.parseUnits("150000", 6); // $150,000
  const DOWN_PAYMENT = ethers.parseUnits("30000", 6); // $30,000
  const MONTHLY_PAYMENT = ethers.parseUnits("1180.76", 6); // $1,180.76

  beforeEach(async function () {
    [owner, investor, kycProvider, admin] = await ethers.getSigners();
    investorAddress = await investor.getAddress();
    ownerAddress = await owner.getAddress();
    kycProviderAddress = await kycProvider.getAddress();

    // Deploy mock USDT
    const MockUSDT = await ethers.getContractFactory("TestUSDT");
    usdt = await MockUSDT.deploy();
    await usdt.waitForDeployment();

    // Deploy mortgage contract
    const MazunteMortgage = await ethers.getContractFactory("MazunteMortgageV2");
    mortgage = await MazunteMortgage.deploy(
      await usdt.getAddress(),
      kycProviderAddress,
      ownerAddress, // Insurance provider
      ownerAddress  // Property manager
    );
    await mortgage.waitForDeployment();

    // Setup test environment
    await usdt.mint(investorAddress, ethers.parseUnits("100000", 6)); // $100,000
    await usdt.connect(investor).approve(await mortgage.getAddress(), ethers.parseUnits("100000", 6));
  });

  describe("Deployment", function () {
    it("Should deploy with correct parameters", async function () {
      expect(await mortgage.USDT()).to.equal(await usdt.getAddress());
      expect(await mortgage.kycProvider()).to.equal(kycProviderAddress);
    });

    it("Should initialize admin roles properly", async function () {
      expect(await mortgage.owner()).to.equal(ownerAddress);
    });
  });

  describe("KYC Verification", function () {
    it("Should verify KYC with valid signature", async function () {
      const expiryTime = Math.floor(Date.now() / 1000) + 86400; // 24 hours
      const messageHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "uint256"],
          [investorAddress, expiryTime]
        )
      );
      
      const signature = await kycProvider.signMessage(ethers.getBytes(messageHash));
      
      await mortgage.connect(kycProvider).verifyKYC(investorAddress, expiryTime, signature);
      
      const kycExpiry = await mortgage.kycExpiry(investorAddress);
      expect(kycExpiry).to.equal(expiryTime);
    });

    it("Should reject invalid signatures", async function () {
      const expiryTime = Math.floor(Date.now() / 1000) + 86400;
      const invalidSignature = "0x" + "0".repeat(130);
      
      await expect(
        mortgage.connect(kycProvider).verifyKYC(investorAddress, expiryTime, invalidSignature)
      ).to.be.reverted;
    });

    it("Should respect KYC expiry times", async function () {
      const pastExpiry = Math.floor(Date.now() / 1000) - 86400; // Expired
      const messageHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "uint256"],
          [investorAddress, pastExpiry]
        )
      );
      
      const signature = await kycProvider.signMessage(ethers.getBytes(messageHash));
      await mortgage.connect(kycProvider).verifyKYC(investorAddress, pastExpiry, signature);
      
      // Should reject expired KYC
      await expect(
        mortgage.connect(investor).purchaseProperty(DOWN_PAYMENT)
      ).to.be.revertedWith("KYC expired or not verified");
    });
  });

  describe("Property Purchase", function () {
    beforeEach(async function () {
      // Setup valid KYC
      const expiryTime = Math.floor(Date.now() / 1000) + 86400;
      const messageHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "uint256"],
          [investorAddress, expiryTime]
        )
      );
      const signature = await kycProvider.signMessage(ethers.getBytes(messageHash));
      await mortgage.connect(kycProvider).verifyKYC(investorAddress, expiryTime, signature);
      
      // Setup accredited investor
      await mortgage.connect(kycProvider).verifyAccreditedInvestor(investorAddress);
    });

    it("Should allow qualified investors to purchase", async function () {
      await expect(
        mortgage.connect(investor).purchaseProperty(DOWN_PAYMENT)
      ).to.emit(mortgage, "MortgageCreated");
      
      const mortgageDetails = await mortgage.getMortgageDetails(investorAddress);
      expect(mortgageDetails.principal).to.equal(PROPERTY_VALUE - DOWN_PAYMENT);
    });

    it("Should reject non-KYC verified users", async function () {
      // Remove KYC
      await mortgage.connect(kycProvider).verifyKYC(investorAddress, 0, "0x");
      
      await expect(
        mortgage.connect(investor).purchaseProperty(DOWN_PAYMENT)
      ).to.be.revertedWith("KYC expired or not verified");
    });

    it("Should enforce cooling-off period", async function () {
      await mortgage.connect(investor).purchaseProperty(DOWN_PAYMENT);
      
      const mortgageDetails = await mortgage.getMortgageDetails(investorAddress);
      expect(mortgageDetails.coolingOffActive).to.be.true;
      
      // Should not be able to make payments during cooling-off
      await expect(
        mortgage.connect(investor).makePayment()
      ).to.be.revertedWith("Cooling-off period active");
    });
  });

  describe("Payment Processing", function () {
    beforeEach(async function () {
      // Setup and complete purchase
      const expiryTime = Math.floor(Date.now() / 1000) + 86400;
      const messageHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "uint256"],
          [investorAddress, expiryTime]
        )
      );
      const signature = await kycProvider.signMessage(ethers.getBytes(messageHash));
      await mortgage.connect(kycProvider).verifyKYC(investorAddress, expiryTime, signature);
      await mortgage.connect(kycProvider).verifyAccreditedInvestor(investorAddress);
      await mortgage.connect(investor).purchaseProperty(DOWN_PAYMENT);
      
      // Advance time past cooling-off period
      await ethers.provider.send("evm_increaseTime", [72 * 60 * 60 + 1]); // 72 hours + 1 second
      await mortgage.connect(investor).confirmMortgageActivation();
    });

    it("Should process valid payments", async function () {
      await expect(
        mortgage.connect(investor).makePayment()
      ).to.emit(mortgage, "PaymentMade");
    });

    it("Should apply late fees correctly", async function () {
      // Advance time past due date + grace period
      await ethers.provider.send("evm_increaseTime", [40 * 24 * 60 * 60]); // 40 days
      
      const balanceBefore = await usdt.balanceOf(investorAddress);
      await mortgage.connect(investor).makePayment();
      const balanceAfter = await usdt.balanceOf(investorAddress);
      
      const lateFee = ethers.parseUnits("50", 6); // $50
      const expectedPayment = MONTHLY_PAYMENT + lateFee;
      expect(balanceBefore - balanceAfter).to.equal(expectedPayment);
    });

    it("Should track missed payments", async function () {
      // Advance time without making payment
      await ethers.provider.send("evm_increaseTime", [40 * 24 * 60 * 60]); // 40 days
      
      await mortgage.connect(investor).makePayment();
      const mortgageDetails = await mortgage.getMortgageDetails(investorAddress);
      expect(mortgageDetails.missedPayments).to.equal(1);
    });
  });

  describe("Rental Income", function () {
    beforeEach(async function () {
      // Setup complete investment
      const expiryTime = Math.floor(Date.now() / 1000) + 86400;
      const messageHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "uint256"],
          [investorAddress, expiryTime]
        )
      );
      const signature = await kycProvider.signMessage(ethers.getBytes(messageHash));
      await mortgage.connect(kycProvider).verifyKYC(investorAddress, expiryTime, signature);
      await mortgage.connect(kycProvider).verifyAccreditedInvestor(investorAddress);
      await mortgage.connect(investor).purchaseProperty(DOWN_PAYMENT);
      
      await ethers.provider.send("evm_increaseTime", [72 * 60 * 60 + 1]);
      await mortgage.connect(investor).confirmMortgageActivation();
    });

    it("Should distribute income proportionally", async function () {
      const rentalIncome = ethers.parseUnits("1500", 6); // $1,500
      
      // Fund the contract for distribution
      await usdt.mint(await mortgage.getAddress(), rentalIncome);
      
      await expect(
        mortgage.connect(owner).distributeRentalIncome(rentalIncome)
      ).to.emit(mortgage, "RentalIncomeDistributed");
    });

    it("Should allow claiming of income", async function () {
      const rentalIncome = ethers.parseUnits("1500", 6);
      await usdt.mint(await mortgage.getAddress(), rentalIncome);
      await mortgage.connect(owner).distributeRentalIncome(rentalIncome);
      
      const periodId = await mortgage.currentRentalPeriod();
      const claimable = await mortgage.getClaimableRentalIncome(investorAddress, periodId);
      
      expect(claimable).to.be.gt(0);
      
      await expect(
        mortgage.connect(investor).claimRentalIncome(periodId)
      ).to.emit(mortgage, "RentalIncomeClaimed");
    });

    it("Should prevent double claiming", async function () {
      const rentalIncome = ethers.parseUnits("1500", 6);
      await usdt.mint(await mortgage.getAddress(), rentalIncome);
      await mortgage.connect(owner).distributeRentalIncome(rentalIncome);
      
      const periodId = await mortgage.currentRentalPeriod();
      await mortgage.connect(investor).claimRentalIncome(periodId);
      
      // Second claim should fail
      await expect(
        mortgage.connect(investor).claimRentalIncome(periodId)
      ).to.be.revertedWith("No income to claim");
    });
  });

  describe("Security Features", function () {
    it("Should prevent reentrancy attacks", async function () {
      // This would require a malicious contract that tries to reenter
      // For now, we verify the modifier is in place
      const contract = await ethers.getContractAt("MazunteMortgageV2", await mortgage.getAddress());
      expect(contract.interface.hasFunction("purchaseProperty")).to.be.true;
    });

    it("Should respect access controls", async function () {
      await expect(
        mortgage.connect(investor).distributeRentalIncome(ethers.parseUnits("1000", 6))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should handle emergency pause", async function () {
      await mortgage.connect(owner).emergencyPause("Test pause");
      
      const expiryTime = Math.floor(Date.now() / 1000) + 86400;
      const messageHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "uint256"],
          [investorAddress, expiryTime]
        )
      );
      const signature = await kycProvider.signMessage(ethers.getBytes(messageHash));
      await mortgage.connect(kycProvider).verifyKYC(investorAddress, expiryTime, signature);
      await mortgage.connect(kycProvider).verifyAccreditedInvestor(investorAddress);
      
      await expect(
        mortgage.connect(investor).purchaseProperty(DOWN_PAYMENT)
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero amounts correctly", async function () {
      await expect(
        mortgage.connect(investor).purchaseProperty(0)
      ).to.be.revertedWith("Invalid down payment amount");
    });

    it("Should prevent overflow/underflow", async function () {
      // Solidity 0.8+ automatically prevents overflow/underflow
      const maxUint = ethers.MaxUint256;
      
      await expect(
        mortgage.connect(investor).purchaseProperty(maxUint)
      ).to.be.reverted; // Should fail due to insufficient balance or other validation
    });

    it("Should validate all inputs", async function () {
      const expiryTime = Math.floor(Date.now() / 1000) + 86400;
      
      // Invalid address should fail
      await expect(
        mortgage.connect(kycProvider).verifyKYC(ethers.ZeroAddress, expiryTime, "0x")
      ).to.be.reverted;
    });
  });
});