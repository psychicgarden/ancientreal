import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🏛️ Starting VillageCitizenship contract deployment...');
    
    // Get secrets
    const privateKey = Deno.env.get('PRIVATE_KEY');
    if (!privateKey) {
      throw new Error('PRIVATE_KEY environment variable is required');
    }

    // Deploy contract using Hardhat
    const deploymentResult = await executeHardhatDeployment();
    
    if (!deploymentResult.success) {
      throw new Error(`Deployment failed: ${deploymentResult.error}`);
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('📝 Updating contract addresses in database...');
    
    // Update the database with the deployed contract address
    const { error: updateError } = await supabase
      .from('contract_addresses')
      .upsert({
        contract_name: 'VillageCitizenship',
        network: 'fuji',
        address: deploymentResult.address,
        deployment_tx_hash: deploymentResult.transactionHash,
        deployer_address: deploymentResult.deployer,
        deployment_status: 'deployed',
        gas_used: deploymentResult.gasUsed ? parseInt(deploymentResult.gasUsed) : null,
        deployed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'contract_name,network'
      });

    if (updateError) {
      console.error('❌ Database update failed:', updateError);
      throw updateError;
    }

    console.log('✅ VillageCitizenship contract deployed and database updated!');
    console.log(`📋 Contract address: ${deploymentResult.address}`);
    console.log(`🔗 Explorer: https://testnet.snowtrace.io/address/${deploymentResult.address}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        contractAddress: deploymentResult.address,
        transactionHash: deploymentResult.transactionHash,
        explorerUrl: `https://testnet.snowtrace.io/address/${deploymentResult.address}`,
        message: 'VillageCitizenship contract deployed successfully!'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ VillageCitizenship deployment failed:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function executeHardhatDeployment() {
  console.log('🔨 Setting up Hardhat environment...');
  
  // Create temporary directory for deployment
  const tempDir = await Deno.makeTempDir();
  console.log(`📁 Working in: ${tempDir}`);
  
  try {
    // Create deployment script
    const deployScript = `
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🏛️ Deploying VillageCitizenship contract...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "AVAX");
  
  if (balance < ethers.parseEther("0.1")) {
    throw new Error("Insufficient AVAX balance for deployment");
  }
  
  // Deploy VillageCitizenship
  const VillageCitizenship = await ethers.getContractFactory("VillageCitizenship");
  const villageCitizenship = await VillageCitizenship.deploy();
  await villageCitizenship.waitForDeployment();
  
  const address = await villageCitizenship.getAddress();
  const deploymentTx = villageCitizenship.deploymentTransaction();
  const receipt = await deploymentTx.wait();
  
  console.log("✅ VillageCitizenship deployed to:", address);
  console.log("📝 Transaction hash:", deploymentTx.hash);
  console.log("⛽ Gas used:", receipt.gasUsed.toString());
  
  // Test the contract
  const citizenshipFee = await villageCitizenship.CITIZENSHIP_FEE();
  console.log("🎫 Citizenship fee:", ethers.formatEther(citizenshipFee), "AVAX");
  
  // Output JSON for parsing
  console.log("DEPLOYMENT_RESULT_START");
  console.log(JSON.stringify({
    address: address,
    transactionHash: deploymentTx.hash,
    deployer: deployer.address,
    gasUsed: receipt.gasUsed.toString(),
    blockNumber: receipt.blockNumber,
    citizenshipFee: ethers.formatEther(citizenshipFee)
  }));
  console.log("DEPLOYMENT_RESULT_END");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
`;

    // Write deployment script
    await Deno.writeTextFile(`${tempDir}/deploy.js`, deployScript);
    
    // Create package.json
    const packageJson = {
      "name": "village-citizenship-deployment",
      "version": "1.0.0",
      "scripts": {
        "deploy": "hardhat run deploy.js --network fuji"
      },
      "devDependencies": {
        "@nomicfoundation/hardhat-toolbox": "^4.0.0",
        "hardhat": "^2.19.0"
      }
    };
    
    await Deno.writeTextFile(`${tempDir}/package.json`, JSON.stringify(packageJson, null, 2));
    
    // Create hardhat config
    const hardhatConfig = `
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: ["${Deno.env.get('PRIVATE_KEY')}"],
      gas: 8000000,
      gasPrice: 25000000000
    }
  }
};
`;
    
    await Deno.writeTextFile(`${tempDir}/hardhat.config.js`, hardhatConfig);
    
    // Create VillageCitizenship contract
    const contractSource = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VillageCitizenship is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    uint256 public constant CITIZENSHIP_FEE = 0.1 ether; // 0.1 AVAX
    mapping(address => bool) public isCitizen;
    mapping(address => uint256) public citizenshipLevel;
    mapping(uint256 => string) public propertyAccess;
    
    event CitizenshipGranted(address indexed citizen, uint256 tokenId, uint256 level);
    event PropertyAccessGranted(address indexed citizen, string property);
    event VoteCast(address indexed citizen, uint256 proposalId, bool support);
    
    constructor() ERC721("Ancient Village Citizenship", "AVC") {}
    
    function becomeCitizen() external payable {
        require(msg.value >= CITIZENSHIP_FEE, "Insufficient payment");
        require(!isCitizen[msg.sender], "Already a citizen");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        isCitizen[msg.sender] = true;
        citizenshipLevel[msg.sender] = 1;
        
        emit CitizenshipGranted(msg.sender, tokenId, 1);
    }
    
    function hasCitizenship(address user) external view returns (bool) {
        return isCitizen[user];
    }
    
    function upgradeCitizenship(address citizen, uint256 investmentAmount) external onlyOwner {
        require(isCitizen[citizen], "Not a citizen");
        
        if (investmentAmount >= 100000 * 10**6) {
            citizenshipLevel[citizen] = 3;
        } else if (investmentAmount >= 50000 * 10**6) {
            citizenshipLevel[citizen] = 2;
        }
    }
    
    function grantPropertyAccess(address citizen, string memory property) external onlyOwner {
        require(isCitizen[citizen], "Not a citizen");
        emit PropertyAccessGranted(citizen, property);
    }
    
    function vote(uint256 proposalId, bool support) external {
        require(isCitizen[msg.sender], "Not a citizen");
        emit VoteCast(msg.sender, proposalId, support);
    }
    
    function getCitizenDetails(address citizen) external view returns (
        bool hasAccess,
        uint256 level,
        uint256 tokenId
    ) {
        hasAccess = isCitizen[citizen];
        level = citizenshipLevel[citizen];
        tokenId = hasAccess ? tokenOfOwnerByIndex(citizen, 0) : 0;
    }
}
`;
    
    // Create contracts directory and write contract
    await Deno.mkdir(`${tempDir}/contracts`, { recursive: true });
    await Deno.writeTextFile(`${tempDir}/contracts/VillageCitizenship.sol`, contractSource);
    
    console.log('📦 Installing dependencies...');
    
    // Install dependencies
    const installProcess = new Deno.Command("npm", {
      args: ["install"],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped"
    });
    
    const installResult = await installProcess.output();
    if (!installResult.success) {
      const errorText = new TextDecoder().decode(installResult.stderr);
      throw new Error(`npm install failed: ${errorText}`);
    }
    
    console.log('🚀 Running deployment...');
    
    // Run deployment
    const deployProcess = new Deno.Command("npx", {
      args: ["hardhat", "run", "deploy.js", "--network", "fuji"],
      cwd: tempDir,
      stdout: "piped",
      stderr: "piped"
    });
    
    const deployResult = await deployProcess.output();
    const stdout = new TextDecoder().decode(deployResult.stdout);
    const stderr = new TextDecoder().decode(deployResult.stderr);
    
    console.log('📋 Deployment output:', stdout);
    if (stderr) console.log('⚠️ Deployment stderr:', stderr);
    
    if (!deployResult.success) {
      throw new Error(`Deployment failed: ${stderr || stdout}`);
    }
    
    // Parse deployment result
    const startMarker = "DEPLOYMENT_RESULT_START";
    const endMarker = "DEPLOYMENT_RESULT_END";
    
    const startIndex = stdout.indexOf(startMarker);
    const endIndex = stdout.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error("Could not find deployment result in output");
    }
    
    const resultJson = stdout.substring(startIndex + startMarker.length, endIndex).trim();
    const result = JSON.parse(resultJson);
    
    console.log('✅ Deployment successful!', result);
    
    return {
      success: true,
      ...result
    };
    
  } catch (error) {
    console.error('❌ Deployment error:', error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    // Cleanup temp directory
    try {
      await Deno.remove(tempDir, { recursive: true });
    } catch (cleanupError) {
      console.warn('⚠️ Could not cleanup temp directory:', cleanupError);
    }
  }
}