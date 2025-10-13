/**
 * Deploy Ancient SC Contracts from Submodule
 * 
 * This script deploys contracts from /ancient-sc/contracts/
 * and stores their addresses in the contract_addresses table
 * with source = 'ancient-sc'
 */

const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Deploying Ancient SC contracts to Avalanche Fuji testnet...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "AVAX\n");

  if (balance < hre.ethers.parseEther("0.1")) {
    console.log("⚠️  Warning: Low AVAX balance. Get testnet AVAX from https://faucet.avax.network/");
  }

  // Check if ancient-sc submodule exists
  const ancientScPath = path.join(__dirname, '../ancient-sc/contracts');
  if (!fs.existsSync(ancientScPath)) {
    console.error("❌ Ancient SC submodule not found!");
    console.error("Run: git submodule update --init --recursive");
    process.exit(1);
  }

  console.log("✅ Ancient SC submodule found at:", ancientScPath, "\n");

  const deploymentResults = {
    network: "fuji",
    chainId: 43113,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: [],
    totalGasUsed: 0n
  };

  try {
    // Deploy TestUSDT
    console.log("📝 Deploying TestUSDT...");
    const TestUSDT = await hre.ethers.getContractFactory("TestUSDT");
    const usdt = await TestUSDT.deploy();
    await usdt.waitForDeployment();
    const usdtAddress = await usdt.getAddress();
    
    const usdtReceipt = await usdt.deploymentTransaction().wait();
    console.log("✅ TestUSDT deployed to:", usdtAddress);
    console.log("   Gas used:", usdtReceipt.gasUsed.toString(), "\n");

    deploymentResults.contracts.push({
      name: "TestUSDT",
      address: usdtAddress,
      txHash: usdtReceipt.hash,
      gasUsed: usdtReceipt.gasUsed.toString(),
      source: "ancient-sc"
    });
    deploymentResults.totalGasUsed += usdtReceipt.gasUsed;

    // Deploy EnhancedStakingPool
    console.log("📝 Deploying EnhancedStakingPool...");
    const StakingPool = await hre.ethers.getContractFactory("EnhancedStakingPool");
    const stakingPool = await StakingPool.deploy(
      usdtAddress,
      deployer.address, // temporary mortgage contract address
      deployer.address  // treasury
    );
    await stakingPool.waitForDeployment();
    const stakingAddress = await stakingPool.getAddress();
    
    const stakingReceipt = await stakingPool.deploymentTransaction().wait();
    console.log("✅ EnhancedStakingPool deployed to:", stakingAddress);
    console.log("   Gas used:", stakingReceipt.gasUsed.toString(), "\n");

    deploymentResults.contracts.push({
      name: "EnhancedStakingPool",
      address: stakingAddress,
      txHash: stakingReceipt.hash,
      gasUsed: stakingReceipt.gasUsed.toString(),
      source: "ancient-sc"
    });
    deploymentResults.totalGasUsed += stakingReceipt.gasUsed;

    // Deploy AncientMortgage
    console.log("📝 Deploying AncientMortgage...");
    const AncientMortgage = await hre.ethers.getContractFactory("AncientMortgage");
    const mortgage = await AncientMortgage.deploy(
      usdtAddress,
      deployer.address, // treasury
      stakingAddress,   // lending pool (staking pool)
      deployer.address  // trusted appraiser
    );
    await mortgage.waitForDeployment();
    const mortgageAddress = await mortgage.getAddress();
    
    const mortgageReceipt = await mortgage.deploymentTransaction().wait();
    console.log("✅ AncientMortgage deployed to:", mortgageAddress);
    console.log("   Gas used:", mortgageReceipt.gasUsed.toString(), "\n");

    deploymentResults.contracts.push({
      name: "AncientMortgage",
      address: mortgageAddress,
      txHash: mortgageReceipt.hash,
      gasUsed: mortgageReceipt.gasUsed.toString(),
      source: "ancient-sc"
    });
    deploymentResults.totalGasUsed += mortgageReceipt.gasUsed;

    // Configure contracts
    console.log("⚙️  Configuring contracts...");
    
    // Mint test USDT to deployer
    const mintTx = await usdt.mint(deployer.address, hre.ethers.parseUnits("1000000", 6));
    await mintTx.wait();
    console.log("✅ Minted 1,000,000 test USDT to deployer\n");

    // Set KYC for deployer in AncientMortgage
    const kycTx = await mortgage.setUserKYC(deployer.address, true);
    await kycTx.wait();
    console.log("✅ Set KYC for deployer\n");

    // Set accredited status for deployer
    const accreditedTx = await mortgage.setUserAccredited(deployer.address, true);
    await accreditedTx.wait();
    console.log("✅ Set accredited status for deployer\n");

    // Print summary
    console.log("═══════════════════════════════════════════════════");
    console.log("📊 DEPLOYMENT SUMMARY - Ancient SC Contracts");
    console.log("═══════════════════════════════════════════════════");
    console.log("Network:        Avalanche Fuji Testnet");
    console.log("Chain ID:       43113");
    console.log("Deployer:      ", deployer.address);
    console.log("Timestamp:     ", deploymentResults.timestamp);
    console.log("\n📋 CONTRACT ADDRESSES:");
    deploymentResults.contracts.forEach(contract => {
      console.log(`\n${contract.name}:`);
      console.log(`  Address: ${contract.address}`);
      console.log(`  TX Hash: ${contract.txHash}`);
      console.log(`  Source:  ${contract.source}`);
      console.log(`  Snowtrace: https://testnet.snowtrace.io/address/${contract.address}`);
    });
    console.log("\nTotal Gas Used:", deploymentResults.totalGasUsed.toString());
    console.log("═══════════════════════════════════════════════════\n");

    // Save deployment info
    const outputPath = path.join(__dirname, '../ancient-sc-deployment.json');
    fs.writeFileSync(outputPath, JSON.stringify(deploymentResults, null, 2));
    console.log("💾 Deployment info saved to:", outputPath, "\n");

    console.log("🎯 NEXT STEPS:");
    console.log("1. Update contract addresses in src/config/chain.ts");
    console.log("2. Update ancient-sc-integration.ts with these addresses");
    console.log("3. Run database migration to add contracts to contract_addresses table");
    console.log("4. Test the integration in the admin dashboard\n");

    return deploymentResults;

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
