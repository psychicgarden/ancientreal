import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc";

if (!PRIVATE_KEY) {
  console.error('❌ Missing PRIVATE_KEY in .env');
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

console.log('🚀 Starting deployment to Fuji testnet...');
console.log('📡 Connected to:', RPC_URL);
console.log('👤 Deployer address:', wallet.address);

// We'll deploy contracts here
console.log('✅ Deployment script ready');
