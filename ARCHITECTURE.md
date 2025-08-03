# Technical Architecture - Mazunte Real Estate Platform

## 🏗️ System Overview

The Mazunte platform is a full-stack blockchain application enabling fractional real estate investment through smart contracts. Built with modern web technologies and production-grade security.

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React + TypeScript]
        B[Tailwind CSS + shadcn/ui]
        C[React Query + Context]
    end
    
    subgraph "Blockchain Layer"
        D[Avalanche Fuji Testnet]
        E[Smart Contracts]
        F[USDT Token]
        G[MetaMask Integration]
    end
    
    subgraph "Backend Services"
        H[Supabase Database]
        I[Real-time Subscriptions]
        J[Authentication]
    end
    
    A --> G
    G --> D
    D --> E
    E --> F
    A --> H
    H --> I
    
    style D fill:#ff6b6b
    style E fill:#4ecdc4
    style A fill:#45b7d1
```

## 📊 Smart Contract Architecture

### Contract Hierarchy
```solidity
MazunteMortgageV2
├── ERC1155 (Fractional Ownership Tokens)
├── Ownable (Admin Controls)
├── ReentrancyGuard (Security)
├── Pausable (Emergency Stop)
└── IERC20 (USDT Integration)
```

### Core Contract Functions
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant M as MetaMask
    participant C as Smart Contract
    participant T as USDT Token
    
    U->>F: Initiate Purchase
    F->>M: Request Wallet Connection
    M->>F: Return Wallet Address
    F->>C: Check KYC Status
    C->>F: Return KYC Validity
    F->>T: Approve USDT Spending
    T->>F: Approval Confirmed
    F->>C: Execute Purchase
    C->>C: Validate & Process
    C->>F: Emit Events
    F->>U: Display Success
```

## 🔐 Security Architecture

### Multi-layered Security Model

```mermaid
graph TD
    A[User Request] --> B{KYC Verified?}
    B -->|No| C[Reject Transaction]
    B -->|Yes| D{Accredited Investor?}
    D -->|No| E[Reject Transaction]
    D -->|Yes| F{USDT Approved?}
    F -->|No| G[Request Approval]
    F -->|Yes| H[Execute Transaction]
    H --> I{Cooling-off Active?}
    I -->|Yes| J[Queue for Activation]
    I -->|No| K[Mint Ownership Tokens]
    
    style B fill:#ff9999
    style D fill:#ff9999
    style F fill:#99ccff
    style I fill:#99ff99
```

### Access Control Matrix

| Function | Public | KYC Required | Accredited Required | Admin Only |
|----------|--------|--------------|-------------------|------------|
| `purchaseProperty()` | ❌ | ✅ | ✅ | ❌ |
| `makePayment()` | ❌ | ✅ | ❌ | ❌ |
| `claimRentalIncome()` | ❌ | ✅ | ❌ | ❌ |
| `distributeRentalIncome()` | ❌ | ❌ | ❌ | ✅ |
| `forecloseMortgage()` | ❌ | ❌ | ❌ | ✅ |
| `emergencyPause()` | ❌ | ❌ | ❌ | ✅ |
| `verifyKYC()` | ❌ | ❌ | ❌ | ✅ |

## 💰 Financial Architecture

### Investment Flow
```mermaid
graph LR
    A[Initial Investment] --> B[Down Payment: 20%]
    B --> C[Mortgage Principal: 80%]
    C --> D[Monthly Payments]
    D --> E[Interest + Principal]
    E --> F[Ownership Tokens]
    F --> G[Rental Income Share]
    
    style A fill:#ffe066
    style B fill:#ff6b6b
    style F fill:#4ecdc4
    style G fill:#95e1a3
```

### Payment Schedule Calculation
```javascript
// Compound Interest Formula Implementation
function calculateMonthlyPayment(principal) {
    const monthlyRate = (ANNUAL_RATE_BPS * PRECISION) / (12 * BPS);
    const numberOfPayments = LOAN_TERM_MONTHS;
    
    const numerator = principal * monthlyRate;
    const denominator = PRECISION - 
        ((PRECISION * PRECISION) / 
         ((PRECISION + monthlyRate) ** numberOfPayments));
    
    return numerator / (denominator / PRECISION);
}
```

### Rental Income Distribution
```mermaid
pie title Rental Income Distribution ($1,500/month)
    "Token Holders" : 85
    "Property Management" : 10
    "Insurance Reserve" : 5
```

## 🏢 Database Schema

### Supabase Tables
```sql
-- Properties table
CREATE TABLE properties (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    price NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Public access policy
CREATE POLICY "Allow all access" ON properties FOR ALL USING (true);
```

## 🔧 Frontend Architecture

### Component Hierarchy
```
App.tsx
├── WalletProvider (Context)
│   ├── QueryClientProvider
│   └── BrowserRouter
│       ├── Index (Landing Page)
│       ├── InvestorPortal
│       │   ├── FeaturedProperties
│       │   ├── InvestmentCalculator
│       │   └── PropertyPurchaseModal
│       ├── Portfolio
│       │   ├── InvestorMortgageDashboard
│       │   └── PropertyCard
│       └── SmartContractTest
│           ├── WalletConnection
│           ├── ContractInteraction
│           └── TestingInterface
```

### State Management Flow
```mermaid
graph TD
    A[WalletContext] --> B[Wallet Connection]
    A --> C[Contract Instances]
    A --> D[User Account Data]
    
    E[React Query] --> F[Server State]
    E --> G[Cache Management]
    E --> H[Background Refetch]
    
    I[Local State] --> J[UI State]
    I --> K[Form Data]
    I --> L[Loading States]
    
    style A fill:#4ecdc4
    style E fill:#ff6b6b
    style I fill:#45b7d1
```

