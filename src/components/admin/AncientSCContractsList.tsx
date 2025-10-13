import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, GitBranch, CheckCircle, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAncientSCContracts, getAncientSCExplorerUrl } from '@/lib/ancient-sc-integration';

interface AncientSCContract {
  name: string;
  file: string;
  description: string;
  status: 'available' | 'deployed';
  address?: string;
  network?: string;
}

const ANCIENT_SC_CONTRACTS: AncientSCContract[] = [
  {
    name: 'AncientMortgage',
    file: 'AncientMortgage.sol',
    description: 'Core mortgage contract with NFT custody, Year-10 appreciation, and payment processing',
    status: 'available',
  },
  {
    name: 'EnhancedStakingPool',
    file: 'EnhancedStakingPool.sol',
    description: 'ERC4626 staking pool for investor yields from mortgage interest',
    status: 'available',
  },
  {
    name: 'TestUSDT',
    file: 'TestUSDT.sol',
    description: 'Test USDT token with 6 decimals and faucet functionality',
    status: 'available',
  },
  {
    name: 'LendingPoolManager',
    file: 'LendingPoolManager.sol',
    description: 'Manages liquidity pools for mortgage lending',
    status: 'available',
  },
  {
    name: 'YieldFarmingManager',
    file: 'YieldFarmingManager.sol',
    description: 'Yield farming strategies for liquidity providers',
    status: 'available',
  },
];

export const AncientSCContractsList = () => {
  const deployedContracts = getAncientSCContracts();
  
  return (
    <div className="space-y-6">
      {/* Submodule Info */}
      <Card className="p-6 border-accent/20 bg-accent/5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-accent/10">
            <GitBranch className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">Ancient SC Repository</h3>
              <Badge variant="outline" className="text-xs">Git Submodule</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Production-ready smart contracts from the ancient-sc repository
            </p>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Location:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">/ancient-sc/contracts/</code>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Source:</span>
                <a 
                  href="https://github.com/psychicgarden/ancient-sc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs"
                >
                  github.com/psychicgarden/ancient-sc
                </a>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Deployed Contracts List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Deployed Contracts on Fuji Testnet</h3>
        <div className="grid gap-4">
          {deployedContracts.map((contract) => (
            <Card key={contract.name} className="p-4 border-l-4 border-l-green-500">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{contract.name}</h4>
                    <Badge variant="default" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Deployed
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {contract.network}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Address:</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                        {contract.address}
                      </code>
                      <a
                        href={getAncientSCExplorerUrl(contract.address, contract.network)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        Snowtrace <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">ABI Functions:</span>
                      <Badge variant="secondary" className="text-xs">
                        {contract.abi.length} functions
                      </Badge>
                    </div>
                    {contract.deployedAt && (
                      <div className="text-xs text-muted-foreground">
                        Deployed: {contract.deployedAt}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Deployment Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Deployment</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Deploy ancient-sc contracts to Avalanche Fuji testnet
        </p>
        <div className="flex gap-3">
          <Button variant="default">
            Deploy All Contracts
          </Button>
          <Button variant="outline">
            View Deployment Script
          </Button>
        </div>
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Command:</strong> <code className="bg-background px-2 py-1 rounded ml-2">npm run deploy:ancient-sc</code>
          </p>
        </div>
      </Card>

      {/* Setup Instructions */}
      <Card className="p-6 border-primary/20 bg-primary/5">
        <h3 className="text-lg font-semibold mb-3">Setup Instructions</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="font-mono text-primary">1.</span>
            <div>
              <p className="font-medium">Initialize the submodule</p>
              <code className="text-xs bg-background px-2 py-1 rounded mt-1 inline-block">
                git submodule update --init --recursive
              </code>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-mono text-primary">2.</span>
            <div>
              <p className="font-medium">Update to latest contracts</p>
              <code className="text-xs bg-background px-2 py-1 rounded mt-1 inline-block">
                git submodule update --remote ancient-sc
              </code>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-mono text-primary">3.</span>
            <div>
              <p className="font-medium">Deploy contracts</p>
              <code className="text-xs bg-background px-2 py-1 rounded mt-1 inline-block">
                npm run deploy:ancient-sc
              </code>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
