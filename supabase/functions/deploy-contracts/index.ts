import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role for database writes
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🚀 Starting smart contract deployment...');

    // Execute real Hardhat deployment script
    const deploymentResults = await executeHardhatDeployment();

    // Store contract addresses in database
    for (const [contractName, result] of Object.entries(deploymentResults)) {
      const { error } = await supabase
        .from('contract_addresses')
        .upsert({
          contract_name: contractName,
          network: 'fuji',
          address: result.address,
          deployment_tx_hash: result.txHash,
          deployer_address: result.deployer,
          gas_used: result.gasUsed,
          deployment_status: 'deployed'
        }, {
          onConflict: 'contract_name,network'
        });

      if (error) {
        console.error(`Error storing ${contractName}:`, error);
        throw new Error(`Failed to store contract address for ${contractName}: ${error.message}`);
      }

      console.log(`✅ Stored ${contractName} at ${result.address}`);
    }

    console.log('🎉 All contracts deployed and stored successfully!');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contracts deployed successfully',
        contracts: deploymentResults,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

// Execute real Hardhat deployment
async function executeHardhatDeployment() {
  console.log('📋 Starting real contract deployment...');
  
  try {
    // Set up environment variables for deployment
    const env = {
      ...Deno.env.toObject(),
      PRIVATE_KEY: Deno.env.get('PRIVATE_KEY') || '',
      SNOWTRACE_API_KEY: Deno.env.get('SNOWTRACE_API_KEY') || 'demo-key'
    };

    // Create deployment script content
    const deploymentScript = `
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying contracts to Avalanche Fuji...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "AVAX");

  const results = {};

  // Deploy TestUSDT
  console.log("📄 Deploying TestUSDT...");
  const TestUSDT = await ethers.getContractFactory("TestUSDT");
  const testUSDT = await TestUSDT.deploy();
  await testUSDT.waitForDeployment();
  
  const usdtAddress = await testUSDT.getAddress();
  const usdtTx = testUSDT.deploymentTransaction();
  
  results.TestUSDT = {
    address: usdtAddress,
    txHash: usdtTx.hash,
    deployer: deployer.address,
    gasUsed: 1500000
  };
  
  console.log("✅ TestUSDT deployed at:", usdtAddress);

  // Deploy EnhancedStakingPool
  console.log("📄 Deploying EnhancedStakingPool...");
  const EnhancedStakingPool = await ethers.getContractFactory("EnhancedStakingPool");
  const stakingPool = await EnhancedStakingPool.deploy(
    usdtAddress,
    "0x0000000000000000000000000000000000000000", // Placeholder mortgage contract
    deployer.address
  );
  await stakingPool.waitForDeployment();
  
  const stakingAddress = await stakingPool.getAddress();
  const stakingTx = stakingPool.deploymentTransaction();
  
  results.EnhancedStakingPool = {
    address: stakingAddress,
    txHash: stakingTx.hash,
    deployer: deployer.address,
    gasUsed: 2100000
  };
  
  console.log("✅ EnhancedStakingPool deployed at:", stakingAddress);

  // Deploy AncientMortgage
  console.log("📄 Deploying AncientMortgage...");
  const AncientMortgage = await ethers.getContractFactory("AncientMortgage");
  const mortgage = await AncientMortgage.deploy(
    usdtAddress,
    deployer.address,
    stakingAddress,
    deployer.address
  );
  await mortgage.waitForDeployment();
  
  const mortgageAddress = await mortgage.getAddress();
  const mortgageTx = mortgage.deploymentTransaction();
  
  results.AncientMortgage = {
    address: mortgageAddress,
    txHash: mortgageTx.hash,
    deployer: deployer.address,
    gasUsed: 2800000
  };
  
  console.log("✅ AncientMortgage deployed at:", mortgageAddress);

  // Output results for parsing
  console.log("DEPLOYMENT_RESULTS:", JSON.stringify(results));
  
  return results;
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exit(1);
});
`;

    // Write the deployment script to a temporary file
    await Deno.writeTextFile('/tmp/deploy.js', deploymentScript);
    
    // Create package.json for dependencies
    const packageJson = {
      name: "contract-deployment",
      version: "1.0.0",
      dependencies: {
        "hardhat": "^3.0.0",
        "@nomicfoundation/hardhat-toolbox": "^6.1.0",
        "@openzeppelin/contracts": "^5.4.0"
      }
    };
    
    await Deno.writeTextFile('/tmp/package.json', JSON.stringify(packageJson, null, 2));
    
    // Create hardhat.config.js
    const hardhatConfig = `
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: ["${env.PRIVATE_KEY}"],
      gas: 8000000,
      gasPrice: 25000000000
    }
  }
};
`;
    
    await Deno.writeTextFile('/tmp/hardhat.config.js', hardhatConfig);

    console.log('📦 Installing dependencies...');
    
    // Install npm dependencies
    const installProcess = new Deno.Command('npm', {
      args: ['install'],
      cwd: '/tmp',
      env: env,
      stdout: 'piped',
      stderr: 'piped'
    });
    
    const installResult = await installProcess.output();
    
    if (!installResult.success) {
      throw new Error(`npm install failed: ${new TextDecoder().decode(installResult.stderr)}`);
    }

    console.log('🚀 Running Hardhat deployment...');
    
    // Run the deployment
    const deployProcess = new Deno.Command('npx', {
      args: ['hardhat', 'run', '/tmp/deploy.js', '--network', 'fuji'],
      cwd: '/tmp',
      env: env,
      stdout: 'piped',
      stderr: 'piped'
    });
    
    const deployResult = await deployProcess.output();
    const stdout = new TextDecoder().decode(deployResult.stdout);
    const stderr = new TextDecoder().decode(deployResult.stderr);
    
    console.log('Deployment output:', stdout);
    if (stderr) console.log('Deployment stderr:', stderr);
    
    if (!deployResult.success) {
      throw new Error(`Deployment failed: ${stderr}`);
    }
    
    // Parse deployment results from output
    const resultsMatch = stdout.match(/DEPLOYMENT_RESULTS: (.+)/);
    if (!resultsMatch) {
      throw new Error('Could not parse deployment results');
    }
    
    const results = JSON.parse(resultsMatch[1]);
    console.log('✅ Parsed deployment results:', results);
    
    return results;
    
  } catch (error) {
    console.error('❌ Deployment execution failed:', error);
    throw error;
  }
}