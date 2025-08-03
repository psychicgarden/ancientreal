const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Mazunte Smart Contract Deployment...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.getBalance()), "AVAX\n");

  // Deploy Test USDT first (for testnet only)
  console.log("📄 Deploying Test USDT...");
  const TestUSDT = await ethers.getContractFactory("TestUSDT");
  const usdt = await TestUSDT.deploy();
  await usdt.waitForDeployment();
  console.log("✅ Test USDT deployed to:", await usdt.getAddress());

  // Set up addresses for deployment
  const usdtAddress = await usdt.getAddress();
  const kycProviderAddress = deployer.address; // In production, use dedicated KYC provider
  const insuranceProviderAddress = deployer.address; // In production, use insurance provider
  const propertyManagerAddress = deployer.address; // In production, use property manager

  console.log("\n📄 Deploying MazunteMortgageV2...");
  const MazunteMortgage = await ethers.getContractFactory("MazunteMortgageV2");
  const mortgage = await MazunteMortgage.deploy(
    usdtAddress,
    kycProviderAddress,
    insuranceProviderAddress,
    propertyManagerAddress
  );
  await mortgage.waitForDeployment();
  console.log("✅ MazunteMortgageV2 deployed to:", await mortgage.getAddress());

  // Deploy Village Citizenship contract
  console.log("\n📄 Deploying Village Citizenship...");
  const VillageCitizenship = await ethers.getContractFactory("VillageCitizenship");
  const citizenship = await VillageCitizenship.deploy();
  await citizenship.waitForDeployment();
  console.log("✅ Village Citizenship deployed to:", await citizenship.getAddress());

  // Deploy Rental Income Distribution contract
  console.log("\n📄 Deploying Rental Income Distribution...");
  const RentalDistribution = await ethers.getContractFactory("RentalIncomeDistribution");
  const rental = await RentalDistribution.deploy(await mortgage.getAddress());
  await rental.waitForDeployment();
  console.log("✅ Rental Distribution deployed to:", await rental.getAddress());

  // Mint test USDT for testing (testnet only)
  console.log("\n💰 Minting test USDT for deployer...");
  const testAmount = ethers.parseUnits("100000", 6); // $100,000 USDT
  await usdt.mint(deployer.address, testAmount);
  console.log("✅ Minted 100,000 test USDT to deployer");

  // Set up initial KYC for deployer (for testing)
  console.log("\n🔐 Setting up test KYC verification...");
  const expiryTime = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60); // 1 year
  const messageHash = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["address", "uint256"],
      [deployer.address, expiryTime]
    )
  );
  const signature = await deployer.signMessage(ethers.getBytes(messageHash));
  await mortgage.verifyKYC(deployer.address, expiryTime, signature);
  await mortgage.verifyAccreditedInvestor(deployer.address);
  console.log("✅ Test KYC and accreditation set up for deployer");

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("📋 Contract Addresses:");
  console.log("   USDT Token:", await usdt.getAddress());
  console.log("   Mazunte Mortgage:", await mortgage.getAddress());
  console.log("   Village Citizenship:", await citizenship.getAddress());
  console.log("   Rental Distribution:", await rental.getAddress());
  console.log("\n🌐 Network Information:");
  console.log("   Network:", network.name);
  console.log("   Chain ID:", network.config.chainId);
  console.log("   Explorer:", getExplorerUrl(network.config.chainId));
  console.log("\n💡 Next Steps:");
  console.log("   1. Verify contracts on block explorer");
  console.log("   2. Update frontend contract addresses");
  console.log("   3. Fund contracts for initial operations");
  console.log("   4. Set up production KYC provider");
  console.log("   5. Configure insurance and property management");
  
  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.config.chainId,
    contracts: {
      USDT: await usdt.getAddress(),
      MazunteMortgage: await mortgage.getAddress(),
      VillageCitizenship: await citizenship.getAddress(),
      RentalDistribution: await rental.getAddress()
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };

  // Write to file
  const fs = require('fs');
  const path = require('path');
  const deploymentFile = path.join(__dirname, '..', 'deployments', `${network.name}.json`);
  
  // Ensure deployments directory exists
  if (!fs.existsSync(path.dirname(deploymentFile))) {
    fs.mkdirSync(path.dirname(deploymentFile), { recursive: true });
  }
  
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n📁 Deployment info saved to: ${deploymentFile}`);
}

function getExplorerUrl(chainId) {
  const explorers = {
    43113: "https://testnet.snowtrace.io", // Avalanche Fuji
    43114: "https://snowtrace.io", // Avalanche Mainnet
    31337: "http://localhost:8545" // Hardhat local
  };
  return explorers[chainId] || "Unknown network";
}

// Handle deployment errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });