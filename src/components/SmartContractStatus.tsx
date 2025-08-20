import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, ExternalLink, DollarSign, TrendingUp, Shield } from 'lucide-react';
import { CONTRACTS, getExplorerAddressUrl } from '@/config/chain';
import { useFeatureFlag } from '@/lib/feature-flags';

export const SmartContractStatus = () => {
  const mortgageEnabled = useFeatureFlag('mortgageContractEnabled');
  const stakingEnabled = useFeatureFlag('stakingPoolEnabled');
  const addressesVerified = useFeatureFlag('contractAddressesVerified');

  const contracts = [
    {
      name: 'AncientMortgage',
      address: CONTRACTS.MAZUNTE_MORTGAGE,
      description: 'Property NFTs, Monthly Payments, Year-10 Appreciation',
      icon: Shield,
      features: ['Property Purchase', 'NFT Custody', 'Mortgage Payments', 'Appreciation Distribution']
    },
    {
      name: 'TestUSDT',
      address: CONTRACTS.USDT,
      description: 'Test token with faucet (6 decimals)',
      icon: DollarSign,
      features: ['Faucet Function', 'ERC20 Standard', 'USDT Compatible']
    },
    {
      name: 'EnhancedStakingPool',
      address: CONTRACTS.STAKING_POOL,
      description: 'Real investor yields from mortgage interest',
      icon: TrendingUp,
      features: ['Mortgage Interest', 'Investor APY', 'ERC4626 Standard', 'Liquidity Pool']
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle className="w-6 h-6 text-green-500" />
        <div>
          <h2 className="text-xl font-semibold">Smart Contract Deployment Status</h2>
          <p className="text-sm text-muted-foreground">
            Full AncientMortgage business model deployed to Avalanche Fuji Testnet
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {contracts.map((contract) => {
          const Icon = contract.icon;
          return (
            <Card key={contract.name} className="p-4 border-l-4 border-l-primary">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <h3 className="font-medium">{contract.name}</h3>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Deployed
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {contract.description}
              </p>
              
              <div className="space-y-2 mb-4">
                {contract.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-xs">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                  {contract.address.slice(0, 8)}...{contract.address.slice(-6)}
                </code>
                <a
                  href={getExplorerAddressUrl(contract.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  View <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-primary/5 rounded-lg">
        <h3 className="font-medium mb-2">🎯 Business Model Ready</h3>
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span><strong>Investor Story:</strong> Deposit USDT → Earn 7.5-8.5% APY from mortgage interest</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span><strong>Property NFTs:</strong> Buyers get custody tokens, full ownership after 10 years</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span><strong>Appreciation:</strong> 50% buyer, 40% lenders, 10% platform after year-10</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span><strong>Liquidity:</strong> Investors can withdraw anytime, secondary marketplace ready</span>
          </div>
        </div>
      </div>
    </Card>
  );
};