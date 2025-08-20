const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying Smart Contracts with Fixed Circular Dependencies...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const deployments = {};

  try {
    // ========== PHASE 1: Deploy TestUSDT ==========
    console.log("\n📍 PHASE 1: Deploying TestUSDT...");
    const TestUSDT = await hre.ethers.getContractFactory("TestUSDT");
    const usdt = await TestUSDT.deploy();
    await usdt.waitForDeployment();
    deployments.USDT = await usdt.getAddress();
    console.log("✅ TestUSDT deployed to:", deployments.USDT);

    // ========== PHASE 2: Deploy Support Contracts ==========
    console.log("\n📍 PHASE 2: Deploying Support Contracts...");
    
    // Deploy NevisHoldingInterface
    const NevisHoldingInterface = await hre.ethers.getContractFactory("NevisHoldingInterface");
    const nevisHolding = await NevisHoldingInterface.deploy(
      "Ancient Holdings Ltd.",
      "NV-2024-001", 
      "Suite 1, Riverview Plaza, Nevis"
    );
    await nevisHolding.waitForDeployment();
    deployments.NEVIS_HOLDING = await nevisHolding.getAddress();
    console.log("✅ NevisHoldingInterface deployed to:", deployments.NEVIS_HOLDING);

    // Deploy MexicanPropertyCompliance
    const MexicanPropertyCompliance = await hre.ethers.getContractFactory("MexicanPropertyCompliance");
    const mexicanCompliance = await MexicanPropertyCompliance.deploy(
      deployer.address, // RNIE authority
      deployer.address, // Property registry authority
      deployer.address, // Tax authority  
      deployer.address  // Municipal authority
    );
    await mexicanCompliance.waitForDeployment();
    deployments.MEXICAN_COMPLIANCE = await mexicanCompliance.getAddress();
    console.log("✅ MexicanPropertyCompliance deployed to:", deployments.MEXICAN_COMPLIANCE);

    // ========== PHASE 3: Deploy LendingPoolManager (WITHOUT mortgage contract) ==========
    console.log("\n📍 PHASE 3: Deploying LendingPoolManager...");
    const LendingPoolManager = await hre.ethers.getContractFactory("LendingPoolManager");
    const lendingPool = await LendingPoolManager.deploy(
      deployments.USDT,
      deployments.NEVIS_HOLDING,
      deployments.MEXICAN_COMPLIANCE,
      750 // 7.5% base APY
    );
    await lendingPool.waitForDeployment();
    deployments.LENDING_POOL = await lendingPool.getAddress();
    console.log("✅ LendingPoolManager deployed to:", deployments.LENDING_POOL);

    // ========== PHASE 4: Deploy AncientMortgage (WITH lending pool address) ==========
    console.log("\n📍 PHASE 4: Deploying AncientMortgage...");
    const AncientMortgage = await hre.ethers.getContractFactory("AncientMortgage");
    const mortgage = await AncientMortgage.deploy(
      deployments.USDT,           // USDT address
      deployer.address,           // Treasury wallet (deployer for now)
      deployments.LENDING_POOL,   // Lending pool address
      deployer.address            // Trusted appraiser (deployer for now)
    );
    await mortgage.waitForDeployment();
    deployments.ANCIENT_MORTGAGE = await mortgage.getAddress();
    console.log("✅ AncientMortgage deployed to:", deployments.ANCIENT_MORTGAGE);

    // ========== PHASE 5: Connect Contracts ==========
    console.log("\n📍 PHASE 5: Connecting Contracts...");
    
    // Set mortgage contract in lending pool
    await lendingPool.setMortgageContract(deployments.ANCIENT_MORTGAGE);
    console.log("✅ Connected LendingPool -> AncientMortgage");

    // Set lending pool in Nevis holding
    await nevisHolding.setLendingPoolManager(deployments.LENDING_POOL);
    console.log("✅ Connected NevisHolding -> LendingPool");

    // Add initial director to Nevis holding
    await nevisHolding.addDirector(deployer.address, "Initial Director", "Nevis");
    console.log("✅ Added initial director to Nevis holding");

    // ========== PHASE 6: Test Setup ==========
    console.log("\n📍 PHASE 6: Test Setup...");
    
    // Mint test USDT to deployer
    await usdt.mint(deployer.address, hre.ethers.parseUnits("1000000", 6)); // 1M USDT
    console.log("✅ Minted 1,000,000 test USDT to deployer");

    // Set KYC and accreditation for deployer in AncientMortgage
    await mortgage.setKYCVerified(deployer.address, true);
    await mortgage.setAccreditedInvestor(deployer.address, true);
    console.log("✅ Set deployer KYC and accreditation status");

    // Set KYC and accreditation for deployer in LendingPool
    await lendingPool.setKYCStatus(deployer.address, true);
    await lendingPool.setAccreditedStatus(deployer.address, true);
    console.log("✅ Set deployer lending pool verification");

    // ========== PHASE 7: Save Deployment Info ==========
    console.log("\n📍 PHASE 7: Saving Deployment Info...");
    
    const deploymentInfo = {
      network: hre.network.name,
      chainId: hre.network.config.chainId,
      contracts: {
        TestUSDT: deployments.USDT,
        AncientMortgage: deployments.ANCIENT_MORTGAGE,
        LendingPoolManager: deployments.LENDING_POOL,
        NevisHoldingInterface: deployments.NEVIS_HOLDING,
        MexicanPropertyCompliance: deployments.MEXICAN_COMPLIANCE
      },
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      blockNumber: await hre.ethers.provider.getBlockNumber()
    };

    // Save to deployments directory
    const deploymentsDir = path.join(process.cwd(), "deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir);
    }
    
    const filename = `${hre.network.name}-latest.json`;
    fs.writeFileSync(
      path.join(deploymentsDir, filename),
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log(`✅ Deployment info saved to deployments/${filename}`);

    // ========== SUCCESS SUMMARY ==========
    console.log("\n🎉 ALL CONTRACTS DEPLOYED SUCCESSFULLY!");
    console.log("=" * 70);
    console.log(`Network: ${hre.network.name} (Chain ID: ${hre.network.config.chainId})`);
    console.log(`Deployer: ${deployer.address}`);
    console.log("\n📝 CONTRACT ADDRESSES:");
    console.log(`TestUSDT:                  ${deployments.USDT}`);
    console.log(`AncientMortgage:           ${deployments.ANCIENT_MORTGAGE}`);
    console.log(`LendingPoolManager:        ${deployments.LENDING_POOL}`);
    console.log(`NevisHoldingInterface:     ${deployments.NEVIS_HOLDING}`);
    console.log(`MexicanPropertyCompliance: ${deployments.MEXICAN_COMPLIANCE}`);
    
    console.log("\n🔧 NEXT STEPS:");
    console.log("1. Update frontend contract addresses in src/config/chain.ts");
    console.log("2. Test contract interactions");
    console.log("3. Set up additional KYC and accreditation as needed");
    
    if (hre.network.name !== "hardhat") {
      console.log("\n🔍 EXPLORER LINKS:");
      const explorerUrl = getExplorerUrl(hre.network.config.chainId);
      Object.entries(deployments).forEach(([name, address]) => {
        console.log(`${name}: ${explorerUrl}/address/${address}`);
      });
    }

  } catch (error) {
    console.error("\n❌ DEPLOYMENT FAILED:");
    console.error(error.message);
    
    if (error.reason) {
      console.error("Reason:", error.reason);
    }
    
    process.exit(1);
  }
}

function getExplorerUrl(chainId) {
  const explorers = {
    1: "https://etherscan.io",
    43114: "https://snowtrace.io", 
    43113: "https://testnet.snowtrace.io",
    137: "https://polygonscan.com",
    80001: "https://mumbai.polygonscan.com"
  };
  return explorers[chainId] || "https://etherscan.io";
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });