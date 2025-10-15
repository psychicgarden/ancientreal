# 🚀 ETH Version Integration - Easy Testing!

## 🎯 **Problem Solved:**
Instead of dealing with USDT faucets and approvals, we've created an **ETH version** of the contract that accepts ETH directly for easy testing.

## 🔧 **What's New:**

### **1. New Contract: AncientMortgageETH**
- ✅ Accepts ETH instead of USDT
- ✅ Same business logic (20% down, 8% APR, 10 years)
- ✅ No token approvals needed
- ✅ Easy testing with ETH

### **2. Simple Deployment:**
```bash
# Deploy the ETH version
make deploy-eth RPC_URL=https://rpc.inverter.network/main/evm/84532
```

### **3. Updated Frontend Integration:**

Replace your current purchase function with this ETH version:

```typescript
const handlePurchaseProperty = async (propertyId: number, propertyValue: string, downPayment: string) => {
  if (!contractAddress) {
    toast({
      title: "Error",
      description: "Wallet not connected or contract not available",
      variant: "destructive"
    });
    return;
  }

  setIsLoading(true);
  try {
    console.log('Purchasing property with ETH...');
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, AncientMortgageETHABI, signer);
    
    // Convert to ETH (18 decimals)
    const propertyPrice = ethers.parseEther(propertyValue);
    
    // Calculate total ETH needed (20% down + 3% platform fee)
    const downPayment = (propertyPrice * BigInt(20)) / BigInt(100);
    const platformFee = (propertyPrice * BigInt(3)) / BigInt(100);
    const totalETH = downPayment + platformFee;
    
    console.log('Purchase breakdown:', {
      propertyPrice: ethers.formatEther(propertyPrice),
      downPayment: ethers.formatEther(downPayment),
      platformFee: ethers.formatEther(platformFee),
      totalETH: ethers.formatEther(totalETH),
    });
    
    // Purchase with ETH value
    const tx = await contract.purchaseProperty(propertyPrice, { value: totalETH });
    
    console.log('Transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);

    if (receipt.status === 1) {
      // Extract tokenId from MortgageCreated event
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === 'MortgageCreated';
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsedEvent = contract.interface.parseLog(event);
        const tokenId = parsedEvent!.args.tokenId;
        setUserTokenId(tokenId);
        
        toast({
          title: "Purchase Successful!",
          description: `Property purchased! Your mortgage NFT token ID is: ${tokenId.toString()}`,
        });
        
        console.log('Purchase successful! TokenId:', tokenId.toString());
      }
    }
    
  } catch (error: any) {
    console.error('Purchase error:', error);
    toast({
      title: "Purchase Failed",
      description: error.message || "An error occurred during purchase.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
```

### **4. Updated Payment Function:**

```typescript
const handleMakePayment = async () => {
  if (!contractAddress || !mortgageData || !userTokenId) {
    toast({
      title: "Error",
      description: "Wallet not connected, contract not available, or no active mortgage",
      variant: "destructive"
    });
    return;
  }

  setIsLoading(true);
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, AncientMortgageETHABI, signer);
    
    // Get payment amount from contract
    const mortgageData = await contract.getMortgage(userTokenId);
    const monthlyPayment = mortgageData.monthlyPayment;
    
    console.log('Making payment:', {
      tokenId: userTokenId.toString(),
      amount: ethers.formatEther(monthlyPayment),
    });
    
    // Make payment with ETH value
    const tx = await contract.makePayment(userTokenId, { value: monthlyPayment });
    await tx.wait();
    
    console.log('Payment successful:', tx.hash);
    
    toast({
      title: "Payment Successful",
      description: "Monthly payment completed successfully.",
    });
    
    // Refresh mortgage data
    await fetchMortgageData();
    
  } catch (error: any) {
    console.error('Payment error:', error);
    toast({
      title: "Payment Failed",
      description: error.message || "An error occurred during payment.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
```

## 🚀 **Quick Setup:**

1. **Deploy the ETH version:**
   ```bash
   cd /Users/bradywilliams/Desktop/ancient-sc
   make deploy-eth RPC_URL=https://rpc.inverter.network/main/evm/84532
   ```

2. **Update your frontend:**
   - Replace the contract address with the new ETH version
   - Use the ETH purchase/payment functions above
   - No more USDT approvals needed!

3. **Test with ETH:**
   - You already have ETH in your wallet
   - Just send ETH value with the transaction
   - Much simpler and faster!

## 🎯 **Benefits:**

- ✅ **No USDT faucets** - use ETH directly
- ✅ **No approvals** - just send ETH value
- ✅ **Faster testing** - immediate transactions
- ✅ **Same business logic** - 20% down, 8% APR, 10 years
- ✅ **Easy debugging** - clear ETH amounts

**This is exactly what you wanted - easy ETH testing without the USDT complexity!** 🎉
