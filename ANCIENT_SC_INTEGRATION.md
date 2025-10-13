# Ancient SC Smart Contracts Integration

This project includes the `ancient-sc` repository as a Git submodule for access to production-ready smart contracts.

## Initial Setup

After cloning this repository, initialize the submodule:

```bash
git submodule update --init --recursive
```

## Submodule Location

The ancient-sc contracts are located at: `/ancient-sc/contracts/`

## Updating the Submodule

To pull the latest changes from ancient-sc:

```bash
git submodule update --remote ancient-sc
git add ancient-sc
git commit -m "Update ancient-sc submodule"
git push
```

## Contract Integration

The contracts from ancient-sc are integrated into the admin dashboard via:
- `src/lib/ancient-sc-integration.ts` - Contract ABIs and address mapping
- `src/pages/AdminDashboard.tsx` - Admin interface for contract management
- `src/components/SmartContractStatus.tsx` - Contract status display

## Deployment Scripts

To deploy ancient-sc contracts:

```bash
npm run deploy:ancient-sc
```

This runs `scripts/deploy-ancient-sc.js` which references contracts from `/ancient-sc/contracts/`

## Database Schema

Contract addresses are stored in the `contract_addresses` table with a `source` field:
- `'legacy'` - Original contracts in `/src/contracts/`
- `'ancient-sc'` - Contracts from the ancient-sc submodule

## Admin Dashboard Access

Access the Ancient SC contracts section at:
- `/admin/projects` > Smart Contracts tab
- View deployment status, addresses, and interact with contracts

## Important Notes

- The submodule does NOT affect demo mode or investor-facing features
- Only admin components reference ancient-sc contracts
- The original `/src/contracts/` folder remains untouched
- All changes are isolated to admin functionality

## Troubleshooting

If the submodule directory is empty:
```bash
git submodule init
git submodule update
```

If you see "fatal: not a git repository" errors:
```bash
rm -rf ancient-sc
git submodule update --init --recursive
```
