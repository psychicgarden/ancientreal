const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying Lending Pool Architecture...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy existing contracts first
  const TestUSDT = await hre.ethers.getContractFactory("TestUSDT");
  const usdt = await TestUSDT.deploy();
  await usdt.waitForDeployment();
  console.log("✅ TestUSDT deployed to:", await usdt.getAddress());

  // Deploy new compliance and regulatory contracts
  const RegulatoryReporting = await hre.ethers.getContractFactory("RegulatoryReporting");
  const regulatoryReporting = await RegulatoryReporting.deploy();
  await regulatoryReporting.waitForDeployment();
  console.log("✅ RegulatoryReporting deployed to:", await regulatoryReporting.getAddress());

  const MexicanPropertyCompliance = await hre.ethers.getContractFactory("MexicanPropertyCompliance");
  const mexicanCompliance = await MexicanPropertyCompliance.deploy(
    deployer.address, // RNIE authority
    deployer.address, // Property registry authority  
    deployer.address, // Tax authority
    deployer.address  // Municipal authority
  );
  await mexicanCompliance.waitForDeployment();
  console.log("✅ MexicanPropertyCompliance deployed to:", await mexicanCompliance.getAddress());

  const NevisHoldingInterface = await hre.ethers.getContractFactory("NevisHoldingInterface");
  const nevisHolding = await NevisHoldingInterface.deploy(
    "Ancient Holdings Ltd.",
    "NV-2024-001",
    "Suite 1, Riverview Plaza, Nevis"
  );
  await nevisHolding.waitForDeployment();
  console.log("✅ NevisHoldingInterface deployed to:", await nevisHolding.getAddress());

  // Deploy main lending pool manager
  const LendingPoolManager = await hre.ethers.getContractFactory("LendingPoolManager");
  const lendingPool = await LendingPoolManager.deploy(
    await usdt.getAddress(),
    await nevisHolding.getAddress(),
    await mexicanCompliance.getAddress(),
    750 // 7.5% base APY
  );
  await lendingPool.waitForDeployment();
  console.log("✅ LendingPoolManager deployed to:", await lendingPool.getAddress());

  // Setup cross-contract connections
  await nevisHolding.setLendingPoolManager(await lendingPool.getAddress());
  await regulatoryReporting.setContractAddresses(
    await lendingPool.getAddress(),
    hre.ethers.ZeroAddress, // Mortgage contract (to be set later)
    await nevisHolding.getAddress(),
    await mexicanCompliance.getAddress()
  );

  // Add initial directors to Nevis holding company
  await nevisHolding.addDirector(deployer.address, "Initial Director", "Nevis");
  
  console.log("\n🎉 Lending Pool Architecture Deployed Successfully!");
  console.log("=" * 60);
  console.log(`LendingPoolManager: ${await lendingPool.getAddress()}`);
  console.log(`NevisHoldingInterface: ${await nevisHolding.getAddress()}`);
  console.log(`MexicanPropertyCompliance: ${await mexicanCompliance.getAddress()}`);
  console.log(`RegulatoryReporting: ${await regulatoryReporting.getAddress()}`);
  console.log(`TestUSDT: ${await usdt.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });