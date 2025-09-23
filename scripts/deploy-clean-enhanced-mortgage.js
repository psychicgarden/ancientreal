const { ethers } = require("hardhat");
const { ContractDatabaseIntegration } = require("../src/lib/contract-database-integration.ts");

async function main() {
  console.log("🚀 Deploying Clean EnhancedAvaxMortgage Contract for Admin Dashboard...");

  // Get the contract factory
  const EnhancedAvaxMortgage = await ethers.getContractFactory("EnhancedAvaxMortgage");
  
  // Deploy the contract
  console.log("📄 Deploying new EnhancedAvaxMortgage contract...");
  const enhancedMortgage = await EnhancedAvaxMortgage.deploy();
  
  // Wait for deployment
  await enhancedMortgage.waitForDeployment();
  const contractAddress = await enhancedMortgage.getAddress();
  
  console.log("✅ EnhancedAvaxMortgage deployed to:", contractAddress);
  
  // Add the Art Deco Loft property for admin dashboard testing
  console.log("🏠 Adding Art Deco Loft property...");
  
  // Property: Art Deco Loft Mazunte (featured property for admin dashboard)
  const propertyValue = ethers.parseEther("0.00129"); // $129,000 in test AVAX ratio
  const tx = await enhancedMortgage.addProperty(
    "Art Deco Loft Oceanview",
    "Mazunte, Mexico", 
    "/src/assets/art-deco-loft-mexico.jpg",
    propertyValue
  );
  await tx.wait();
  console.log("✅ Art Deco Loft property added (Property ID: 1)");
  
  // Update database with the new ENHANCED_AVAX_MORTGAGE address
  console.log("💾 Updating database with new contract address...");
  try {
    // Use a more specific name to avoid conflicts
    const updateSuccess = await ContractDatabaseIntegration.updateContractAddress(
      'ENHANCED_AVAX_MORTGAGE', 
      contractAddress, 
      'fuji',
      tx.hash
    );
    
    if (updateSuccess) {
      console.log("✅ Database updated successfully");
    } else {
      console.log("⚠️ Database update failed, but contract is deployed");
    }
  } catch (dbError) {
    console.error("❌ Database update error:", dbError.message);
    console.log("📝 Please manually update contract_addresses table with:");
    console.log(`   Contract: ENHANCED_AVAX_MORTGAGE`);
    console.log(`   Address: ${contractAddress}`);
    console.log(`   Network: fuji`);
  }
  
  console.log("\n📋 Deployment Summary:");
  console.log("Contract Name: EnhancedAvaxMortgage");
  console.log("Contract Address:", contractAddress);
  console.log("Network: Avalanche Fuji Testnet");
  console.log("Property Added: Art Deco Loft Oceanview ($129K)");
  console.log("Ready for Admin Dashboard integration!");
  
  // Return deployment info
  return {
    contractAddress,
    network: "fuji",
    contractName: "EnhancedAvaxMortgage",
    propertyId: 1,
    propertyName: "Art Deco Loft Oceanview",
    propertyValue: "0.00129 AVAX ($129,000 USD)"
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