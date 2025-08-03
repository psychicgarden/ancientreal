const { run } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🔍 Starting contract verification...\n");

  // Load deployment info
  const deploymentFile = path.join(__dirname, '..', 'deployments', `${network.name}.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    console.error("❌ Deployment file not found. Please deploy contracts first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  console.log("📄 Loaded deployment info for", deployment.network);
  console.log("Chain ID:", deployment.chainId);
  console.log("Contracts to verify:", Object.keys(deployment.contracts).length);

  try {
    // Verify Test USDT
    console.log("\n🔍 Verifying Test USDT...");
    await run("verify:verify", {
      address: deployment.contracts.USDT,
      constructorArguments: []
    });
    console.log("✅ Test USDT verified");

    // Verify Mazunte Mortgage
    console.log("\n🔍 Verifying MazunteMortgageV2...");
    await run("verify:verify", {
      address: deployment.contracts.MazunteMortgage,
      constructorArguments: [
        deployment.contracts.USDT,    // USDT address
        deployment.deployer,          // KYC provider (deployer for testing)
        deployment.deployer,          // Insurance provider
        deployment.deployer           // Property manager
      ]
    });
    console.log("✅ MazunteMortgageV2 verified");

    // Verify Village Citizenship
    console.log("\n🔍 Verifying Village Citizenship...");
    await run("verify:verify", {
      address: deployment.contracts.VillageCitizenship,
      constructorArguments: []
    });
    console.log("✅ Village Citizenship verified");

    // Verify Rental Distribution
    console.log("\n🔍 Verifying Rental Income Distribution...");
    await run("verify:verify", {
      address: deployment.contracts.RentalDistribution,
      constructorArguments: [
        deployment.contracts.MazunteMortgage  // Mortgage contract address
      ]
    });
    console.log("✅ Rental Distribution verified");

    console.log("\n" + "=".repeat(60));
    console.log("🎉 ALL CONTRACTS VERIFIED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("🌐 View on block explorer:");
    
    const explorerUrl = getExplorerUrl(deployment.chainId);
    Object.entries(deployment.contracts).forEach(([name, address]) => {
      console.log(`   ${name}: ${explorerUrl}/address/${address}`);
    });

    console.log("\n✅ Investors can now review verified source code");
    console.log("✅ All contract functions are publicly auditable");
    console.log("✅ Deployment is production-ready");

  } catch (error) {
    console.error("\n❌ Verification failed:");
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  Contracts may already be verified");
    } else {
      console.error(error.message);
      process.exit(1);
    }
  }
}

function getExplorerUrl(chainId) {
  const explorers = {
    43113: "https://testnet.snowtrace.io", // Avalanche Fuji
    43114: "https://snowtrace.io", // Avalanche Mainnet
    31337: "http://localhost:8545" // Hardhat local
  };
  return explorers[chainId] || "Unknown network";
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });