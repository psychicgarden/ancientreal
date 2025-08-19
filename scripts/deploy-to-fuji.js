const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Starting Ancient Smart Contracts Deployment to Fuji Testnet");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "AVAX");
  
  if (balance.lt(ethers.utils.parseEther("0.1"))) {
    throw new Error("Insufficient AVAX balance. Need at least 0.1 AVAX for deployment.");
  }
  
  const deploymentResults = {
    network: "fuji",
    chainId: 43113,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    contracts: {},
    gasUsed: {
      total: ethers.BigNumber.from(0)
    }
  };
  
  try {
    // 1. Deploy Mock USDT for testing
    console.log("\n📄 Deploying Mock USDT...");
    const MockUSDT = await ethers.getContractFactory("MockERC20");
    const usdt = await MockUSDT.deploy("Mock USDT", "USDT", 6);
    await usdt.deployed();
    
    const usdtReceipt = await usdt.deployTransaction.wait();
    deploymentResults.gasUsed.total = deploymentResults.gasUsed.total.add(usdtReceipt.gasUsed);
    
    console.log("✅ Mock USDT deployed to:", usdt.address);
    deploymentResults.contracts.USDT = {
      address: usdt.address,
      txHash: usdt.deployTransaction.hash,
      gasUsed: usdtReceipt.gasUsed.toString()
    };
    
    // 2. Deploy AncientMortgage
    console.log("\n🏠 Deploying AncientMortgage...");
    const AncientMortgage = await ethers.getContractFactory("AncientMortgage");
    const ancientMortgage = await AncientMortgage.deploy(
      usdt.address,
      deployer.address, // Treasury wallet
      deployer.address, // Lending pool (simplified for testing)
      deployer.address  // Trusted appraiser
    );
    await ancientMortgage.deployed();
    
    const mortgageReceipt = await ancientMortgage.deployTransaction.wait();
    deploymentResults.gasUsed.total = deploymentResults.gasUsed.total.add(mortgageReceipt.gasUsed);
    
    console.log("✅ AncientMortgage deployed to:", ancientMortgage.address);
    deploymentResults.contracts.ANCIENT_MORTGAGE = {
      address: ancientMortgage.address,
      txHash: ancientMortgage.deployTransaction.hash,
      gasUsed: mortgageReceipt.gasUsed.toString()
    };
    
    // 3. Deploy DeveloperEscrowManager
    console.log("\n🏗️ Deploying DeveloperEscrowManager...");
    const DeveloperEscrowManager = await ethers.getContractFactory("DeveloperEscrowManager");
    const escrowManager = await DeveloperEscrowManager.deploy(
      usdt.address,
      deployer.address // Treasury wallet
    );
    await escrowManager.deployed();
    
    const escrowReceipt = await escrowManager.deployTransaction.wait();
    deploymentResults.gasUsed.total = deploymentResults.gasUsed.total.add(escrowReceipt.gasUsed);
    
    console.log("✅ DeveloperEscrowManager deployed to:", escrowManager.address);
    deploymentResults.contracts.DEVELOPER_ESCROW = {
      address: escrowManager.address,
      txHash: escrowManager.deployTransaction.hash,
      gasUsed: escrowReceipt.gasUsed.toString()
    };
    
    // 4. Deploy EnhancedStakingPool
    console.log("\n💰 Deploying EnhancedStakingPool...");
    const EnhancedStakingPool = await ethers.getContractFactory("EnhancedStakingPool");
    const stakingPool = await EnhancedStakingPool.deploy(
      usdt.address,
      ancientMortgage.address,
      deployer.address // Treasury wallet
    );
    await stakingPool.deployed();
    
    const stakingReceipt = await stakingPool.deployTransaction.wait();
    deploymentResults.gasUsed.total = deploymentResults.gasUsed.total.add(stakingReceipt.gasUsed);
    
    console.log("✅ EnhancedStakingPool deployed to:", stakingPool.address);
    deploymentResults.contracts.STAKING_POOL = {
      address: stakingPool.address,
      txHash: stakingPool.deployTransaction.hash,
      gasUsed: stakingReceipt.gasUsed.toString()
    };
    
    // 5. Setup initial configuration
    console.log("\n⚙️ Setting up initial configuration...");
    
    // Mint initial USDT for testing
    const initialMint = ethers.utils.parseUnits("1000000", 6); // 1M USDT
    await usdt.mint(deployer.address, initialMint);
    console.log("✅ Minted 1M USDT to deployer for testing");
    
    // 6. Verification and Summary
    console.log("\n🎉 Deployment Summary:");
    console.log("====================");
    console.log("Network: Avalanche Fuji Testnet");
    console.log("Deployer:", deployer.address);
    console.log("Total Gas Used:", deploymentResults.gasUsed.total.toString());
    console.log();
    console.log("📋 Contract Addresses:");
    console.log("Mock USDT:", usdt.address);
    console.log("AncientMortgage:", ancientMortgage.address);
    console.log("DeveloperEscrowManager:", escrowManager.address);
    console.log("EnhancedStakingPool:", stakingPool.address);
    console.log();
    console.log("🔗 Testnet Explorer Links:");
    console.log("Mock USDT: https://testnet.snowtrace.io/address/" + usdt.address);
    console.log("AncientMortgage: https://testnet.snowtrace.io/address/" + ancientMortgage.address);
    console.log("DeveloperEscrowManager: https://testnet.snowtrace.io/address/" + escrowManager.address);
    console.log("EnhancedStakingPool: https://testnet.snowtrace.io/address/" + stakingPool.address);
    
    // 7. Save deployment results
    const deploymentFile = `deployments/fuji-deployment-${Date.now()}.json`;
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentResults, null, 2));
    console.log("\n💾 Deployment results saved to:", deploymentFile);
    
    // 8. Update frontend configuration
    const frontendConfig = {
      USDT: usdt.address,
      ANCIENT_MORTGAGE: ancientMortgage.address,
      DEVELOPER_ESCROW: escrowManager.address,
      STAKING_POOL: stakingPool.address,
    };
    
    console.log("\n📝 Frontend Configuration:");
    console.log("Add these addresses to src/lib/smart-contract-integration.ts:");
    console.log("fuji: {");
    Object.entries(frontendConfig).forEach(([key, value]) => {
      console.log(`  ${key}: '${value}',`);
    });
    console.log("}");
    
    // 9. Deployment verification
    console.log("\n✅ Running deployment verification...");
    
    // Verify contract deployments
    const usdtCode = await ethers.provider.getCode(usdt.address);
    const mortgageCode = await ethers.provider.getCode(ancientMortgage.address);
    const escrowCode = await ethers.provider.getCode(escrowManager.address);
    const stakingCode = await ethers.provider.getCode(stakingPool.address);
    
    if (usdtCode === "0x") throw new Error("USDT contract not deployed");
    if (mortgageCode === "0x") throw new Error("AncientMortgage contract not deployed");
    if (escrowCode === "0x") throw new Error("DeveloperEscrowManager contract not deployed");
    if (stakingCode === "0x") throw new Error("EnhancedStakingPool contract not deployed");
    
    console.log("✅ All contracts verified on-chain");
    
    console.log("\n🎯 Next Steps:");
    console.log("1. Update frontend smart-contract-integration.ts with new addresses");
    console.log("2. Enable testnet feature flags in feature-flags.ts");
    console.log("3. Run comprehensive tests against deployed contracts");
    console.log("4. Verify all contracts on Snowtrace");
    console.log("5. Test full integration with platform frontend");
    
  } catch (error) {
    console.error("\n❌ Deployment failed:", error);
    
    // Save partial deployment results if any contracts were deployed
    if (Object.keys(deploymentResults.contracts).length > 0) {
      const failedDeploymentFile = `deployments/fuji-deployment-failed-${Date.now()}.json`;
      deploymentResults.error = error.message;
      fs.writeFileSync(failedDeploymentFile, JSON.stringify(deploymentResults, null, 2));
      console.log("Partial deployment results saved to:", failedDeploymentFile);
    }
    
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });