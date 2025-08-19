# Operational Runbook

## Environment Variables

### Core Configuration
```bash
# Supabase Configuration (Required)
VITE_SUPABASE_PROJECT_ID=moxpmnooovdcffvztbbc
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_URL=https://moxpmnooovdcffvztbbc.supabase.co

# Platform Configuration (Critical for Deployment)
VITE_DEMO_MODE=true              # Set to false for production
VITE_APP_VERSION=1.0.0           # Application version
```

### Blockchain Configuration (Avalanche Fuji Testnet)
```bash
VITE_CHAIN_ID=43113
VITE_CHAIN_ID_HEX=0xa869
VITE_CHAIN_NAME=Avalanche Fuji Testnet
VITE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
VITE_EXPLORER_URL=https://testnet.snowtrace.io
```

### Smart Contract Addresses (Fuji Testnet)
```bash
VITE_MAZUNTE_MORTGAGE_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_USDT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
VITE_VILLAGE_CITIZENSHIP_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
VITE_SECONDARY_MARKETPLACE_ADDRESS=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
VITE_PLATFORM_TREASURY_ADDRESS=0x742d35Cc6670C068fC0DB3674fE6c61c2B3d2a0B
```

## Demo Mode vs Production Mode

### Enable Demo Mode (Development/Testing)
```bash
# In .env file
VITE_DEMO_MODE=true
```

**Demo Mode Features:**
- Property prices reduced 1000x ($150 vs $150,000)
- Free test token faucet available
- Portfolio reset functionality enabled
- Mock wallet balances (2.5 ETH, 1000 USDT)
- Simulated transaction processing

### Enable Production Mode (Live Platform)
```bash
# In production environment
VITE_DEMO_MODE=false
```

**Production Mode Features:**
- Full property prices ($150,000+)
- Real blockchain transactions required
- Portfolio reset disabled (data protection)
- Actual wallet balances queried
- Live transaction processing

## Portfolio Reset (Demo Mode Only)

### How to Reset a Demo Account

#### Automatic Reset (Portfolio Page)
1. Connect wallet in demo mode
2. Navigate to Portfolio page
3. Reset triggers automatically on first visit
4. Check browser console for reset confirmation

#### Manual Reset (Admin Interface)
1. Go to `/admin/projects` page
2. Connect wallet to reset
3. Click "Reset Portfolio" button (only visible in demo mode)
4. Confirm reset operation
5. Review reset summary in toast notification

#### Reset Process Details
The reset operation:
- Archives current portfolio data to `*_archive` tables
- Clears active investments and properties
- Resets platform fee records
- Maintains transaction history for audit
- Updates `tokens_sold` counters for properties

### Reset Troubleshooting
```bash
# Check if reset is allowed
console.log('Demo mode:', import.meta.env.VITE_DEMO_MODE);

# Verify reset function availability
console.log('Should allow reset:', shouldAllowPortfolioReset());

# Reset not working?
# 1. Ensure VITE_DEMO_MODE=true
# 2. Check wallet connection
# 3. Verify Supabase connectivity
# 4. Check browser localStorage for reset flags
```

## Common Errors and Solutions

### 1. Wallet Connection Issues

**Error**: "No Wallet Found" or connection fails
```
Solution:
1. Install MetaMask browser extension
2. Refresh page and try connecting again
3. Check if MetaMask is unlocked
4. Switch to correct network (Avalanche Fuji)
```

**Error**: "Wrong network detected"
```
Solution:
1. Click network switch prompt in app
2. Approve network addition in MetaMask
3. Manually add Avalanche Fuji in MetaMask:
   - Network Name: Avalanche Fuji Testnet
   - RPC URL: https://api.avax-test.network/ext/bc/C/rpc
   - Chain ID: 43113
   - Symbol: AVAX
   - Explorer: https://testnet.snowtrace.io
```

### 2. Transaction Failures

**Error**: "Insufficient funds for gas"
```
Solution:
1. Get AVAX from Fuji faucet: https://faucet.avax.network/
2. Wait for funds to arrive (may take 1-2 minutes)
3. Retry transaction
```

**Error**: "Transaction reverted" or smart contract error
```
Solution:
1. Check if you're in demo mode with test tokens
2. Verify contract addresses in environment
3. Ensure you have sufficient USDT balance
4. Try refreshing page and reconnecting wallet
```

