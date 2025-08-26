const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Enhanced AVAX Mortgage Contract...");

  // Get the contract factory
  const EnhancedAvaxMortgage = await ethers.getContractFactory("EnhancedAvaxMortgage");
  
  // Deploy the contract
  console.log("📄 Deploying contract...");
  const enhancedMortgage = await EnhancedAvaxMortgage.deploy();
  
  // Wait for deployment
  await enhancedMortgage.waitForDeployment();
  const contractAddress = await enhancedMortgage.getAddress();
  
  console.log("✅ EnhancedAvaxMortgage deployed to:", contractAddress);
  
  // Add some demo properties to the contract
  console.log("🏠 Adding demo properties...");
  
  // Property 1: Art Deco Loft Mazunte (our featured property)
  const propertyValue1 = ethers.parseEther("0.00129"); // $129,000 in testing AVAX
  const tx1 = await enhancedMortgage.addProperty(
    "Art Deco Loft Oceanview",
    "Mazunte, Mexico", 
    "/src/assets/art-deco-loft-mexico.jpg",
    propertyValue1
  );
  await tx1.wait();
  console.log("✅ Property 1 added: Art Deco Loft Mazunte");
  
  // Property 2: Bahia Beach Bungalow
  const propertyValue2 = ethers.parseEther("0.00095"); // $95,000 in testing AVAX
  const tx2 = await enhancedMortgage.addProperty(
    "Bahia Beach Bungalow",
    "Bahia, Brazil",
    "/src/assets/bahia-beach-bungalow.jpg", 
    propertyValue2
  );
  await tx2.wait();
  console.log("✅ Property 2 added: Bahia Beach Bungalow");
  
  // Property 3: Ericeira Coastal Villa
  const propertyValue3 = ethers.parseEther("0.00199"); // $199,000 in testing AVAX
  const tx3 = await enhancedMortgage.addProperty(
    "Ericeira Coastal Villa",
    "Ericeira, Portugal",
    "/src/assets/villa-ericeira-portugal.jpg",
    propertyValue3
  );
  await tx3.wait();
  console.log("✅ Property 3 added: Ericeira Coastal Villa");
  
  console.log("\n📋 Deployment Summary:");
  console.log("Contract Address:", contractAddress);
  console.log("Network: Avalanche Fuji Testnet");
  console.log("Properties Added: 3");
  console.log("Ready for integration!");
  
  // Return deployment info
  return {
    contractAddress,
    network: "fuji",
    contractName: "EnhancedAvaxMortgage",
    properties: [
      { id: 1, name: "Art Deco Loft Oceanview", value: "0.00129 AVAX" },
      { id: 2, name: "Bahia Beach Bungalow", value: "0.00095 AVAX" },
      { id: 3, name: "Ericeira Coastal Villa", value: "0.00199 AVAX" }
    ]
  };
}

// Handle both direct execution and module export
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Deployment failed:", error);
      process.exit(1);
    });
} else {
  module.exports = main;
}