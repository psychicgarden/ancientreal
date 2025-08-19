# Ancient Smart Contracts - Phase 5 Deployment Guide

## 🚀 Deployment Checklist

### Pre-Deployment Requirements

#### 1. Environment Setup
- [ ] Hardhat environment configured
- [ ] Avalanche Fuji testnet added to MetaMask
- [ ] Test AVAX obtained from [Avalanche Faucet](https://faucet.avax.network/)
- [ ] Private key configured in `.env` file
- [ ] Snowtrace API key configured (for verification)

#### 2. Contract Compilation
```bash
npx hardhat compile
```
- [ ] All contracts compile without errors
- [ ] No security warnings in compilation output
- [ ] Contract size under 24KB limit

#### 3. Test Suite Validation
```bash
npx hardhat test
```
- [ ] All tests pass (100% success rate)
- [ ] No gas limit exceeded errors
- [ ] All business logic tests pass with exact numbers

### Deployment Process

#### Step 1: Deploy to Fuji Testnet
```bash
npx hardhat run scripts/deploy-to-fuji.js --network fuji
```

**Expected Output:**
```
🚀 Starting Ancient Smart Contracts Deployment to Fuji Testnet
Deploying contracts with account: 0x...
Account balance: X.XX AVAX

📄 Deploying Mock USDT...
✅ Mock USDT deployed to: 0x...

🏠 Deploying AncientMortgage...
✅ AncientMortgage deployed to: 0x...

🏗️ Deploying DeveloperEscrowManager...
✅ DeveloperEscrowManager deployed to: 0x...

💰 Deploying EnhancedStakingPool...
✅ EnhancedStakingPool deployed to: 0x...
```

#### Step 2: Verify Deployment
```bash
npx hardhat run scripts/verify-deployment.js --network fuji
```

#### Step 3: Contract Verification on Snowtrace
```bash
npx hardhat verify --network fuji <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

### Feature Flag Configuration

#### 1. Update Contract Addresses
In `src/lib/smart-contract-integration.ts`:
```typescript
fuji: {
  USDT: '0x...', // From deployment output
  ANCIENT_MORTGAGE: '0x...', // From deployment output
  DEVELOPER_ESCROW: '0x...', // From deployment output
  STAKING_POOL: '0x...', // From deployment output
}
```

#### 2. Enable Testnet Mode
```typescript
import { featureFlags, TESTNET_FLAGS } from './feature-flags';

// Enable testnet configuration
featureFlags.updateFlags(TESTNET_FLAGS);
```

#### 3. Gradual Feature Rollout
```typescript
// Start with individual features
featureFlags.updateFlag('mortgageContractEnabled', true);
featureFlags.updateFlag('mortgagePurchaseEnabled', true);

// Test thoroughly, then enable more features
featureFlags.updateFlag('developerEscrowEnabled', true);
featureFlags.updateFlag('stakingPoolEnabled', true);
```

### Integration Testing

#### 1. Frontend Integration Test
- [ ] Connect wallet to Fuji testnet
- [ ] Verify contract addresses are loaded
- [ ] Test basic contract interactions
- [ ] Verify feature flag controls work
- [ ] Test emergency mode functionality

#### 2. Business Logic Validation
Run the integration tests against deployed contracts:
```bash
# Update contract addresses in verify-deployment.js first
npx hardhat run scripts/verify-deployment.js --network fuji
```

**Critical Tests:**
- [ ] 3% platform fee collection works
- [ ] Monthly payment calculation is correct ($1,310.19)
- [ ] 80% escrow threshold enforcement
- [ ] 5% escrow platform fee collection
- [ ] Staking pool yield distribution
- [ ] Cross-contract permission controls

#### 3. End-to-End User Flow
- [ ] Complete property purchase flow
- [ ] Make mortgage payment
- [ ] Developer project funding
- [ ] Staking pool deposit/withdrawal
- [ ] Emergency mode activation

### Security Checklist

#### 1. Access Controls
- [ ] Only authorized addresses can trigger appraisals
- [ ] Only mortgage contract can send yield to staking pool
- [ ] Only owner can activate emergency mode
- [ ] KYC verification works correctly

#### 2. Financial Logic
- [ ] All fee calculations are exact (no rounding errors)
- [ ] No funds can be drained from contracts
- [ ] Decimal handling correct (6 vs 18 decimals)
- [ ] No overflow/underflow in calculations

#### 3. Emergency Procedures
- [ ] Emergency pause functions work
- [ ] Feature flags can disable individual functions
- [ ] Fallback to Supabase works when contracts disabled
- [ ] No user funds trapped in emergency mode

### Production Readiness

#### 1. Performance Validation
- [ ] Gas costs reasonable for all functions
- [ ] No functions exceed block gas limit
- [ ] Contract interactions complete within 30 seconds
- [ ] Multiple users can interact simultaneously

#### 2. Monitoring Setup
- [ ] Contract event monitoring configured
- [ ] Error logging for failed transactions
- [ ] Health check endpoint implemented
- [ ] Alert system for emergency conditions

#### 3. Documentation
- [ ] Contract addresses documented
- [ ] ABI files available for frontend
- [ ] Business logic documentation updated
- [ ] Rollback procedures documented

## 🚨 Emergency Procedures

### Emergency Mode Activation
```typescript
import { featureFlags } from './feature-flags';

// Immediate emergency shutdown
featureFlags.enableEmergencyMode();
```

### Rollback to Supabase-Only
1. Activate emergency mode (disables all smart contract features)
2. Verify all new transactions use Supabase backend
3. Investigate and fix smart contract issues
4. Re-enable features gradually after testing

### Emergency Contacts
- **Smart Contract Issues**: [Technical Lead]
- **Financial Discrepancies**: [Finance Team]
- **User Impact**: [Customer Support]

## 📊 Success Metrics

### Deployment Success
- [ ] 100% test pass rate
- [ ] All contracts verified on Snowtrace
- [ ] Gas costs under 500,000 for major functions
- [ ] Zero failed transactions in integration testing

### Business Logic Validation
- [ ] $1,310.19 monthly payment calculation exact
- [ ] 3% platform fee = $4,050 on $135k property
- [ ] 80% threshold = $800k on $1M project
- [ ] 5% escrow fee = $40.5k on $810k release
- [ ] 50/40/10 split: $57.5k/$46k/$11.5k on $115k appreciation

### Integration Success
- [ ] Feature flags control all smart contract access
- [ ] Fallback to Supabase works seamlessly
- [ ] Emergency mode disables all blockchain operations
- [ ] Platform remains fully functional in all modes

## 🎯 Post-Deployment Tasks

1. **Monitor Deployment**
   - Watch for any transaction failures
   - Monitor gas usage and costs
   - Check error logs for issues

2. **User Communication**
   - Announce testnet deployment to team
   - Provide testing guidelines
   - Collect feedback on functionality

3. **Prepare for Mainnet**
   - Document any issues found
   - Optimize gas usage if needed
   - Plan mainnet deployment timeline

4. **Continuous Testing**
   - Run integration tests daily
   - Monitor business logic accuracy
   - Test emergency procedures regularly

---

**✅ Phase 5 Complete: Platform Safety & Integration**

The smart contracts are now safely deployed on testnet with comprehensive feature flags, emergency controls, and fallback mechanisms. The platform can operate entirely on Supabase while gradually integrating smart contract functionality with zero risk to user experience.