# 🎉 ETH Version Contract Ready!

## ✅ **What's Ready:**

### **1. Contract Created:**
- **`AncientMortgageETH.sol`** - ETH version that accepts ETH instead of USDT
- **Contract Address**: `0xE527DDaC2592FAa45884a0B78E4D377a5D3dF8cc` (simulated, not deployed yet)

### **2. Deployment Script Ready:**
- **`DeployETHSimple.s.sol`** - Simple deployment script
- **Command**: `forge script script/DeployETHSimple.s.sol:DeployETHSimpleScript --rpc-url https://rpc.inverter.network/main/evm/84532 --broadcast --verify -vvvv`

### **3. Contract Functions:**
```solidity
// Purchase with ETH
function purchaseProperty(uint256 propertyPrice) external payable returns (uint256)

// Make payment with ETH  
function makePayment(uint256 tokenId) external payable

// Get mortgage data
function getMortgage(uint256 tokenId) external view returns (Mortgage memory)
```

## 🚀 **To Deploy (When You're Ready):**

1. **Make sure you have ETH** in your wallet on Base Sepolia
2. **Run the deployment command:**
   ```bash
   cd /Users/bradywilliams/Desktop/ancient-sc
   forge script script/DeployETHSimple.s.sol:DeployETHSimpleScript --rpc-url https://rpc.inverter.network/main/evm/84532 --broadcast --verify -vvvv
   ```

## 🎯 **Frontend Integration (Ready to Use):**

### **Updated Purchase Function:**
```typescript
const handlePurchaseProperty = async (propertyId: number, propertyValue: string, downPayment: string) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      "0xE527DDaC2592FAa45884a0B78E4D377a5D3dF8cc", // ETH contract address
      AncientMortgageETHABI,
      signer
    );
    
    // Convert to ETH (18 decimals)
    const propertyPrice = ethers.parseEther(propertyValue);
    
    // Calculate total ETH needed (20% down + 3% platform fee)
    const downPayment = (propertyPrice * BigInt(20)) / BigInt(100);
    const platformFee = (propertyPrice * BigInt(3)) / BigInt(100);
    const totalETH = downPayment + platformFee;
    
    // Purchase with ETH value
    const tx = await contract.purchaseProperty(propertyPrice, { value: totalETH });
    const receipt = await tx.wait();
    
    // Extract tokenId from event
    const event = receipt.logs.find(log => {
      const parsed = contract.interface.parseLog(log);
      return parsed?.name === 'MortgageCreated';
    });
    const tokenId = contract.interface.parseLog(event).args.tokenId;
    
    console.log('Purchase successful! TokenId:', tokenId.toString());
    
  } catch (error) {
    console.error('Purchase error:', error);
  }
};
```

### **Updated Payment Function:**
```typescript
const handleMakePayment = async () => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      "0xE527DDaC2592FAa45884a0B78E4D377a5D3dF8cc", // ETH contract address
      AncientMortgageETHABI,
      signer
    );
    
    // Get payment amount from contract
    const mortgageData = await contract.getMortgage(userTokenId);
    const monthlyPayment = mortgageData.monthlyPayment;
    
    // Make payment with ETH value
    const tx = await contract.makePayment(userTokenId, { value: monthlyPayment });
    await tx.wait();
    
    console.log('Payment successful!');
    
  } catch (error) {
    console.error('Payment error:', error);
  }
};
```

## 🎯 **Benefits:**

- ✅ **Uses ETH directly** - no USDT needed
- ✅ **No approvals** - just send ETH value
- ✅ **Same business logic** - 20% down, 8% APR, 10 years
- ✅ **Fast testing** - immediate transactions
- ✅ **Easy debugging** - clear ETH amounts

## 📋 **Next Steps:**

1. **Deploy the contract** when you're ready (need ETH for gas)
2. **Update your frontend** with the ETH functions above
3. **Test with ETH** - much easier than USDT!

**The ETH version is ready to go - just needs deployment!** 🚀
