// Fix for WalletContext.tsx - Replace simulation with real blockchain

const fs = require('fs');
const path = require('path');

// Read the current file
const filePath = path.join(__dirname, 'src/contexts/WalletContext.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add Web3Integration import at the top
const importStatement = `import { Web3Integration } from '@/lib/web3-integration';`;
if (!content.includes('Web3Integration')) {
  content = content.replace(
    /import.*from.*['"]@\/lib\/contracts['"];?/,
    `$&\n${importStatement}`
  );
}

// Add web3Integration state
if (!content.includes('web3Integration')) {
  content = content.replace(
    /const \[.*\] = useState\(false\);/,
    `$&\n  const [web3Integration, setWeb3Integration] = useState(null);`
  );
}

// Replace the fake executeContractCall function
const fakeFunction = /const executeContractCall = async \(contractConfig: any, method: string, params: any\[\] = \[\], value\?: string\) => \{[\s\S]*?\};/;

const realFunction = `const executeContractCall = async (contractConfig: any, method: string, params: any[] = [], value?: string) => {
    try {
      // Initialize Web3 integration if not already done
      if (!web3Integration) {
        const web3 = new Web3Integration();
        await web3.initialize();
        setWeb3Integration(web3);
      }

      // Get the contract instance
      const contractName = contractConfig.name || 'MAZUNTE_MORTGAGE';
      const contract = await web3Integration.getContract(contractName);
      
      // Execute the real contract call
      console.log(\`🔗 Executing real contract call: \${method} with params:\`, params);
      
      let tx;
      if (value && value !== '0') {
        // Transaction with value (like ETH/AVAX)
        tx = await contract[method](...params, { value: ethers.parseEther(value) });
      } else {
        // Regular contract call
        tx = await contract[method](...params);
      }
      
      // Wait for transaction confirmation
      console.log(\`⏳ Waiting for transaction confirmation: \${tx.hash}\`);
      const receipt = await tx.wait();
      
      console.log(\`✅ Transaction confirmed: \${receipt.transactionHash}\`);
      
      return { 
        hash: receipt.transactionHash, 
        success: true,
        receipt: receipt
      };
    } catch (error) {
      console.error('Real contract call failed:', error);
      throw error;
    }
  };`;

content = content.replace(fakeFunction, realFunction);

// Write the updated content
fs.writeFileSync(filePath, content);

console.log('✅ Successfully updated WalletContext.tsx with real blockchain integration');
console.log('🔗 Now the app will make real blockchain transactions instead of simulations');
