# 💰 How to Get USDT Tokens on Base Sepolia

## 🎯 **The Issue:**
You have ETH tokens ($2,000.83) but the contract needs **USDT** tokens. These are different!

## 🔍 **Check What Tokens You Have:**

### 1. Check Your Token Balance
In MetaMask, click on the "Tokens" tab to see all your tokens. You should see:
- **ETH** (native token) - ✅ You have this
- **USDT** (MockUSDT) - ❌ You probably don't have this

### 2. Add MockUSDT Token to MetaMask
1. In MetaMask, click "Import tokens"
2. Use this contract address: `0x82895d380f6df68d50e34d2ccc94bad1415a2b46`
3. Token Symbol: `USDT`
4. Decimals: `6`

## 🚀 **How to Get USDT Tokens:**

### Option 1: Use the MockUSDT Faucet (Recommended)
1. Go to: https://sepolia.basescan.org/address/0x82895d380f6df68d50e34d2ccc94bad1415a2b46#writeContract
2. Connect your wallet
3. Find the `mint` function
4. Enter your wallet address: `0x966fe...cbf94`
5. Enter amount: `1000000000` (1000 USDT)
6. Click "Write" and confirm transaction

### Option 2: Check if There's a Faucet
Some testnets have faucets for MockUSDT. Try searching for "Base Sepolia USDT faucet" or "MockUSDT faucet".

### Option 3: Deploy Your Own MockUSDT (If needed)
If the faucet doesn't work, you might need to deploy your own MockUSDT contract.

## 🔧 **Quick Test:**

Add this to your component to check your USDT balance:

```typescript
const checkUSDTBalance = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const usdtContract = new ethers.Contract(
    "0x82895d380f6df68d50e34d2ccc94bad1415a2b46", // MockUSDT address
    MockUSDTABI,
    provider
  );
  
  const balance = await usdtContract.balanceOf(account);
  console.log('USDT Balance:', formatUSDT(balance));
  
  if (balance === 0n) {
    console.log('❌ No USDT tokens! You need to get some USDT first.');
  } else {
    console.log('✅ You have USDT tokens!');
  }
  
  return balance;
};
```

## 🎯 **The Real Problem:**

Your error "execution reverted (no data present; likely require(false))" is happening because:

1. ✅ You have ETH tokens
2. ❌ You don't have USDT tokens  
3. ❌ The contract tries to transfer USDT from your wallet
4. ❌ `usdt.transferFrom()` fails because you have 0 USDT
5. ❌ Contract hits `require(false)` and reverts

## 🚀 **Solution:**

1. **Get USDT tokens** using the faucet above
2. **Try the purchase again**
3. **It should work!**

The contract is working correctly - you just need the right token type (USDT, not ETH).

---

**Try the MockUSDT faucet first, then test the purchase again!** 🎉
