# 🚨 CRITICAL FIX: EnhancedMortgageSystem.tsx

## ❌ Current Problem

Your `EnhancedMortgageSystem.tsx` is calling the wrong function signature:

```typescript
// WRONG (lines 227-234)
const tx = await contract.purchaseProperty(
  propertyId,        // ❌ Parameter 1
  propertyValueWei,  // ❌ Parameter 2  
  downPaymentWei,    // ❌ Parameter 3
  interestRate,      // ❌ Parameter 4
  termMonths,        // ❌ Parameter 5
  { value: totalPayment } // ❌ Sending ETH
);
```

But your deployed contract expects:

```typescript
// CORRECT
function purchaseProperty(uint256 propertyPrice) external returns (uint256 tokenId)
```

## ✅ The Fix

### Step 1: Update the Import

**Replace this line:**
```typescript
import { ENHANCED_AVAX_MORTGAGE_ABI } from '@/lib/enhanced-avax-mortgage-abi';
```

**With this:**
```typescript
import { AncientMortgageABI } from '@/lib/ancient-protocol';
```

### Step 2: Update the Contract Address

**Replace the contract loading with:**
```typescript
import { BASE_SEPOLIA_CONTRACTS } from '@/lib/ancient-protocol';

const contractAddress = BASE_SEPOLIA_CONTRACTS.AncientMortgage;
```

### Step 3: Fix the Purchase Function

**Replace lines 227-234 with:**
```typescript
// Calculate total property price (USDT, 6 decimals)
const propertyPrice = BigInt(propertyValueWei); // Already in correct format

// Approve USDT first (no ETH value!)
const usdtContract = new ethers.Contract(
  BASE_SEPOLIA_CONTRACTS.MockUSDT,
  MockUSDTABI,
  signer
);

// Calculate approval amount (down payment + platform fee)
const downPayment = (propertyPrice * BigInt(20)) / BigInt(100); // 20%
const platformFee = (propertyPrice * BigInt(3)) / BigInt(100);  // 3%
const totalApproval = downPayment + platformFee;

// Approve USDT
await usdtContract.approve(contractAddress, totalApproval);

// Purchase with 1 parameter only (NO ETH VALUE!)
const tx = await contract.purchaseProperty(propertyPrice);
```

### Step 4: Fix the Payment Function

**Find the makePayment call and replace with:**
```typescript
// Get tokenId from the purchase transaction
const receipt = await tx.wait();
const event = receipt.logs.find(log => {
  try {
    return contract.interface.parseLog(log)?.name === 'MortgageCreated';
  } catch { return false; }
});
const tokenId = contract.interface.parseLog(event).args.tokenId;

// Later, for payments:
// Approve USDT for monthly payment
await usdtContract.approve(contractAddress, monthlyPaymentAmount);

// Make payment with tokenId only (NO ETH VALUE!)
await contract.makePayment(tokenId);
```

### Step 5: Update Read Functions

**Replace getMortgageDetails calls with:**
```typescript
// Use tokenId instead of mortgageId
const mortgageData = await contract.getMortgage(tokenId);
```

## 📋 Complete Code Changes

### Import Section:
```typescript
import { 
  AncientMortgageABI, 
  MockUSDTABI,
  BASE_SEPOLIA_CONTRACTS 
} from '@/lib/ancient-protocol';
```

### Contract Setup:
```typescript
const contract = new ethers.Contract(
  BASE_SEPOLIA_CONTRACTS.AncientMortgage,
  AncientMortgageABI,
  signer
);

const usdtContract = new ethers.Contract(
  BASE_SEPOLIA_CONTRACTS.MockUSDT,
  MockUSDTABI,
  signer
);
```

### Purchase Function:
```typescript
const handlePurchase = async (propertyId: number, propertyValue: number) => {
  try {
    // Convert to USDT (6 decimals)
    const propertyPrice = BigInt(propertyValue * 10**6);
    
    // Calculate approval amount
    const downPayment = (propertyPrice * BigInt(20)) / BigInt(100);
    const platformFee = (propertyPrice * BigInt(3)) / BigInt(100);
    const totalApproval = downPayment + platformFee;
    
    // Approve USDT
    await usdtContract.approve(BASE_SEPOLIA_CONTRACTS.AncientMortgage, totalApproval);
    
    // Purchase (1 parameter, no ETH value)
    const tx = await contract.purchaseProperty(propertyPrice);
    const receipt = await tx.wait();
    
    // Get tokenId
    const event = receipt.logs.find(log => {
      try {
        return contract.interface.parseLog(log)?.name === 'MortgageCreated';
      } catch { return false; }
    });
    const tokenId = contract.interface.parseLog(event).args.tokenId;
    
    // Save tokenId to your database
    await saveTokenIdToDatabase(tokenId);
    
    console.log('Purchase successful! TokenId:', tokenId.toString());
  } catch (error) {
    console.error('Purchase failed:', error);
  }
};
```

## 🎯 Key Changes Summary

1. **Import**: Use `AncientMortgageABI` from `/lib/ancient-protocol`
2. **Address**: Use `BASE_SEPOLIA_CONTRACTS.AncientMortgage`
3. **Purchase**: 1 parameter only: `purchaseProperty(propertyPrice)`
4. **Payment**: 1 parameter only: `makePayment(tokenId)`
5. **Token**: USDT approval, no ETH value
6. **Tracking**: Use tokenId (NFT) instead of mortgageId

## 🧪 Test After Changes

1. Connect to Base Sepolia (Chain ID: 84532)
2. Ensure user has USDT balance
3. Try purchase - should succeed without "execution reverted"
4. Verify tokenId is returned and saved
5. Test monthly payment with tokenId

---

**This fix will resolve the "execution reverted (require(false))" error!**
