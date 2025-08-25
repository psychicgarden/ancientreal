import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, DollarSign, TrendingUp, Users, Shield, Coins } from 'lucide-react';

export const BusinessModelSummary = () => {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <CheckCircle className="w-6 h-6" />
          🎉 AncientMortgage Business Model Activated
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Platform upgraded from basic AVAX mortgage to full revenue-generating business model
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Before vs After */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-red-600 mb-3">❌ Before (SimpleAvaxMortgage)</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Basic AVAX payments</li>
              <li>• No platform fees collected</li>
              <li>• No investor yields generated</li>
              <li>• No property ownership NFTs</li>
              <li>• Broken amortization formula</li>
              <li>• No appreciation sharing</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-green-600 mb-3">✅ After (AncientMortgage)</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• USDT payments with proper decimals</li>
              <li>• 3% platform fee = $3,870 per property</li>
              <li>• Live mortgage interest → staking pool</li>
              <li>• ERC721 property NFTs held until paid</li>
              <li>• Proper compound interest formula</li>
              <li>• Year-10 appreciation (50/40/10 split)</li>
            </ul>
          </div>
        </div>

        {/* Active Revenue Streams */}
        <div>
          <h4 className="font-semibold mb-3">💰 Active Revenue Streams</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Platform Fees</span>
              </div>
              <div className="text-lg font-bold text-green-600">$3,870</div>
              <div className="text-xs text-muted-foreground">Per $129K property (3%)</div>
            </div>
            
            <div className="bg-background p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Staking Yields</span>
              </div>
              <div className="text-lg font-bold text-blue-600">8% APY</div>
              <div className="text-xs text-muted-foreground">From mortgage interest</div>
            </div>
            
            <div className="bg-background p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Appreciation</span>
              </div>
              <div className="text-lg font-bold text-purple-600">40%</div>
              <div className="text-xs text-muted-foreground">Year-10 platform share</div>
            </div>
          </div>
        </div>

        {/* Smart Contract Addresses */}
        <div>
          <h4 className="font-semibold mb-3">📋 Active Contracts</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-background rounded border">
              <span>AncientMortgage</span>
              <Badge variant="outline" className="font-mono text-xs">0x0b92...6bed</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-background rounded border">
              <span>EnhancedStakingPool</span>
              <Badge variant="outline" className="font-mono text-xs">0x474e...af27</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-background rounded border">
              <span>TestUSDT</span>
              <Badge variant="outline" className="font-mono text-xs">0xc298...dd36</Badge>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-background p-4 rounded-lg border">
          <h4 className="font-semibold mb-2">🚀 Ready to Test</h4>
          <ol className="text-sm text-muted-foreground space-y-1">
            <li>1. Connect wallet and get test USDT from faucet</li>
            <li>2. Approve USDT spending for the mortgage contract</li>
            <li>3. Purchase property to test full business model</li>
            <li>4. Check database for fee collection and staking integration</li>
            <li>5. Test mortgage payments and yield distribution</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};