## 🌐 Network Architecture

### Avalanche Integration
```mermaid
graph TB
    subgraph "Avalanche Fuji Testnet"
        A[Primary Network]
        B[C-Chain (EVM Compatible)]
        C[Smart Contracts]
        D[USDT Token Contract]
    end
    
    subgraph "User Interface"
        E[MetaMask Wallet]
        F[Web3 Provider]
        G[ethers.js]
    end
    
    E --> F
    F --> G
    G --> B
    B --> C
    B --> D
    
    style B fill:#ff6b6b
    style C fill:#4ecdc4
```

### Network Configuration
```javascript
const AVALANCHE_FUJI = {
    chainId: '0xA869', // 43113 in hex
    chainName: 'Avalanche Fuji Testnet',
    nativeCurrency: {
        name: 'AVAX',
        symbol: 'AVAX',
        decimals: 18
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.snowtrace.io/']
};
```

## 📱 Responsive Design Architecture

### Breakpoint System
```css
/* Tailwind CSS Breakpoints */
sm: '640px',   /* Mobile landscape */
md: '768px',   /* Tablet */
lg: '1024px',  /* Desktop */
xl: '1280px',  /* Large desktop */
2xl: '1536px'  /* Extra large */
```

### Mobile-First Component Design
```jsx
// Responsive PropertyCard example
<Card className="w-full max-w-sm mx-auto md:max-w-md lg:max-w-lg">
    <div className="aspect-video md:aspect-[4/3] lg:aspect-video">
        <img className="w-full h-full object-cover" />
    </div>
    <CardContent className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold">
            {property.name}
        </h3>
    </CardContent>
</Card>
```

## 🔄 Data Flow Architecture

### Real-time Updates
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant S as Smart Contract
    participant D as Database
    participant R as Real-time Service
    
    U->>F: Make Payment
    F->>S: Execute Transaction
    S->>S: Update State
    S->>F: Emit Event
    F->>D: Update Database
    D->>R: Trigger Real-time Update
    R->>F: Push Update to UI
    F->>U: Display Updated Status
```

## 🚀 Deployment Architecture

### Development Environment
```bash
# Local Development Stack
React Development Server (Port 5173)
├── Hot Module Replacement
├── TypeScript Compilation
├── Tailwind CSS Processing
└── Vite Build System

MetaMask Extension
├── Avalanche Fuji Network
├── Test AVAX Tokens
└── Smart Contract Interaction
```

### Production Environment
```bash
# Production Deployment
Lovable Platform
├── CDN Distribution
├── HTTPS Enforcement
├── Build Optimization
└── Custom Domain Support

Avalanche Mainnet (Future)
├── Production Smart Contracts
├── Real USDT Integration
└── Enhanced Security Features
```

## 📊 Performance Optimization

### Frontend Optimization
```javascript
// Code Splitting
const Portfolio = lazy(() => import('./pages/Portfolio'));
const InvestorPortal = lazy(() => import('./pages/InvestorPortal'));

// Memoization for expensive calculations
const monthlyPayment = useMemo(() => 
    calculateMonthlyPayment(principal), [principal]
);

// React Query for efficient data fetching
const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
    staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Smart Contract Optimization
```solidity
// Gas-efficient storage patterns
struct Mortgage {
    uint128 principal;      // Packed to single slot
    uint128 monthlyPayment; // Packed to single slot
    uint32 startDate;       // Packed with next field
    uint32 nextPaymentDue;  // Packed with previous field
    bool isActive;          // Single bit
    bool coolingOffActive;  // Single bit
}

// Batch operations for efficiency
function multicall(bytes[] calldata data) 
    external returns (bytes[] memory results);
```

## 🛡️ Security Monitoring

### Event Logging
```solidity
// Comprehensive event emission
event MortgageCreated(
    address indexed buyer,
    uint256 amount,
    uint256 indexed mortgageId,
    uint256 timestamp
);

event PaymentMade(
    address indexed buyer,
    uint256 amount,
    uint256 remainingBalance,
    uint256 timestamp
);

event SecurityAlert(
    address indexed account,
    string alertType,
    uint256 timestamp
);
```

### Monitoring Dashboard
```mermaid
graph TD
    A[Smart Contract Events] --> B[Event Aggregation]
    B --> C[Security Analysis]
    C --> D[Automated Alerts]
    
    E[User Transactions] --> F[Pattern Analysis]
    F --> G[Anomaly Detection]
    G --> H[Risk Assessment]
    
    I[System Health] --> J[Performance Metrics]
    J --> K[Uptime Monitoring]
    K --> L[Status Dashboard]
    
    style D fill:#ff6b6b
    style H fill:#ff6b6b
    style L fill:#4ecdc4
```

## 📈 Scalability Architecture

### Horizontal Scaling
```mermaid
graph LR
    A[Load Balancer] --> B[Frontend Instance 1]
    A --> C[Frontend Instance 2]
    A --> D[Frontend Instance 3]
    
    E[Blockchain Network] --> F[Multiple RPC Endpoints]
    F --> G[Redundant Connections]
    
    H[Database Cluster] --> I[Primary Database]
    H --> J[Read Replicas]
    
    style A fill:#4ecdc4
    style E fill:#ff6b6b
    style H fill:#95e1a3
```

### Future Scaling Considerations
1. **Layer 2 Integration**: Polygon or Arbitrum for lower fees
2. **Database Sharding**: Partition data across multiple databases
3. **CDN Integration**: Global content distribution
4. **Microservices**: Break down monolithic components
5. **Caching Layers**: Redis for frequently accessed data

---

*This architecture provides enterprise-grade scalability, security, and maintainability for institutional real estate investment.*