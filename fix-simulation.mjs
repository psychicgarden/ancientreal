import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing remaining simulation code in WalletContext...');

const filePath = path.join(process.cwd(), 'src/contexts/WalletContext.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace getTestTokens function with real faucet call
const oldGetTestTokens = /const getTestTokens = async \(\): Promise<\{ success: boolean; error\?: string \}> => \{[\s\S]*?\};/;

const newGetTestTokens = `const getTestTokens = async (): Promise<{ success: boolean; error?: string }> => {
    setIsGettingTestTokens(true);
    
    try {
      // Initialize Web3 integration if not already done
      if (!web3Integration) {
        const web3 = new Web3Integration();
        await web3.initialize();
        setWeb3Integration(web3);
      }

      // Call real USDT faucet
      const usdtContract = await web3Integration.getContract('USDT');
      console.log('🔗 Calling real USDT faucet...');
      
      const tx = await usdtContract.faucet();
      const receipt = await tx.wait();
      
      console.log('✅ Faucet transaction confirmed:', receipt.transactionHash);
      
      // Update balance from real contract
      const newBalance = await usdtContract.balanceOf(account);
      setUsdtBalance(ethers.formatUnits(newBalance, 6));
      
      toast({
        title: "Test Tokens Received! ��",
        description: \`Added 1,000 test USDT to your balance. Transaction: \${receipt.transactionHash.slice(0, 10)}...\`,
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Faucet call failed:', error);
      toast({
        title: "Test Token Request Failed",
        description: error.message || "Failed to get test tokens. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsGettingTestTokens(false);
    }
  };`;

content = content.replace(oldGetTestTokens, newGetTestTokens);

// Replace property purchase simulation with real contract calls
const oldPropertyPurchase = /if \(isDemoMode\) \{[\s\S]*?toast\(\{[\s\S]*?title: "Property Purchase Successful! 🏡 \(Demo\)",[\s\S]*?\}\);[\s\S]*?return \{ success: true, mortgageId: mockMortgageId \};[\s\S]*?\} else \{/;

const newPropertyPurchase = `// Real blockchain property purchase
        console.log('🔗 Processing real property purchase...');
        
        // Initialize Web3 integration if not already done
        if (!web3Integration) {
          const web3 = new Web3Integration();
          await web3.initialize();
          setWeb3Integration(web3);
        }

        // Get mortgage contract
        const mortgageContract = await web3Integration.getContract('MAZUNTE_MORTGAGE');
        
        // Approve USDT spending
        const usdtContract = await web3Integration.getContract('USDT');
        const approveTx = await usdtContract.approve(await mortgageContract.getAddress(), downPayment * 1000000);
        await approveTx.wait();
        
        // Purchase property
        const purchaseTx = await mortgageContract.purchaseProperty(
          MAZUNTE_PROPERTY.id,
          downPayment * 1000000,
          { value: platformFee ? ethers.parseEther(platformFee.toString()) : 0 }
        );
        
        const purchaseReceipt = await purchaseTx.wait();
        console.log('✅ Property purchase confirmed:', purchaseReceipt.transactionHash);
        
        toast({
          title: "Property Purchase Successful! 🏡",
          description: \`Real mortgage created! Transaction: \${purchaseReceipt.transactionHash.slice(0, 10)}...\`,
        });
        
        return { success: true, mortgageId: purchaseReceipt.transactionHash };
      } else {`;

content = content.replace(oldPropertyPurchase, newPropertyPurchase);

// Remove demo mode checks and always use real blockchain
content = content.replace(/if \(isDemoMode\) \{[\s\S]*?return \{ success: false, error: "Test tokens only available in demo mode" \};[\s\S]*?\}/g, '');

// Write the updated content
fs.writeFileSync(filePath, content);

console.log('✅ Successfully replaced simulation code with real blockchain calls');
console.log('🔗 Now all functions will make real blockchain transactions');
