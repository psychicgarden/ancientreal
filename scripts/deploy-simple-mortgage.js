const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying SimpleMortgage contract to Fuji testnet...");
  
  // Get the contract factory
  const SimpleMortgage = await ethers.getContractFactory("SimpleMortgage");
  
  // TestUSDT address on Fuji (from existing deployment)
  const USDT_ADDRESS = "0x43eCed1b7C1BDc6522Db5a2F39905Cc0E3CE7F28";
  
  console.log(`📋 Using TestUSDT at: ${USDT_ADDRESS}`);
  
  // Deploy the contract
  console.log("⏳ Deploying contract...");
  const simpleMortgage = await SimpleMortgage.deploy(USDT_ADDRESS);
  
  console.log("⏳ Waiting for deployment confirmation...");
  await simpleMortgage.waitForDeployment();
  
  const contractAddress = await simpleMortgage.getAddress();
  console.log(`✅ SimpleMortgage deployed to: ${contractAddress}`);
  
  // Wait for a few blocks before verification
  console.log("⏳ Waiting for block confirmations...");
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  // Verify contract on Snowtrace
  try {
    console.log("📝 Verifying contract on Snowtrace...");
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [USDT_ADDRESS],
    });
    console.log("✅ Contract verified on Snowtrace");
  } catch (error) {
    console.log("⚠️ Verification failed:", error.message);
  }
  
  // Output deployment summary
  console.log("\n🎉 DEPLOYMENT COMPLETE!");
  console.log("==============================");
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`🔗 Snowtrace: https://testnet.snowtrace.io/address/${contractAddress}`);
  console.log(`💰 TestUSDT: ${USDT_ADDRESS}`);
  console.log("==============================");
  
  return {
    address: contractAddress,
    name: "SimpleMortgage",
    network: "fuji",
    usdtAddress: USDT_ADDRESS
  };
}

// Handle script execution
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Deployment failed:", error);
      process.exit(1);
    });
}

module.exports = main;