### 3. Data Loading Issues

**Error**: Portfolio shows empty or loading indefinitely
```
Solution:
1. Check browser console for errors
2. Verify wallet is connected
3. Confirm network is correct (Fuji testnet)
4. Try disconnecting and reconnecting wallet
5. Check Supabase service status
```

**Error**: "Row Level Security" policy violation
```
Solution:
1. Ensure wallet is properly connected
2. Check that wallet address matches case-sensitivity
3. Verify RLS policies are correctly configured
4. Try clearing browser cache and reconnecting
```

### 4. Demo Mode Issues

**Error**: Portfolio reset not working
```
Solution:
1. Verify VITE_DEMO_MODE=true in environment
2. Check if shouldAllowPortfolioReset() returns true
3. Connect wallet before attempting reset
4. Check browser console for reset errors
5. Clear localStorage if reset flag is stuck
```

**Error**: Test tokens not working
```
Solution:
1. Ensure demo mode is enabled
2. Click "Get Test Tokens" in wallet menu
3. Wait for mock transaction to complete
4. Check balance updates in wallet display
```

### 5. Build and Deployment Issues

**Error**: Build fails with TypeScript errors
```
Solution:
1. Run npm install to ensure dependencies are current
2. Check for missing environment variables
3. Verify all imports use correct file extensions
4. Check for quote escaping in JSX (use double quotes for strings with apostrophes)
```

**Error**: Environment variables not loaded
```
Solution:
1. Ensure .env file is in project root
2. Verify variables start with VITE_ prefix
3. Restart development server after changes
4. Check for typos in variable names
```

## Monitoring and Health Checks

### Application Health
```bash
# Check if app is responding
curl https://your-domain.lovable.app/

# Verify demo mode setting
console.log('Demo mode:', import.meta.env.VITE_DEMO_MODE);

# Check wallet connectivity
console.log('Wallet connected:', window.ethereum?.isConnected());
```

### Database Health
```sql
-- Check active user connections
SELECT COUNT(*) FROM user_properties WHERE is_active = true;

-- Verify RLS policies are working
SELECT * FROM fractional_investments LIMIT 1;

-- Check recent transactions
SELECT * FROM payment_history ORDER BY created_at DESC LIMIT 10;
```

### Blockchain Health
```bash
# Check network connectivity
curl -X POST https://api.avax-test.network/ext/bc/C/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Verify contract deployment
# Use Snowtrace explorer: https://testnet.snowtrace.io/address/CONTRACT_ADDRESS
```

## Emergency Procedures

### Production Deployment Issues
1. **Immediate**: Switch VITE_DEMO_MODE=true to prevent real transactions
2. **Investigate**: Check error logs and user reports
3. **Fix**: Apply necessary code or configuration changes
4. **Test**: Verify fix in demo mode first
5. **Deploy**: Switch back to VITE_DEMO_MODE=false

### Database Issues
1. **Backup**: Ensure recent backups are available
2. **RLS Check**: Verify Row Level Security policies
3. **Query Analysis**: Check for slow or failing queries
4. **Rollback**: Use point-in-time recovery if needed

### Smart Contract Issues
1. **Pause**: Use emergency pause function if available
2. **Investigation**: Check transaction logs on Snowtrace
3. **Communication**: Notify users of temporary service disruption
4. **Resolution**: Deploy fixes or contract upgrades as needed

## Maintenance Tasks

### Daily
- Monitor error logs for unusual patterns
- Check wallet connection success rates
- Verify transaction processing times

### Weekly
- Review portfolio reset usage (demo mode)
- Analyze investment flow completion rates
- Check database performance metrics

### Monthly
- Update smart contract addresses if needed
- Review and update documentation
- Analyze user feedback and feature requests

## Support and Escalation

### User Support Issues
1. **First**: Check if issue is demo vs production mode related
2. **Verify**: Wallet connection and network settings
3. **Test**: Reproduce issue in demo mode if possible
4. **Document**: Log issue details and resolution steps

### Technical Escalation
- **Supabase Issues**: Check Supabase status page and support
- **Blockchain Issues**: Monitor Avalanche network status
- **Infrastructure**: Contact Lovable platform support
- **Smart Contracts**: Review contract event logs and transactions