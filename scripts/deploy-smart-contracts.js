const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying smart contracts to Avalanche Fuji testnet...");
  
  const [deployer] = await ethers.getSigners();
  const deployerBalance = await ethers.provider.getBalance(deployer.address);
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(deployerBalance), "AVAX");
  
  if (deployerBalance < ethers.parseEther("0.1")) {
    throw new Error("Insufficient AVAX balance. Need at least 0.1 AVAX for deployment.");
  }

  const deploymentResults = {};

  try {
    // 1. Deploy Mock USDT (6 decimals)
    console.log("\n📄 Deploying MockUSDT...");
    const MockUSDT = await ethers.getContractFactory("TestUSDT");
    const usdt = await MockUSDT.deploy();
    await usdt.waitForDeployment();
    
    deploymentResults.USDT = {
      address: await usdt.getAddress(),
      txHash: usdt.deploymentTransaction().hash,
      gasUsed: (await usdt.deploymentTransaction().wait()).gasUsed
    };
    console.log("✅ MockUSDT deployed:", deploymentResults.USDT.address);

    // 2. Deploy Enhanced Staking Pool
    console.log("\n🏦 Deploying EnhancedStakingPool...");
    const StakingPool = await ethers.getContractFactory("EnhancedStakingPool");
    const stakingPool = await StakingPool.deploy(
      deploymentResults.USDT.address,
      "0x0000000000000000000000000000000000000000", // Placeholder for mortgage contract
      deployer.address // Treasury wallet
    );
    await stakingPool.waitForDeployment();
    
    deploymentResults.STAKING_POOL = {
      address: await stakingPool.getAddress(),
      txHash: stakingPool.deploymentTransaction().hash,
      gasUsed: (await stakingPool.deploymentTransaction().wait()).gasUsed
    };
    console.log("✅ EnhancedStakingPool deployed:", deploymentResults.STAKING_POOL.address);

    // 3. Deploy Ancient Mortgage (with staking pool address)
    console.log("\n🏠 Deploying AncientMortgage...");
    const AncientMortgage = await ethers.getContractFactory("AncientMortgage");
    const mortgage = await AncientMortgage.deploy(
      deploymentResults.USDT.address,
      deployer.address, // Treasury wallet
      deploymentResults.STAKING_POOL.address, // Staking pool as lending pool
      deployer.address // Trusted appraiser
    );
    await mortgage.waitForDeployment();
    
    deploymentResults.ANCIENT_MORTGAGE = {
      address: await mortgage.getAddress(),
      txHash: mortgage.deploymentTransaction().hash,
      gasUsed: (await mortgage.deploymentTransaction().wait()).gasUsed
    };
    console.log("✅ AncientMortgage deployed:", deploymentResults.ANCIENT_MORTGAGE.address);

    // 4. Configure contracts
    console.log("\n⚙️ Configuring contracts...");
    
    // Mint test USDT to deployer for testing
    console.log("Minting test USDT...");
    await (await usdt.mint(deployer.address, ethers.parseUnits("1000000", 6))).wait();
    console.log("✅ Minted 1,000,000 USDT to deployer");

    // Set up KYC and accreditation for deployer
    console.log("Setting up test KYC...");
    await (await mortgage.setKYCVerified(deployer.address, true)).wait();
    await (await mortgage.setAccreditedInvestor(deployer.address, true)).wait();
    console.log("✅ Deployer KYC and accreditation set");

    // Calculate total gas used
    const totalGasUsed = Object.values(deploymentResults).reduce((total, result) => {
      return total + (result.gasUsed ? Number(result.gasUsed) : 0n);
    }, 0n);

    // Print deployment summary
    console.log("\n🎉 DEPLOYMENT SUMMARY");
    console.log("=" .repeat(50));
    console.log("Network: Avalanche Fuji Testnet (43113)");
    console.log("Deployer:", deployer.address);
    console.log("Block Explorer: https://testnet.snowtrace.io");
    console.log("");
    console.log("📄 MockUSDT:", deploymentResults.USDT.address);
    console.log("🏦 EnhancedStakingPool:", deploymentResults.STAKING_POOL.address);
    console.log("🏠 AncientMortgage:", deploymentResults.ANCIENT_MORTGAGE.address);
    console.log("");
    console.log("Total Gas Used:", totalGasUsed.toString());
    console.log("=" .repeat(50));

    // Save deployment info
    const deploymentInfo = {
      network: "fuji",
      chainId: 43113,
      contracts: {
        USDT: deploymentResults.USDT.address,
        ANCIENT_MORTGAGE: deploymentResults.ANCIENT_MORTGAGE.address,
        STAKING_POOL: deploymentResults.STAKING_POOL.address,
      },
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      blockNumber: await ethers.provider.getBlockNumber(),
      gasUsed: totalGasUsed.toString()
    };

    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentFile = path.join(deploymentsDir, "fuji-latest.json");
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log("💾 Deployment info saved to:", deploymentFile);

    // Update frontend configuration
    console.log("\n🔧 Frontend Configuration:");
    console.log("Update CONTRACT_ADDRESSES in smart-contract-integration.ts:");
    console.log(`fuji: {`);
    console.log(`  USDT: '${deploymentResults.USDT.address}',`);
    console.log(`  ANCIENT_MORTGAGE: '${deploymentResults.ANCIENT_MORTGAGE.address}',`);
    console.log(`  STAKING_POOL: '${deploymentResults.STAKING_POOL.address}',`);
    console.log(`}`);

    console.log("\n✅ DEPLOYMENT COMPLETE! Contracts are ready for integration.");
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });