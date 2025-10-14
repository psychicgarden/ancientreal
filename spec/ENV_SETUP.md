# Environment Configuration Guide

## Environment Variables Overview

### Core Configuration
- `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anonymous key (safe for frontend)
- `VITE_SUPABASE_URL` - Your Supabase project URL

### Demo Mode Control (Critical for Deployment)
- `VITE_DEMO_MODE` - Controls demo features and portfolio reset functionality

## Environment Setup by Deployment Type

### Preview Environment (Lovable Preview)
```env
VITE_DEMO_MODE=true
```
**Features enabled:**
- Portfolio reset functionality
- Test token faucet
- Reduced property prices (1000x smaller for testing)
- Demo wallet integration

### Production Environment (ancient.lovable.dev)
```env
VITE_DEMO_MODE=false
```
**Features disabled:**
- No portfolio reset (prevents accidental data loss)
- No test tokens
- Full property prices
- Production wallet validation

### Blockchain Configuration (Avalanche Fuji Testnet)
- `VITE_CHAIN_ID=43113`
- `VITE_CHAIN_ID_HEX=0xa869`
- `VITE_CHAIN_NAME=Avalanche Fuji Testnet`
- `VITE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc`
- `VITE_EXPLORER_URL=https://testnet.snowtrace.io`

### Smart Contract Addresses (Fuji Testnet)
- `VITE_MAZUNTE_MORTGAGE_ADDRESS` - Main mortgage contract
- `VITE_USDT_ADDRESS` - Test USDT token contract
- `VITE_VILLAGE_CITIZENSHIP_ADDRESS` - Community membership contract
- `VITE_SECONDARY_MARKETPLACE_ADDRESS` - Trading marketplace contract
- `VITE_PLATFORM_TREASURY_ADDRESS` - Platform fee collection address

## Critical Deployment Checklist

### Before Production Deployment:
1. ✅ Set `VITE_DEMO_MODE=false` in production environment
2. ✅ Verify all contract addresses are correct
3. ✅ Test wallet connection with production settings
4. ✅ Confirm no demo-only features are accessible

### Preview/Development:
1. ✅ Keep `VITE_DEMO_MODE=true` for testing
2. ✅ Ensure demo features work correctly
3. ✅ Test portfolio reset functionality

## Environment Variable Validation

The application will log warnings for missing required variables. Check browser console on startup for any configuration issues.

## Security Notes

- All `VITE_*` variables are public and included in the frontend bundle
- Never include private keys or secrets in environment variables
- Supabase publishable key is safe for frontend use
- Use Supabase's built-in security features for backend secrets