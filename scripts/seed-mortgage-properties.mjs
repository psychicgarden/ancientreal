/**
 * Property Seeding Script for AncientMortgage Contract
 * 
 * This script seeds initial properties into the deployed mortgage contract.
 * Run manually when deploying to a new network.
 * 
 * Usage: node scripts/seed-mortgage-properties.mjs
 */

import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// Properties to seed (matching frontend catalog)
const PROPERTIES = [
  {
    name: "Art Deco Loft Oceanview",
    location: "Mazunte, Mexico",
    imageUrl: "ipfs://QmPropertyImage1", // Replace with actual IPFS hash
    totalValue: ethers.parseUnits("129000", 6) // $129,000 in USDC (6 decimals)
  },
  {
    name: "Bahia Beach Bungalow",
    location: "Bahia, Brazil",
    imageUrl: "ipfs://QmPropertyImage2",
    totalValue: ethers.parseUnits("150000", 6) // $150,000
  },
  {
    name: "Ericeira Coastal Villa",
    location: "Ericeira, Portugal",
    imageUrl: "ipfs://QmPropertyImage3",
    totalValue: ethers.parseUnits("180000", 6) // $180,000
  },
  {
    name: "Corfu Coastal Villa",
    location: "Corfu, Greece",
    imageUrl: "ipfs://QmPropertyImage4",
    totalValue: ethers.parseUnits("150000", 6) // $150,000
  },
  {
    name: "Koh Phangan Ocean Villa",
    location: "Koh Phangan, Thailand",
    imageUrl: "ipfs://QmPropertyImage5",
    totalValue: ethers.parseUnits("120000", 6) // $120,000
  },
  {
    name: "Antalya Coastal Villa",
    location: "Antalya, Turkey",
    imageUrl: "ipfs://QmPropertyImage6",
    totalValue: ethers.parseUnits("129000", 6) // $129,000
  }
];

// Contract ABI (only the functions we need)
const MORTGAGE_ABI = [
  "function addProperty(string memory _name, string memory _location, string memory _imageUrl, uint256 _totalValue) external",
  "function properties(uint256) external view returns (string name, string location, string imageUrl, uint256 totalValue, bool isActive)",
  "function owner() external view returns (address)"
];

async function seedProperties() {
  try {
    console.log('🌱 Starting property seeding process...\n');

    // Connect to Avalanche Fuji testnet
    const provider = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc');
    
    // Get signer from private key (make sure PRIVATE_KEY is set in .env)
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('PRIVATE_KEY not found in environment variables');
    }
    
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log('📝 Using wallet:', wallet.address);
    
    // Get contract address from environment or use default
    const contractAddress = process.env.ANCIENT_MORTGAGE_ADDRESS || '0x0b92ece58415c0b1aba86c372f45ffc4d6046bed';
    console.log('🏠 Contract address:', contractAddress);
    
    // Connect to contract
    const mortgage = new ethers.Contract(contractAddress, MORTGAGE_ABI, wallet);
    
    // Verify we're the owner
    const owner = await mortgage.owner();
    if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
      throw new Error(`Not contract owner. Owner is: ${owner}, you are: ${wallet.address}`);
    }
    
    console.log('✅ Verified contract ownership\n');
    console.log(`📋 Seeding ${PROPERTIES.length} properties...\n`);
    
    // Seed each property
    for (let i = 0; i < PROPERTIES.length; i++) {
      const prop = PROPERTIES[i];
      console.log(`[${i + 1}/${PROPERTIES.length}] Adding: ${prop.name}`);
      console.log(`   Location: ${prop.location}`);
      console.log(`   Value: $${ethers.formatUnits(prop.totalValue, 6)}`);
      
      try {
        const tx = await mortgage.addProperty(
          prop.name,
          prop.location,
          prop.imageUrl,
          prop.totalValue
        );
        
        console.log(`   ⏳ Transaction sent: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`   ✅ Confirmed in block: ${receipt.blockNumber}\n`);
        
        // Verify the property was added
        const propertyData = await mortgage.properties(i + 1);
        console.log(`   📊 Verified: ${propertyData.name} (Active: ${propertyData.isActive})\n`);
        
      } catch (error) {
        console.error(`   ❌ Failed to add property:`, error.message);
      }
    }
    
    console.log('\n🎉 Property seeding complete!');
    console.log(`✅ Successfully seeded ${PROPERTIES.length} properties to contract ${contractAddress}`);
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding
seedProperties();
