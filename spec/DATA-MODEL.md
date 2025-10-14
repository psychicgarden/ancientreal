# Data Model Overview

## Core Tables and Access Patterns

### Investment and Property Tables

| Table | Purpose | Key Columns | RLS Policy | Notes |
|-------|---------|-------------|------------|-------|
| `user_properties` | Whole property mortgages | `user_wallet_address`, `property_id`, `remaining_balance` | Wallet-based access | Primary mortgage tracking |
| `fractional_investments` | Fractional property ownership | `investor_wallet_address`, `property_id`, `ownership_percentage` | Investor-only access | Tokenized property shares |
| `property_fractionalization` | Property tokenization details | `owner_wallet_address`, `tokens_sold`, `current_speculation_price` | Public read, owner write | Property listing data |
| `developer_investments` | Project funding investments | `user_wallet_address`, `project_id`, `investment_amount` | Investor-only access | Startup/project funding |

### Financial Transaction Tables

| Table | Purpose | Key Columns | RLS Policy | Notes |
|-------|---------|-------------|------------|-------|
| `payment_history` | Mortgage and investment payments | `user_wallet_address`, `payment_amount`, `transaction_hash` | Wallet-based access | All payment records |
| `platform_fees` | Platform fee tracking | `user_wallet_address`, `fee_amount_usd`, `payment_status` | Wallet-based access | 3% platform fees |
| `staking_transactions` | Yield farming transactions | `user_wallet_address`, `amount`, `transaction_type` | Wallet-based access | Stake/unstake records |
| `collateral_loans` | Property-backed loans | `user_wallet_address`, `loan_amount_base`, `status` | Wallet-based access | Equity-based lending |

### Project and Community Tables

| Table | Purpose | Key Columns | RLS Policy | Notes |
|-------|---------|-------------|------------|-------|
| `developer_projects` | Investment project listings | `creator_wallet_address`, `target_funding`, `current_funding` | Public read, creator write | Crowdfunding projects |
| `project_submissions` | New project applications | `creator_wallet_address`, `submission_status` | Creator-only access | Project approval workflow |

## Row Level Security (RLS) Implementation

### Wallet-Based Access Control
All user data is protected by wallet address matching:
```sql
-- Example RLS Policy
CREATE POLICY "Users can view their own investments" 
ON fractional_investments 
FOR SELECT 
USING (investor_wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));
```

### Public vs Private Data
- **Public**: Property listings, project details, appreciation events
- **Private**: User investments, payment history, personal portfolio data
- **Creator-Only**: Project submissions, property fractionalization settings

## Data Relationships

### Primary Investment Flow
```
user_properties (mortgage) ←→ payment_history (payments)
    ↓
platform_fees (3% fee per purchase)
```

### Fractional Investment Flow
```
property_fractionalization (listing) ←→ fractional_investments (purchases)
    ↓
rental_income_distributions ←→ investor_rental_claims (dividends)
```

### Developer Investment Flow
```
developer_projects (listings) ←→ developer_investments (funding)
    ↓
developer_project_updates (progress tracking)
```

## Archive Strategy

### Automatic Archiving
Several tables have corresponding archive tables that store historical data:
- `fractional_investments_archive`
- `platform_fees_archive` 
- `user_properties_archive`
- `secondary_orders_archive`

### Archive Triggers
Data is moved to archive tables when:
- Portfolio reset is performed (demo mode only)
- Records reach certain age thresholds
- Data cleanup operations are executed

## Base Units and Precision

### Financial Precision
- **USD Values**: Stored as `numeric` for exact decimal precision
- **Base Units**: Large integers for blockchain compatibility (e.g., `*_base` columns)
- **Percentages**: Stored as decimals (0.15 = 15%)
- **Token Amounts**: High precision numeric for fractional ownership

### Example Base Unit Conversion
```typescript
// Converting USD to base units (6 decimal places for USDT)
const baseAmount = Math.round(usdAmount * 1000000);

// Converting base units back to USD
const usdAmount = baseAmount / 1000000;
```

## Performance Considerations

### Indexing Strategy
- **Wallet Addresses**: Indexed for fast user data lookup
- **Transaction Hashes**: Indexed for blockchain reconciliation
- **Created/Updated Timestamps**: Indexed for chronological queries
- **Status Fields**: Indexed for filtering active records

### Query Patterns
- **User Portfolio**: Single wallet address filter across multiple tables
- **Property Details**: Join fractionalization with investment data
- **Transaction History**: Chronological order with pagination
- **Analytics**: Aggregations across investment tables

## Data Integrity

### Constraints and Validation
- **Wallet Addresses**: Format validation (0x prefix, 40 hex characters)
- **Positive Amounts**: Check constraints on financial fields
- **Status Enums**: Limited to valid status values
- **Foreign Keys**: Referential integrity where applicable

### Backup and Recovery
- **Platform Backups**: Full platform state stored in `platform_backups`
- **Point-in-Time Recovery**: Supabase automated backups
- **Archive Tables**: Historical data preservation
- **Demo Reset**: Safe portfolio reset without data loss