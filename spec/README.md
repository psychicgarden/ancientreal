# Mazunte Real Estate Investment Platform

## Project Overview

**URL**: https://lovable.dev/projects/5b55e7b4-93bd-4a0a-99b8-a864add8d681

Mazunte is a blockchain-powered real estate investment platform that enables fractional ownership of premium properties through smart contracts. Built on Avalanche, it provides secure, transparent, and automated property investment with integrated mortgage systems, KYC verification, and rental income distribution.

## 🏗️ Technical Architecture

### Core Technologies
- **Frontend**: React 18 + TypeScript + Vite
- **Blockchain**: Avalanche Fuji Testnet
- **Smart Contracts**: Solidity (OpenZeppelin standards)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query + Context API
- **Backend**: Supabase (PostgreSQL + Real-time)

### Smart Contract System
- **MazunteMortgageV2**: Production-ready mortgage contract with fractional ownership (ERC1155)
- **USDT Integration**: Stable currency for all transactions
- **Village Citizenship**: Community governance tokens
- **Rental Distribution**: Automated income distribution to token holders

## 🚀 Quick Start for Technical Review

### Prerequisites
```bash
# Install Node.js (v18+)
node --version  # Should be 18+
npm --version   # Should be 8+

# Install Git
git --version
```

### Local Development Setup
```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Blockchain Testing Setup
```bash
# Install MetaMask browser extension
# Add Avalanche Fuji Testnet:
Network Name: Avalanche Fuji Testnet
RPC URL: https://api.avax-test.network/ext/bc/C/rpc
Chain ID: 43113
Symbol: AVAX
Explorer: https://testnet.snowtrace.io/

# Get test AVAX from faucet:
# https://faucet.avax.network/
```

## 🔐 Smart Contract Security Features

### Production-Ready Security
- **ReentrancyGuard**: Prevents reentrancy attacks
- **Pausable**: Emergency stop functionality
- **KYC Verification**: ECDSA signature-based identity verification
- **Accredited Investor**: Compliance with financial regulations
- **Cooling-off Period**: 72-hour cancellation window
- **Multi-signature**: Admin controls with multiple signatures

### Financial Precision
- **Fixed-point Arithmetic**: 18-decimal precision for calculations
- **Compound Interest**: Accurate monthly payment calculations
- **Basis Points**: Industry-standard APR representation
- **Late Fees**: Automated penalty system
- **Foreclosure Protection**: Clear missed payment thresholds

## 🧪 Testing the Platform

### Frontend Testing
```bash
# Run development server
npm run dev

# Test user flows:
# 1. Connect MetaMask wallet
# 2. Navigate to /test for smart contract testing
# 3. Test village membership, token purchases
# 4. Try property investment flow
```

### Smart Contract Testing
The platform includes a dedicated testing interface at `/test` route:

1. **Wallet Connection**: Connect MetaMask to Avalanche Fuji
2. **Village Membership**: Test citizenship token minting
3. **Property Purchase**: Simulate mortgage creation with test USDT
4. **Payment Processing**: Test monthly payment system
5. **Rental Distribution**: Verify income distribution logic

### Contract Addresses (Fuji Testnet)
```solidity
// Core Contracts
MAZUNTE_MORTGAGE: 0x1234567890123456789012345678901234567890
USDT_TOKEN: 0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
VILLAGE_CITIZENSHIP: 0x9876543210987654321098765432109876543210

