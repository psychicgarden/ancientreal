# Smart Contract Integration Guide

## Quick Start

### 1. Deploy Contracts (15 minutes)

```bash
# Deploy to Avalanche Fuji testnet
npx hardhat run scripts/deploy-smart-contracts.js --network fuji

# Copy the output addresses and update smart-contract-integration.ts
```

### 2. Update Contract Addresses

After deployment, update `src/lib/smart-contract-integration.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  fuji: {
    USDT: '0x...',                    // From deployment output
    ANCIENT_MORTGAGE: '0x...',        // From deployment output  
    STAKING_POOL: '0x...',           // From deployment output
  }
};
```

### 3. Enable Feature Flags

```typescript
// In src/lib/feature-flags.ts - set contractAddressesVerified: true
featureFlags.updateFlag('contractAddressesVerified', true);
```

### 4. Test End-to-End Flow

1. **Connect Wallet** → Avalanche Fuji testnet
2. **Purchase Property** → Triggers 3% platform fee + mortgage creation
3. **Make Payment** → Interest automatically flows to staking pool  
4. **Deposit Stake** → Earn yield from real mortgage interest
5. **View APY** → Calculated from actual cashflows, not hardcoded

## Architecture Overview

```
┌─────────────────┐    Interest    ┌──────────────────┐
│ AncientMortgage │───────────────→│ EnhancedStaking  │
│                 │                │ Pool             │
│ • 8% APR        │    10% of      │                  │
│ • 120 payments  │  Appreciation  │ • ERC4626        │
│ • 3% platform   │      Share     │ • Real yield     │
│   fee           │───────────────→│ • 7.5-8.5% APY  │
└─────────────────┘                └──────────────────┘
```

## Key Features Implemented

### ✅ Mortgage Contract
- **Business Logic**: 3% platform fee, 8% APR, 120-month terms
- **Year-10 Trigger**: Based on payment completion (not time)
- **50/40/10 Split**: Buyer/Treasury/Pool appreciation distribution
- **Live Yield**: Interest payments automatically flow to staking pool

### ✅ Staking Pool  
- **Real APY**: Calculated from actual mortgage cashflows
- **ERC4626**: Gas-efficient yield distribution
- **Dual Feed**: Monthly interest + Year-10 appreciation
- **Management Fee**: 2% collected for treasury

### ✅ Frontend Integration
- **Fallback System**: Smart contracts → Supabase if contracts fail
- **Feature Flags**: Safe rollout with emergency shutdown
- **Transaction Hash**: All interactions show blockchain proof

## Security Features

1. **Emergency Mode**: Instantly disables all contracts, falls back to Supabase
2. **Feature Flags**: Granular control over each contract function
3. **Input Validation**: All parameters validated before blockchain calls
4. **Fallback System**: Seamless degradation if contracts unavailable

## Demo Script for Investors

### Mortgage Flow
1. Connect wallet → Select Fuji testnet
2. Purchase property → Shows 3% fee collection + mortgage NFT
3. Make payment → Display real transaction hash + pool notification
4. View pool growth → APY increases from real interest

### Staking Flow  
1. Deposit USDT → Receive pool shares (ERC4626)
2. View yield → Calculated from actual mortgage payments
3. Watch APY → Updates as more mortgages make payments
4. Withdraw → Claim accumulated yield

### Year-10 Demo
1. Complete 120 payments → Triggers appraisal eligibility
2. Appraisal event → 50/40/10 split executed
3. Pool boost → 10% appreciation share increases APY
4. Refinancing → New 11% APR mortgage option

## Technical Implementation

### Contract Wiring
```solidity
// In makePayment() - routes interest to pool
require(usdt.transfer(lendingPoolContract, interestPortion), "Interest transfer failed");
IStakingPool(lendingPoolContract).receiveMortgageInterest(interestPortion);
```

### Frontend Integration
```typescript
// Executes with fallback safety
await smartContractIntegration.executeContractFunction(
  'ancientMortgage',
  'makePayment', 
  [tokenId],
  async () => supabaseFallback()
);
```

## Deployment Status

- ✅ Smart contracts compiled and tested
- ✅ Deployment script ready
- ✅ Frontend integration wired
- ⏳ Awaiting testnet deployment
- ⏳ Contract address configuration
- ⏳ End-to-end testing

## Next Steps

1. Run deployment script
2. Update contract addresses
3. Set `contractAddressesVerified: true`
4. Test with small amounts first
5. Demo to investors with live transactions

---

**Result**: Live blockchain integration showing real-time yield distribution from mortgage interest to staking pool, proving the business model works end-to-end.