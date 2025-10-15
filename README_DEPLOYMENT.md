# 🎉 Ancient Lending - ETH Version Deployed!

## ✅ **READY TO USE**

The ETH version of Ancient Lending is **deployed and ready** for testing on Base Sepolia.

---

## 📋 **Deployed Contract**

### **AncientMortgageETH**
- **Address**: `0x9524C8A3b6eEaE8cCE29F6183a7200A530F84bD1`
- **Network**: Base Sepolia (Chain ID: 84532)
- **Explorer**: [View on BaseScan](https://sepolia.basescan.org/address/0x9524C8A3b6eEaE8cCE29F6183a7200A530F84bD1)
- **Owner**: `0x966feD85116F6D283921a6ed176D7643a99cbf94`

---

## 🚀 **Quick Start**

### **1. View the Guide**
📖 **Start here**: [`START_HERE_ETH.md`](./START_HERE_ETH.md)

### **2. Integration Guide**
📚 **Full details**: [`ETH_INTEGRATION_GUIDE.md`](./ETH_INTEGRATION_GUIDE.md)

### **3. Files Available**
- ✅ `src/lib/ancient-protocol/abis/AncientMortgageETH_ABI.json` - Contract ABI
- ✅ `src/lib/ancient-protocol/addresses-eth.ts` - Contract addresses
- ✅ `src/lib/ancient-protocol/` - Full integration package

---

## 🎯 **Key Features**

### **ETH Version (Easy Testing)**
- ✅ **No USDT needed** - uses ETH directly
- ✅ **No approvals** - just send ETH value
- ✅ **One transaction** - purchase in a single tx
- ✅ **Fast testing** - immediate results

### **Business Model**
- 20% down payment
- 8% APR
- 10-year term (120 months)
- 3% platform fee
- NFT-based ownership

---

## 💡 **Simple Example**

```typescript
import { ethers } from 'ethers';
import AncientMortgageETHABI from '@/lib/ancient-protocol/abis/AncientMortgageETH_ABI.json';

const CONTRACT_ADDRESS = "0x9524C8A3b6eEaE8cCE29F6183a7200A530F84bD1";

async function purchaseProperty(propertyValueETH: string) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, AncientMortgageETHABI, signer);
  
  const propertyPrice = ethers.parseEther(propertyValueETH);
  const totalETH = (propertyPrice * BigInt(23)) / BigInt(100); // 23% (20% down + 3% fee)
  
  const tx = await contract.purchaseProperty(propertyPrice, { value: totalETH });
  const receipt = await tx.wait();
  
  console.log('Purchase successful!', receipt);
}

// Example: Purchase a 100 ETH property
await purchaseProperty("100");
```

---

## 📁 **Repository Structure**

```
ancientreal/
├── src/lib/ancient-protocol/
│   ├── abis/
│   │   ├── AncientMortgageETH_ABI.json  ✅ NEW: ETH version ABI
│   │   ├── AncientMortgage_ABI.json     ✅ USDT version ABI
│   │   └── MockUSDT_ABI.json            ✅ Mock USDT ABI
│   ├── addresses-eth.ts                 ✅ NEW: ETH contract addresses
│   ├── addresses.ts                     ✅ USDT contract addresses
│   ├── types.ts                         ✅ TypeScript types
│   └── index.ts                         ✅ Main exports
├── START_HERE_ETH.md                    ✅ Quick start guide
├── ETH_INTEGRATION_GUIDE.md             ✅ Complete integration guide
└── README_DEPLOYMENT.md                 ✅ This file
```

---

## 🔀 **Two Versions Available**

### **1. ETH Version (Recommended for Testing)**
- **Contract**: `0x9524C8A3b6eEaE8cCE29F6183a7200A530F84bD1`
- **Use**: Easy testing with ETH
- **Guide**: `START_HERE_ETH.md`

### **2. USDT Version (Production)**
- **Contract**: `0xb48a5f86ffe36d3249acf6d97b14c2eac0dea6b5`
- **Use**: Production with USDT stablecoin
- **Note**: Requires USDT approval flow

---

## 🎯 **Next Steps**

1. **Read**: [`START_HERE_ETH.md`](./START_HERE_ETH.md) - Quick start
2. **Integrate**: Update `src/components/EnhancedMortgageSystem.tsx`
3. **Test**: Try purchasing a property on Base Sepolia

---

## 🆘 **Support**

- **Contract Explorer**: https://sepolia.basescan.org/address/0x9524C8A3b6eEaE8cCE29F6183a7200A530F84bD1
- **Integration Guide**: `ETH_INTEGRATION_GUIDE.md`
- **Contract Address**: `0x9524C8A3b6eEaE8cCE29F6183a7200A530F84bD1`
- **Network**: Base Sepolia (84532)

---

**Ready to build! The ETH version makes testing fast and easy.** 🚀

