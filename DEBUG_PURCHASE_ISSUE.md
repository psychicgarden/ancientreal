# 🐛 DEBUG: Purchase Property Issue

## Current Error:
```
execution reverted (no data present; likely require(false))
0x4f843494000000000000000000000000000000000
```

## 🔍 **Diagnostic Steps:**

### 1. Check USDT Balance
Before purchasing, verify the user has enough USDT:

```typescript
// Add this to your component for debugging
const checkUSDTBalance = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const usdtContract = new ethers.Contract(
    BASE_SEPOLIA_CONTRACTS.MockUSDT, 
    MockUSDTABI, 
    provider
  );
  
  const balance = await usdtContract.balanceOf(account);
  console.log('USDT Balance:', formatUSDT(balance));
  
  const propertyPrice = parseUSDT(propertyValue);
  const totalNeeded = calculateTotalApproval(propertyPrice);
  
  console.log('Property Price:', formatUSDT(propertyPrice));
  console.log('Total USDT Needed:', formatUSDT(totalNeeded));
  console.log('Has Enough USDT:', balance >= totalNeeded);
  
  return balance >= totalNeeded;
};
```

### 2. Check USDT Allowance
Verify the approval worked:

```typescript
const checkAllowance = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const usdtContract = new ethers.Contract(
    BASE_SEPOLIA_CONTRACTS.MockUSDT, 
    MockUSDTABI, 
    provider
  );
  
  const allowance = await usdtContract.allowance(account, contractAddress);
  console.log('USDT Allowance:', formatUSDT(allowance));
  
  const propertyPrice = parseUSDT(propertyValue);
  const totalNeeded = calculateTotalApproval(propertyPrice);
  
  console.log('Allowance >= Needed:', allowance >= totalNeeded);
  
  return allowance >= totalNeeded;
};
```

### 3. Check Contract State
Verify the contract is not paused:

```typescript
const checkContractState = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, AncientMortgageABI, provider);
  
  try {
    const paused = await contract.paused();
    console.log('Contract Paused:', paused);
    
    const owner = await contract.owner();
    console.log('Contract Owner:', owner);
    
    const usdtAddress = await contract.usdt();
    console.log('USDT Address:', usdtAddress);
    
    return !paused;
  } catch (error) {
    console.error('Error checking contract state:', error);
    return false;
  }
};
```

### 4. Test with Minimal Amount
Try with a very small amount first:

```typescript
const testMinimalPurchase = async () => {
  // Try with 1 USDT (1000000 wei)
  const testPrice = BigInt(1000000); // 1 USDT
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, AncientMortgageABI, signer);
  const usdtContract = new ethers.Contract(BASE_SEPOLIA_CONTRACTS.MockUSDT, MockUSDTABI, signer);
  
  // Approve 1 USDT
  await usdtContract.approve(contractAddress, testPrice);
  
  // Try purchase
  const tx = await contract.purchaseProperty(testPrice);
  console.log('Test purchase tx:', tx.hash);
  
  return tx;
};
```

## 🎯 **Most Likely Issues:**

### Issue 1: Insufficient USDT Balance
- User doesn't have enough USDT tokens
- **Solution**: Get USDT from faucet or transfer some

### Issue 2: USDT Contract Issue
- MockUSDT contract might not be working properly
- **Solution**: Check if MockUSDT is deployed and working

### Issue 3: Contract Paused
- The AncientMortgage contract might be paused
- **Solution**: Check contract state

### Issue 4: Wrong Network
- User might be on wrong network
- **Solution**: Ensure on Base Sepolia (Chain ID: 84532)

### Issue 5: Approval Amount Too Low
- The approval might not cover the full amount needed
- **Solution**: Check calculation of totalApproval

## 🚀 **Quick Fix to Try:**

Add this debugging code to your purchase function:

```typescript
const handlePurchaseProperty = async (propertyId: number, propertyValue: string, downPayment: string) => {
  // ... existing code ...
  
  try {
    // DEBUG: Check everything before purchase
    console.log('=== DEBUG INFO ===');
    
    // Check balance
    const balance = await usdtContract.balanceOf(account);
    console.log('USDT Balance:', formatUSDT(balance));
    
    // Check allowance
    const allowance = await usdtContract.allowance(account, contractAddress);
    console.log('Current Allowance:', formatUSDT(allowance));
    
    // Check contract state
    const paused = await contract.paused();
    console.log('Contract Paused:', paused);
    
    // Calculate amounts
    const propertyPrice = parseUSDT(propertyValue);
    const totalApproval = calculateTotalApproval(propertyPrice);
    console.log('Property Price:', formatUSDT(propertyPrice));
    console.log('Total Approval Needed:', formatUSDT(totalApproval));
    
    // Check if we have enough
    if (balance < totalApproval) {
      throw new Error(`Insufficient USDT balance. Need ${formatUSDT(totalApproval)}, have ${formatUSDT(balance)}`);
    }
    
    if (allowance < totalApproval) {
      console.log('Approving USDT...');
      const approveTx = await usdtContract.approve(contractAddress, totalApproval);
      await approveTx.wait();
      console.log('USDT approved');
    }
    
    console.log('=== STARTING PURCHASE ===');
    const tx = await contract.purchaseProperty(propertyPrice);
    // ... rest of code ...
    
  } catch (error) {
    console.error('Purchase error:', error);
    // ... error handling ...
  }
};
```

## 📋 **Action Items:**

1. **Add the debugging code above**
2. **Check console logs** for the debug info
3. **Verify USDT balance** is sufficient
4. **Check if contract is paused**
5. **Try with minimal amount** (1 USDT) first

The error suggests a `require(false)` condition is failing in the contract. The most common causes are:
- Insufficient USDT balance
- Contract is paused
- USDT transferFrom is failing
- Wrong network

Let me know what the debug logs show!
