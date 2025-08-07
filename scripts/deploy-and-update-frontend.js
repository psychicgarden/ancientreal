const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Starting Complete Mazunte Smart Contract Deployment & Frontend Update...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.getBalance()), "AVAX\n");

  // Deploy Test USDT first (for testnet only)
  console.log("📄 Deploying Test USDT...");
  const TestUSDT = await ethers.getContractFactory("TestUSDT");
  const usdt = await TestUSDT.deploy();
  await usdt.waitForDeployment();
  const usdtAddress = await usdt.getAddress();
  console.log("✅ Test USDT deployed to:", usdtAddress);

  // Set up addresses for deployment
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
  const mortgageAddress = await mortgage.getAddress();
  console.log("✅ MazunteMortgageV2 deployed to:", mortgageAddress);

  // Deploy Village Citizenship contract
  console.log("\n📄 Deploying Village Citizenship...");
  const VillageCitizenship = await ethers.getContractFactory("VillageCitizenship");
  const citizenship = await VillageCitizenship.deploy();
  await citizenship.waitForDeployment();
  const citizenshipAddress = await citizenship.getAddress();
  console.log("✅ Village Citizenship deployed to:", citizenshipAddress);

  // Deploy Rental Income Distribution contract
  console.log("\n📄 Deploying Rental Income Distribution...");
  const RentalDistribution = await ethers.getContractFactory("RentalIncomeDistribution");
  const rental = await RentalDistribution.deploy(mortgageAddress);
  await rental.waitForDeployment();
  const rentalAddress = await rental.getAddress();
  console.log("✅ Rental Distribution deployed to:", rentalAddress);

  // Deploy Secondary Marketplace contract
  console.log("\n📄 Deploying Secondary Marketplace...");
  const SecondaryMarketplace = await ethers.getContractFactory("SecondaryMarketplace");
  const marketplace = await SecondaryMarketplace.deploy();
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ Secondary Marketplace deployed to:", marketplaceAddress);

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
  console.log("   USDT Token:", usdtAddress);
  console.log("   Mazunte Mortgage:", mortgageAddress);
  console.log("   Village Citizenship:", citizenshipAddress);
  console.log("   Rental Distribution:", rentalAddress);
  console.log("   Secondary Marketplace:", marketplaceAddress);
  console.log("\n🌐 Network Information:");
  console.log("   Network:", network.name);
  console.log("   Chain ID:", network.config.chainId);
  console.log("   Explorer:", getExplorerUrl(network.config.chainId));
  
  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.config.chainId,
    contracts: {
      USDT: usdtAddress,
      MazunteMortgage: mortgageAddress,
      VillageCitizenship: citizenshipAddress,
      RentalDistribution: rentalAddress,
      SecondaryMarketplace: marketplaceAddress
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };

  // Write to file
  const deploymentFile = path.join(__dirname, '..', 'deployments', `${network.name}.json`);
  
  // Ensure deployments directory exists
  if (!fs.existsSync(path.dirname(deploymentFile))) {
    fs.mkdirSync(path.dirname(deploymentFile), { recursive: true });
  }
  
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n📁 Deployment info saved to: ${deploymentFile}`);
  
  // UPDATE FRONTEND CONTRACTS FILE
  console.log("\n🔄 Updating frontend contract addresses...");
  
  const contractsFilePath = path.join(__dirname, '..', 'src', 'lib', 'contracts.ts');
  
  // Read the current contracts file
  const contractsFileContent = fs.readFileSync(contractsFilePath, 'utf8');
  
  // Replace the addresses
  let updatedContent = contractsFileContent
    .replace(/address: "[^"]*",\s*\/\/ USDT/, `address: "${usdtAddress}", // USDT`)
    .replace(/address: "[^"]*",\s*\/\/ Mortgage/, `address: "${mortgageAddress}", // Mortgage`)
    .replace(/address: "[^"]*",\s*\/\/ Citizenship/, `address: "${citizenshipAddress}", // Citizenship`)
    .replace(/address: "[^"]*",\s*\/\/ Marketplace/, `address: "${marketplaceAddress}", // Marketplace`);
  
  // Write the updated file
  fs.writeFileSync(contractsFilePath, updatedContent);
  console.log("✅ Frontend contract addresses updated successfully!");
  
  console.log("\n💡 Next Steps:");
  console.log("   1. Run verification: npm run verify:fuji");
  console.log("   2. Test the frontend wallet connection");
  console.log("   3. Try purchasing a property with MetaMask");
  
  console.log("\n📱 Connect MetaMask to Avalanche Fuji:");
  console.log("   • Network: Avalanche Fuji C-Chain");
  console.log("   • RPC: https://api.avax-test.network/ext/bc/C/rpc");
  console.log("   • Chain ID: 43113");
  console.log("   • Symbol: AVAX");
  console.log("   • Explorer: https://testnet.snowtrace.io");
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