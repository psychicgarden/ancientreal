const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
	const [deployer, appraiser] = await ethers.getSigners();

	console.log("Deployer:", deployer.address);

	// Deploy TestUSDT (6 decimals)
	const TestUSDT = await ethers.getContractFactory("TestUSDT");
	const usdt = await TestUSDT.deploy();
	await usdt.deployed();
	console.log("USDT:", usdt.address);

	// Deploy placeholder pool (will be wired into mortgage and vice-versa where needed)
	const EnhancedStakingPool = await ethers.getContractFactory("EnhancedStakingPool");
	// Temporarily pass deployer as ancientMortgage contract; we'll update later if needed
	const stakingPool = await EnhancedStakingPool.deploy(usdt.address, deployer.address, deployer.address);
	await stakingPool.deployed();
	console.log("EnhancedStakingPool:", stakingPool.address);

	// Deploy AncientMortgage using stakingPool as lending pool
	const AncientMortgage = await ethers.getContractFactory("AncientMortgage");
	const mortgage = await AncientMortgage.deploy(
		usdt.address,
		deployer.address,      // treasury wallet
		stakingPool.address,   // lending pool contract
		appraiser.address      // trusted appraiser
	);
	await mortgage.deployed();
	console.log("AncientMortgage:", mortgage.address);

	// Write addresses
	const addresses = {
		USDT: usdt.address,
		ENHANCED_STAKING_POOL: stakingPool.address,
		ANCIENT_MORTGAGE: mortgage.address,
		TREASURY: deployer.address,
		APPRAISER: appraiser.address
	};

	const outPath = path.join(__dirname, "..", "addresses.local.json");
	fs.writeFileSync(outPath, JSON.stringify(addresses, null, 2));
	console.log("Saved:", outPath);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});