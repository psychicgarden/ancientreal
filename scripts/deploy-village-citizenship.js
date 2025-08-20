const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🏛️ Deploying VillageCitizenship contract to Fuji testnet...");
  
  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "AVAX");
  
  if (balance < ethers.parseEther("0.1")) {
    throw new Error("Insufficient AVAX balance for deployment");
  }
  
  // Deploy VillageCitizenship contract
  console.log("\n📋 Deploying VillageCitizenship...");
  const VillageCitizenship = await ethers.getContractFactory("VillageCitizenship");
  const villageCitizenship = await VillageCitizenship.deploy();
  await villageCitizenship.waitForDeployment();
  
  const villageCitizenshipAddress = await villageCitizenship.getAddress();
  const deploymentTx = villageCitizenship.deploymentTransaction();
  
  console.log("✅ VillageCitizenship deployed to:", villageCitizenshipAddress);
  console.log("📝 Transaction hash:", deploymentTx.hash);
  
  // Verify the deployment worked
  console.log("\n🔍 Verifying deployment...");
  const citizenshipFee = await villageCitizenship.CITIZENSHIP_FEE();
  console.log("Citizenship fee:", ethers.formatEther(citizenshipFee), "AVAX");
  
  // Calculate gas used
  const receipt = await deploymentTx.wait();
  const gasUsed = receipt.gasUsed;
  const gasPrice = deploymentTx.gasPrice;
  const totalCost = gasUsed * gasPrice;
  
  console.log("⛽ Gas used:", gasUsed.toString());
  console.log("💰 Deployment cost:", ethers.formatEther(totalCost), "AVAX");
  
  // Deployment summary
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contracts: {
      VillageCitizenship: {
        address: villageCitizenshipAddress,
        transactionHash: deploymentTx.hash,
        gasUsed: gasUsed.toString(),
        deploymentCost: ethers.formatEther(totalCost)
      }
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: receipt.blockNumber
  };
  
  console.log("\n🎉 VillageCitizenship Deployment Complete!");
  console.log("📊 Deployment Summary:");
  console.log("Network:", deploymentInfo.network);
  console.log("Contract Address:", villageCitizenshipAddress);
  console.log("Explorer URL:", getExplorerUrl(hre.network.config.chainId) + "/address/" + villageCitizenshipAddress);
  
  // Save deployment info to file
  const fs = require('fs');
  const path = require('path');
  
  // Ensure deployments directory exists
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Save to network-specific file
  const fileName = `${hre.network.name}-village-citizenship.json`;
  const filePath = path.join(deploymentsDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`📁 Deployment info saved to: ${filePath}`);
  
  // Return deployment info for further processing
  return deploymentInfo;
}

function getExplorerUrl(chainId) {
  switch (chainId) {
    case 43113: // Fuji Testnet
      return "https://testnet.snowtrace.io";
    case 43114: // Avalanche Mainnet
      return "https://snowtrace.io";
    default:
      return "https://testnet.snowtrace.io";
  }
}

// Only run main if this script is executed directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Deployment failed:", error);
      process.exit(1);
    });
}

module.exports = { main };