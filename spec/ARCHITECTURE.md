# Architecture Overview

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Blockchain    │
│   (Vite/React)  │    │   (Supabase)    │    │   (Avalanche)   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • React 18      │───▶│ • PostgreSQL    │    │ • Smart         │
│ • TypeScript    │    │ • Edge Functions│    │   Contracts     │
│ • Tailwind CSS  │    │ • Row Level     │    │ • MetaMask      │
│ • Wallet        │    │   Security      │    │   Integration   │
│   Integration   │    │ • Real-time     │    │ • USDT/AVAX     │
│ • State Mgmt    │    │   Updates       │    │   Tokens        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Core Components

### Frontend Layer (Vite + React)
- **Framework**: Vite + React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui component library
- **State Management**: React Context + hooks
- **Routing**: React Router DOM
- **Authentication**: Wallet-based authentication

### Backend Layer (Supabase)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **API**: Auto-generated REST API with TypeScript types
- **Edge Functions**: Serverless functions for complex operations
- **Real-time**: WebSocket connections for live updates
- **Storage**: File storage for documents and assets
- **Security**: JWT-based authentication with wallet signatures

### Blockchain Layer (Avalanche Fuji Testnet)
- **Smart Contracts**: Solidity contracts for mortgage management
- **Wallet Integration**: MetaMask and Web3 provider support
- **Token Standards**: ERC-20 (USDT) and ERC-1155 (Property tokens)
- **Network**: Avalanche Fuji Testnet (transitioning to Mainnet)

## Data Flow

### 1. User Authentication
```
User → MetaMask → Wallet Address → JWT Token → Supabase RLS
```

### 2. Property Investment
```
Frontend → Wallet Approval → Smart Contract → Transaction Hash → Database Record
```

### 3. Real-time Updates
```
Database Change → Supabase Realtime → Frontend State Update → UI Refresh
```

## Demo vs Production Mode

### Demo Mode (`VITE_DEMO_MODE=true`)
- **Purpose**: Development and testing
- **Property Prices**: Reduced 1000x ($150 vs $150,000)
- **Test Tokens**: Free USDT faucet available
- **Portfolio Reset**: Enabled for testing scenarios
- **Mock Data**: Simulated balances and transactions
- **Network**: Avalanche Fuji Testnet

### Production Mode (`VITE_DEMO_MODE=false`)
- **Purpose**: Live investor platform
- **Property Prices**: Full market values ($150,000+)
- **Real Funds**: Actual USDT and AVAX required
- **Portfolio Reset**: Disabled for data protection
- **Live Data**: Real blockchain interactions
- **Network**: Avalanche Fuji Testnet (moving to Mainnet)

## Security Architecture

### Row Level Security (RLS)
- **Wallet-based Access**: All data filtered by connected wallet address
- **Investment Privacy**: Users can only see their own investments
- **Transaction Isolation**: Payment history separated by wallet
- **Admin Controls**: Service role access for platform operations

### Smart Contract Security
- **Access Controls**: Owner-only functions for critical operations
- **Reentrancy Guards**: Protection against reentrancy attacks
- **Pause Mechanism**: Emergency stop functionality
- **Upgrade Patterns**: Proxy contracts for future updates

### Frontend Security
- **Input Validation**: Zod schemas for all form inputs
- **XSS Protection**: DOMPurify sanitization
- **Rate Limiting**: API request throttling
- **Error Boundaries**: Graceful error handling

## Performance Optimizations

### Frontend Performance
- **Code Splitting**: Lazy loading of routes and components
- **Image Optimization**: WebP format with lazy loading
- **Bundle Size**: Tree shaking and module federation
- **Caching**: Browser caching and service workers

### Database Performance
- **Indexing**: Optimized indexes on frequently queried columns
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Minimized N+1 queries
- **Real-time Efficiency**: Selective subscriptions

### Blockchain Performance
- **Batch Operations**: Multiple transactions in single block
- **Gas Optimization**: Efficient contract design
- **Caching**: Blockchain data caching strategies
- **Fallback RPCs**: Multiple RPC endpoints for reliability

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Vite + React + TypeScript | User interface and interactions |
| Styling | Tailwind CSS + Shadcn/ui | Design system and components |
| Backend | Supabase PostgreSQL | Data persistence and API |
| Functions | Supabase Edge Functions | Server-side logic |
| Blockchain | Avalanche + Solidity | Decentralized mortgage contracts |
| Wallet | MetaMask + Ethers.js | Blockchain connectivity |
| Hosting | Lovable Platform | Frontend deployment |