// Network Configuration
Chain ID: 43113
RPC: https://api.avax-test.network/ext/bc/C/rpc
Explorer: https://testnet.snowtrace.io/
```

## 📊 Investment Mechanics

### Property Investment Flow
1. **KYC Verification**: Identity verification via signed attestation
2. **Accredited Investor**: Status verification for regulatory compliance
3. **Down Payment**: USDT transfer for property purchase
4. **Cooling-off Period**: 72-hour cancellation window
5. **Mortgage Activation**: Automatic activation after cooling-off
6. **Fractional Ownership**: ERC1155 tokens representing property shares
7. **Monthly Payments**: Automated USDT payments with interest
8. **Rental Income**: Proportional distribution to token holders

### Financial Parameters
```javascript
// Mazunte Property (Production Values)
PROPERTY_VALUE: $150,000 USD
DOWN_PAYMENT: $30,000 USD (20%)
MONTHLY_RENT: $1,500 USD
MORTGAGE_RATE: 8.5% APR
LOAN_TERM: 15 years (180 months)
MONTHLY_PAYMENT: $1,180.76 USD

// Fees and Limits
VILLAGE_CITIZENSHIP: $100 USD
LATE_FEE: $50 USD
MAX_MISSED_PAYMENTS: 4
GRACE_PERIOD: 10 days
```

## 🔍 Code Quality & Standards

### Architecture Patterns
- **Component-based**: Modular React components
- **Custom Hooks**: Reusable blockchain integration logic
- **Context API**: Global state management
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error boundaries and validation

### Smart Contract Standards
- **OpenZeppelin**: Industry-standard contract libraries
- **ERC1155**: Multi-token standard for fractional ownership
- **IERC20**: USDT token interface compliance
- **Upgradeable**: Proxy pattern for future improvements
- **Gas Optimized**: Efficient storage and computation patterns

## 🛠️ Development Tools

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint code analysis
npm run type-check   # TypeScript validation
```

### Environment Configuration
```bash
# Blockchain Configuration
VITE_AVALANCHE_RPC=https://api.avax-test.network/ext/bc/C/rpc
VITE_CHAIN_ID=43113
VITE_NETWORK_NAME=Avalanche Fuji Testnet

# Contract Addresses (automatically configured)
```

## 📈 Platform Analytics

### Investment Tracking
- Real-time portfolio valuation
- Payment history and schedules
- Rental income tracking
- Property appreciation metrics
- ROI calculations

### Blockchain Integration
- Transaction history on Avalanche
- Smart contract event logging
- Gas fee optimization
- Multi-wallet support (MetaMask, WalletConnect)

## 🏢 Production Deployment

### Hosting Options
- **Lovable Platform**: One-click deployment
- **Custom Domain**: Connect your own domain
- **Self-hosting**: Deploy to any web host
- **IPFS**: Decentralized hosting option

### Security Considerations
- HTTPS enforcement
- CSP headers
- XSS protection
- CSRF tokens
- Rate limiting

## 🔗 External Integrations

### Blockchain Services
- **Avalanche**: Layer-1 blockchain for smart contracts
- **Snowtrace**: Block explorer for transaction verification
- **Chainlink**: Price feeds (future integration)
- **IPFS**: Decentralized storage for documents

### Financial Services
- **USDT**: Stable currency for transactions
- **Bank Integration**: Traditional banking bridge (roadmap)
- **Insurance**: Property insurance integration
- **Legal**: Smart contract legal compliance

## 📚 Additional Resources

### Documentation
- [Technical Architecture](./ARCHITECTURE.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Smart Contract API](./SMART_CONTRACT_API.md)
- [Security Audit](./SECURITY_AUDIT.md)

### External Links
- [Avalanche Documentation](https://docs.avax.network/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Lovable Platform](https://docs.lovable.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Submit pull request
5. Code review and merge

### Testing Requirements
- Unit tests for all smart contract functions
- Integration tests for user flows
- Security testing for financial operations
- Gas optimization analysis

---

## Contact & Support

For technical questions or investment inquiries, please contact:
- **Technical**: [Developer Documentation](./DEVELOPER_GUIDE.md)
- **Investment**: [Investment Portal](/investor)
- **Platform**: [Lovable Project](https://lovable.dev/projects/5b55e7b4-93bd-4a0a-99b8-a864add8d681)

*This platform is built for transparency, security, and investor confidence. All code is open-source and auditable.*