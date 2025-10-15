# 🔧 PURCHASE ERROR FIX

## **Error**: `could not decode result data (value="0x", info={ "method": "getProperty", "signature": "getProperty(uint256)" }, code=BAD_DATA, version=6.15.0)`

---

## **ROOT CAUSE**

The `PropertyPurchaseModal` component (used in the Investor Portal) is calling a contract that has `getProperty(uint256)` in its ABI, but the actual deployed contract **doesn't have this function**.

### **What's Happening**:

1. **InvestorPortal** page shows property cards (Antalya, Koh Phangan, etc.)
2. User clicks "Purchase with 20% Down"
3. **PropertyPurchaseModal** opens
4. Modal calls `web3Integration.getPropertyStatus()` 
5. This tries to call a contract with `SIMPLE_MORTGAGE` ABI
6. **`SIMPLE_MORTGAGE` ABI includes `getProperty(uint256)`** (line 33 of `src/lib/contracts.ts`)
7. But the actual contract deployed doesn't have this function
8. **Result**: `BAD_DATA` error - can't decode empty response

---

## **THE PROBLEM**

There are **THREE different contract ABIs** in the codebase:

1. **`MAZUNTE_MORTGAGE`** (lines 5-25 of `src/lib/contracts.ts`)
   - Has: `getPropertyStatus()` ✅
   - **Doesn't have**: `getProperty(uint256)` ❌

2. **`SIMPLE_MORTGAGE`** (lines 27-43 of `src/lib/contracts.ts`)
   - Has: `getProperty(uint256)` ✅
   - Address: `0x8A791620dd6260079BF849Dc5567aDC3F2FdC318`
   - **But this contract is on Avalanche Fuji, not Base Sepolia!**

3. **`ANCIENT_MORTGAGE_ETH`** (in `src/lib/abis/ancient-mortgage-eth-abi.ts`)
   - Has: `getMortgage(uint256)` ✅
   - **Doesn't have**: `getProperty(uint256)` ❌
   - Address: `0x9524C8A3b6eEaE8cCE29F6183a7200A530F84bD1`
   - **This is on Base Sepolia** ✅

---

## **THE FIX**

The `PropertyPurchaseModal` needs to **stop trying to call contract functions** that don't exist. Since the properties are hardcoded in the UI anyway, we should:

1. **Remove the `getPropertyStatus()` call** from `web3Integration.ts`
2. **Use hardcoded property data** from `useMortgageProperties.ts`
3. **Only call the contract for actual purchase transactions**

---

## **IMPLEMENTATION**

### **Step 1: Update WalletContext.tsx**

The `purchaseProperty` function should call the **ETH contract** directly, not go through `web3Integration`:

**File**: `src/contexts/WalletContext.tsx`  
**Line**: ~555

**Current**:
```typescript
const downPaymentResult = await web3Integration.purchaseProperty(downPayment);
```

**Should be**:
```typescript
// Use ETH contract directly
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new ethers.Contract(
  ANCIENT_MORTGAGE_ETH_ADDRESS,
  ANCIENT_MORTGAGE_ETH_ABI,
  signer
);

// Calculate ETH amount (23% of property value)
const propertyValue = downPayment / 0.20; // Reverse calculate from 20% down
const totalETH = ethers.parseEther((propertyValue * 0.23).toString());

// Call purchaseProperty
const tx = await contract.purchaseProperty(
  1, // propertyId
  120, // termMonths
  800, // aprBps (8%)
  "0x", // empty signature
  { value: totalETH }
);

const receipt = await tx.wait();

// Extract mortgageId from event
const purchaseEvent = receipt.logs
  .map((log) => {
    try {
      return contract.interface.parseLog(log);
    } catch {
      return null;
    }
  })
  .find((event) => event?.name === 'PropertyPurchased');

const mortgageId = purchaseEvent?.args?.mortgageId?.toString();
```

### **Step 2: Remove getPropertyStatus() calls**

**File**: `src/lib/web3-integration.ts`  
**Lines**: 211-221

**Action**: Comment out or remove this function since it's calling a non-existent function.

### **Step 3: Update PropertyPurchaseModal**

**File**: `src/components/PropertyPurchaseModal.tsx`

**Action**: Remove any calls to `getPropertyStatus()` and use the property data passed in as props.

---

## **QUICK FIX (Temporary)**

If you want a quick fix without refactoring, simply:

1. **Switch to the Enhanced Mortgage tab** instead of the Investor Portal
2. Use the `EnhancedMortgageSystem` component which correctly uses the ETH contract

---

## **LONG-TERM SOLUTION**

**Consolidate to ONE contract system**:

1. **Keep**: `ANCIENT_MORTGAGE_ETH` (Base Sepolia, ETH payments)
2. **Remove**: `MAZUNTE_MORTGAGE` and `SIMPLE_MORTGAGE` references
3. **Update**: All components to use `ANCIENT_MORTGAGE_ETH_ABI` and `ANCIENT_MORTGAGE_ETH_ADDRESS`
4. **Hardcode**: Property data in UI (don't query from contract)

---

## **FILES TO UPDATE**

1. ✅ `src/contexts/WalletContext.tsx` - Update `purchaseProperty` function
2. ✅ `src/lib/web3-integration.ts` - Remove `getPropertyStatus()`
3. ✅ `src/components/PropertyPurchaseModal.tsx` - Remove contract calls
4. ✅ `src/lib/contracts.ts` - Add `ANCIENT_MORTGAGE_ETH` to exports
5. ✅ `src/config/chain.ts` - Already updated to Base Sepolia ✅

---

## **TESTING**

After fixes:
1. Go to **Investor Portal**
2. Click "Purchase with 20% Down" on any property
3. Should **NOT** see "could not decode" error
4. Should see MetaMask popup for ETH payment
5. Transaction should succeed on Base Sepolia

---

**Status**: 🔴 **NEEDS FIX** - Currently broken due to ABI/contract mismatch

