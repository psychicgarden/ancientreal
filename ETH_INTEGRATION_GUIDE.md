# 🚀 ETH Version Integration Guide

## ✅ **DEPLOYED AND READY!**

### **Contract Deployed:**
- **Address**: `0x9524C8A3b6eEaE8cCE29F6183a7200A530F84bD1`
- **Network**: Base Sepolia (Chain ID: 84532)
- **Explorer**: https://sepolia.basescan.org/address/0x9524C8A3b6eEaE8cCE29F6183a7200A530F84bD1

## 🎯 **Quick Setup:**

### **1. Import the ETH Contract:**

```typescript
import AncientMortgageETHABI from '@/lib/ancient-protocol/abis/AncientMortgageETH_ABI.json';
import { ETH_CONTRACTS } from '@/lib/ancient-protocol/addresses-eth';

const CONTRACT_ADDRESS = ETH_CONTRACTS.BASE_SEPOLIA.AncientMortgageETH;
// or directly: "0x9524C8A3b6eEaE8cCE29F6183a7200A530F84bD1"
```

### **2. Purchase Property with ETH:**

```typescript
const handlePurchaseProperty = async (propertyValue: string) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      AncientMortgageETHABI,
      signer
    );
    
    // Convert to ETH (18 decimals)
    const propertyPrice = ethers.parseEther(propertyValue);
    
    // Calculate total ETH needed (20% down + 3% platform fee = 23%)
    const downPayment = (propertyPrice * BigInt(20)) / BigInt(100); // 20%
    const platformFee = (propertyPrice * BigInt(3)) / BigInt(100);  // 3%
    const totalETH = downPayment + platformFee; // 23% total
    
    console.log('Purchase breakdown:', {
      propertyPrice: ethers.formatEther(propertyPrice),
      downPayment: ethers.formatEther(downPayment),
      platformFee: ethers.formatEther(platformFee),
      totalETH: ethers.formatEther(totalETH),
    });
    
    // Purchase with ETH value (NO APPROVALS NEEDED!)
    const tx = await contract.purchaseProperty(propertyPrice, { value: totalETH });
    console.log('Transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);
    
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
      
      console.log('Purchase successful! TokenId:', tokenId.toString());
      
      // Save tokenId for later use
      localStorage.setItem('mortgageTokenId', tokenId.toString());
      
      return tokenId;
    }
    
  } catch (error: any) {
    console.error('Purchase error:', error);
    throw error;
  }
};
```

### **3. Make Payment with ETH:**

```typescript
const handleMakePayment = async (tokenId: bigint) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      AncientMortgageETHABI,
      signer
    );
    
    // Get mortgage data to find monthly payment amount
    const mortgageData = await contract.getMortgage(tokenId);
    const monthlyPayment = mortgageData.monthlyPayment;
    
    console.log('Making payment:', {
      tokenId: tokenId.toString(),
      amount: ethers.formatEther(monthlyPayment),
    });
    
    // Make payment with ETH value (NO APPROVALS NEEDED!)
    const tx = await contract.makePayment(tokenId, { value: monthlyPayment });
    console.log('Payment transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Payment successful:', receipt);
    
  } catch (error: any) {
    console.error('Payment error:', error);
    throw error;
  }
};
```

### **4. Get Mortgage Details:**

```typescript
const getMortgageDetails = async (tokenId: bigint) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    AncientMortgageETHABI,
    provider
  );
  
  const mortgage = await contract.getMortgage(tokenId);
  
  return {
    borrower: mortgage.borrower,
    propertyPrice: ethers.formatEther(mortgage.propertyPrice),
    loanAmount: ethers.formatEther(mortgage.loanAmount),
    monthlyPayment: ethers.formatEther(mortgage.monthlyPayment),
    paymentsMade: Number(mortgage.paymentsMade),
    nextPaymentDue: Number(mortgage.nextPaymentDue),
    totalInterestPaid: ethers.formatEther(mortgage.totalInterestPaid),
    isActive: mortgage.isActive,
  };
};
```

## 🎯 **Replace Your EnhancedMortgageSystem.tsx:**

Update these parts:

### **1. Update Contract Address (Line 103):**
```typescript
const loadContractAddress = async () => {
  try {
    // Use ETH contract address
    const address = "0x9524C8A3b6eEaE8cCE29F6183a7200A530F84bD1";
    setContractAddress(address);
    setContractNotFound(false);
    console.log('Using ETH contract address:', address);
  } catch (error) {
    console.error('Error loading contract address:', error);
    setContractNotFound(true);
  }
};
```

### **2. Update Imports (Line 15-24):**
```typescript
import AncientMortgageETHABI from '@/lib/ancient-protocol/abis/AncientMortgageETH_ABI.json';
import { ETH_CONTRACTS } from '@/lib/ancient-protocol/addresses-eth';
```

### **3. Update Purchase Function (Line 217-320):**
```typescript
const handlePurchaseProperty = async (propertyId: number, propertyValue: string, downPayment: string) => {
  if (!contractAddress) {
    toast({
      title: "Error",
      description: "Contract not available",
      variant: "destructive"
    });
    return;
  }

  setIsLoading(true);
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, AncientMortgageETHABI, signer);
    
    // Convert to ETH
    const propertyPrice = ethers.parseEther(propertyValue);
    const totalETH = (propertyPrice * BigInt(23)) / BigInt(100); // 23% total
    
    // Purchase with ETH value
    const tx = await contract.purchaseProperty(propertyPrice, { value: totalETH });
    const receipt = await tx.wait();
    
    // Extract tokenId
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
        description: `Property purchased! NFT ID: ${tokenId.toString()}`,
      });
    }
    
  } catch (error: any) {
    console.error('Purchase error:', error);
    toast({
      title: "Purchase Failed",
      description: error.message || "Transaction failed",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
```

### **4. Update Payment Function (Line 345-400):**
```typescript
const handleMakePayment = async () => {
  if (!contractAddress || !userTokenId) {
    toast({
      title: "Error",
      description: "No active mortgage",
      variant: "destructive"
    });
    return;
  }

  setIsLoading(true);
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, AncientMortgageETHABI, signer);
    
    // Get payment amount
    const mortgageData = await contract.getMortgage(userTokenId);
    const monthlyPayment = mortgageData.monthlyPayment;
    
    // Make payment with ETH value
    const tx = await contract.makePayment(userTokenId, { value: monthlyPayment });
    await tx.wait();
    
    toast({
      title: "Payment Successful",
      description: "Monthly payment completed!",
    });
    
    await fetchMortgageData();
    
  } catch (error: any) {
    console.error('Payment error:', error);
    toast({
      title: "Payment Failed",
      description: error.message || "Transaction failed",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
```

## 🎉 **Benefits:**

- ✅ **No USDT faucets** - use ETH directly
- ✅ **No approvals** - just send ETH value
- ✅ **Faster testing** - immediate transactions
- ✅ **Same business logic** - 20% down, 8% APR, 10 years
- ✅ **Already deployed** - ready to use!

## 📋 **Test It:**

1. Connect to Base Sepolia (Chain ID: 84532)
2. Make sure you have ETH in your wallet
3. Try purchasing a property - it should work immediately!

**Contract Address**: `0x9524C8A3b6eEaE8cCE29F6183a7200A530F84bD1`

**This is exactly what you wanted - easy ETH testing!** 🚀

