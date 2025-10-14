#!/bin/bash

echo "🚀 Deploying smart contracts to Avalanche Fuji testnet..."

# Run the deployment script
npx hardhat run scripts/deploy-smart-contracts.js --network fuji

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "📋 Next steps:"
    echo "1. Check the deployment results above"
    echo "2. Update CONTRACT_ADDRESSES in smart-contract-integration.ts"
    echo "3. Test the integration"
else
    echo "❌ Deployment failed!"
    exit 1
fi