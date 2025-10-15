# 🚨 CRITICAL FIX: EnhancedMortgageSystem.tsx

## ❌ Current Problems

Your `EnhancedMortgageSystem.tsx` has **THREE CRITICAL ISSUES**:

### 1. Wrong ABI
```typescript
// WRONG (line 15)
import { ENHANCED_AVAX_MORTGAGE_ABI } from '@/lib/enhanced-avax-mortgage-abi';

// CORRECT
import { AncientMortgageABI } from '@/lib/ancient-protocol';
```

### 2. Wrong Function Signature
```typescript
// WRONG (lines 227-234) - 5 parameters + ETH value
const tx = await contract.purchaseProperty(
  propertyId,
  propertyValueWei,
  downPaymentWei,
  interestRate,
  termMonths,
  { value: totalPayment }  // ❌ Sending ETH
);

// CORRECT - 1 parameter, no ETH value
const tx = await contract.purchaseProperty(propertyPrice);
```

### 3. Wrong Contract Address
```typescript
// WRONG - Dynamic lookup that might fail
const contractAddress = await ContractDatabaseIntegration.getContractAddress(...)

// CORRECT - Use deployed address
import { BASE_SEPOLIA_CONTRACTS } from '@/lib/ancient-protocol';
const contractAddress = BASE_SEPOLIA_CONTRACTS.AncientMortgage;
```

## ✅ The Complete Fix

### Step 1: Update Imports
```typescript
// Replace line 15
import { 
  AncientMortgageABI, 
  MockUSDTABI,
  BASE_SEPOLIA_CONTRACTS 
} from '@/lib/ancient-protocol';
```

### Step 2: Fix Contract Setup
```typescript
// Replace all contract instantiations (lines 139, 173, 219, 306)
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

### Step 3: Fix Purchase Function (lines 227-234)
```typescript
const handlePurchase = async (propertyId: number, propertyValue: string) => {
  try {
    // Convert to USDT (6 decimals)
    const propertyPrice = BigInt(parseFloat(propertyValue) * 10**6);
    
    // Calculate approval amount (20% down + 3% fee)
    const downPayment = (propertyPrice * BigInt(20)) / BigInt(100);
    const platformFee = (propertyPrice * BigInt(3)) / BigInt(100);
    const totalApproval = downPayment + platformFee;
    
    // Approve USDT first
    await usdtContract.approve(BASE_SEPOLIA_CONTRACTS.AncientMortgage, totalApproval);
    
    // Purchase with 1 parameter only (NO ETH VALUE!)
    const tx = await contract.purchaseProperty(propertyPrice);
    const receipt = await tx.wait();
    
    // Extract tokenId from event
    const event = receipt.logs.find(log => {
      try {
        return contract.interface.parseLog(log)?.name === 'MortgageCreated';
      } catch { return false; }
    });
    const tokenId = contract.interface.parseLog(event).args.tokenId;
    
    console.log('Purchase successful! TokenId:', tokenId.toString());
    
    // Save tokenId to database
    await saveTokenIdToDatabase(tokenId);
    
  } catch (error) {
    console.error('Purchase failed:', error);
  }
};
```

### Step 4: Fix Payment Function
```typescript
const handleMakePayment = async () => {
  try {
    // Get mortgage data to find payment amount
    const mortgageData = await contract.getMortgage(tokenId);
    const monthlyPayment = mortgageData.monthlyPayment;
    
    // Approve USDT
    await usdtContract.approve(BASE_SEPOLIA_CONTRACTS.AncientMortgage, monthlyPayment);
    
    // Make payment with tokenId only (NO ETH VALUE!)
    const tx = await contract.makePayment(tokenId);
    await tx.wait();
    
    console.log('Payment successful!');
  } catch (error) {
    console.error('Payment failed:', error);
  }
};
```

### Step 5: Fix Read Functions
```typescript
// Replace getMortgageDetails(address) with getMortgage(tokenId)
const mortgageData = await contract.getMortgage(tokenId);

// Remove calls to getTotalProperties() and getProperty() 
// These don't exist in the deployed contract
```

## 🎯 Contract Addresses (Base Sepolia)

```typescript
AncientMortgage: 0xb48a5f86ffe36d3249acf6d97b14c2eac0dea6b5
MockUSDT:        0x82895d380f6df68d50e34d2ccc94bad1415a2b46
```

## 🧪 Test After Fix

1. Connect to Base Sepolia (Chain ID: 84532)
2. Ensure user has USDT balance
3. Try purchase - should succeed without "execution reverted"
4. Verify tokenId is returned and saved
5. Test monthly payment with tokenId

---

**This will fix the "execution reverted (require(false))" error!**
