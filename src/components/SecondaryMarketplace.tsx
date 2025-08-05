import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, ArrowUpDown, Users, Clock, Zap, MapPin, Filter, AlertTriangle } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PropertyMap from "./PropertyMap";
import FractionalInvestmentModal from "./FractionalInvestmentModal";

interface TokenListing {
  id: string;
  propertyName: string;
  tokenSymbol: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  totalSupply: number;
  marketCap: number;
  apy: number;
}

export const SecondaryMarketplace = () => {
  const { isConnected, connectWallet } = useWallet();
  const { toast } = useToast();
  const [selectedToken, setSelectedToken] = useState<TokenListing | null>(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [isTrading, setIsTrading] = useState(false);
  const [fractionalProperties, setFractionalProperties] = useState<any[]>([]);
  const [selectedFractionalProperty, setSelectedFractionalProperty] = useState<any>(null);
  const [isFractionalModalOpen, setIsFractionalModalOpen] = useState(false);

  // Fetch fractional properties from database
  useEffect(() => {
    fetchFractionalProperties();
  }, []);

  const fetchFractionalProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('property_fractionalization')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setFractionalProperties(data || []);
    } catch (error) {
      console.error('Error fetching fractional properties:', error);
    }
  };

  const tokenListings: TokenListing[] = [
    {
      id: 'BAHIA-001',
      propertyName: 'Bahia Artist Loft',
      tokenSymbol: 'BAHIA',
      price: 1650,
      priceChange24h: 2.3,
      volume24h: 45000,
      liquidity: 1200000,
      totalSupply: 100,
      marketCap: 165000,
      apy: 14.2
    },
    {
      id: 'TULUM-001', 
      propertyName: 'Tulum Beach Penthouse',
      tokenSymbol: 'TULUM',
      price: 1900,
      priceChange24h: -1.2,
      volume24h: 32000,
      liquidity: 950000,
      totalSupply: 100,
      marketCap: 190000,
      apy: 16.8
    },
    {
      id: 'SANTORINI-001',
      propertyName: 'Santorini Caldera View',
      tokenSymbol: 'SANTORINI',
      price: 1780,
      priceChange24h: 4.1,
      volume24h: 28000,
      liquidity: 890000,
      totalSupply: 100,
      marketCap: 178000,
      apy: 15.5
    }
  ];

  const handleTrade = async () => {
    if (!selectedToken || !tradeAmount || !isConnected) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet to trade",
        variant: "destructive"
      });
      return;
    }
    
    setIsTrading(true);
    
    try {
      // Simulate smart contract trade execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const totalCost = parseFloat(tradeAmount) * selectedToken.price;
      const fee = totalCost * 0.003;
      
      toast({
        title: "Trade Executed",
        description: `Successfully ${tradeType === 'buy' ? 'purchased' : 'sold'} ${tradeAmount} ${selectedToken.tokenSymbol} for $${totalCost.toFixed(2)}`,
      });
      
      // Store trade in localStorage for portfolio tracking
      const trades = JSON.parse(localStorage.getItem('userTrades') || '[]');
      const newTrade = {
        id: Date.now(),
        type: tradeType,
        token: selectedToken.tokenSymbol,
        amount: parseFloat(tradeAmount),
        price: selectedToken.price,
        value: totalCost,
        created: new Date().toISOString()
      };
      trades.push(newTrade);
      localStorage.setItem('userTrades', JSON.stringify(trades));
      
      setTradeAmount('');
    } catch (error) {
      toast({
        title: "Trade Failed",
        description: "Unable to execute trade. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTrading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Secondary Marketplace</h2>
        <Badge className="bg-green-100 text-green-700">Live Trading</Badge>
      </div>

      <Tabs defaultValue="market" className="space-y-6">
        <TabsList>
          <TabsTrigger value="discovery">Property Discovery</TabsTrigger>
          <TabsTrigger value="fractional">Fractional Investments</TabsTrigger>
          <TabsTrigger value="market">Token Trading</TabsTrigger>
          <TabsTrigger value="orderbook">Order Book</TabsTrigger>
        </TabsList>

        <TabsContent value="discovery" className="space-y-4">
          <PropertyMap onPropertySelect={(property) => {
            if (property.type === 'fractional') {
              setSelectedFractionalProperty(property);
              setIsFractionalModalOpen(true);
            }
          }} />
        </TabsContent>

        <TabsContent value="fractional" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fractionalProperties.map((property) => (
              <Card key={property.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span className="text-lg">{property.property_name || 'Property'}</span>
                    <Badge variant="secondary">Fractional</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Original Price:</span>
                      <span className="font-semibold">${property.original_purchase_price?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Speculation:</span>
                      <span className="font-semibold text-primary">${property.current_speculation_price?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Min Investment:</span>
                      <span className="font-semibold">${property.min_investment}</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setSelectedFractionalProperty(property);
                        setIsFractionalModalOpen(true);
                      }}
                    >
                      Invest from ${property.min_investment}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Token Listings */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Property Token Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tokenListings.map((token) => (
                      <div 
                        key={token.id}
                        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedToken(token)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {token.tokenSymbol.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-semibold">{token.propertyName}</div>
                              <div className="text-sm text-muted-foreground">{token.tokenSymbol}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold">${token.price.toLocaleString()}</div>
                          <div className={`text-sm ${token.priceChange24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h}%
                          </div>
                        </div>
                        
                        <div className="text-right ml-6">
                          <div className="text-sm text-muted-foreground">24h Volume</div>
                          <div className="font-semibold">${token.volume24h.toLocaleString()}</div>
                        </div>
                        
                        <div className="text-right ml-6">
                          <div className="text-sm text-muted-foreground">APY</div>
                          <div className="font-semibold text-green-600">{token.apy}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Market Stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Market Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Market Cap</div>
                    <div className="text-2xl font-bold">$533k</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">24h Volume</div>
                    <div className="text-xl font-semibold">$105k</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Active Traders</div>
                    <div className="text-xl font-semibold">247</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Avg APY</div>
                    <div className="text-xl font-semibold text-green-600">15.5%</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Liquidity Pools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">BAHIA/USDT</span>
                      <span className="text-sm font-semibold">$1.2M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">TULUM/USDT</span>
                      <span className="text-sm font-semibold">$950k</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">SANTORINI/USDT</span>
                      <span className="text-sm font-semibold">$890k</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trade" className="space-y-6">
          {selectedToken ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trade {selectedToken.tokenSymbol}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      variant={tradeType === 'buy' ? 'default' : 'outline'}
                      onClick={() => setTradeType('buy')}
                      className="flex-1"
                    >
                      Buy
                    </Button>
                    <Button 
                      variant={tradeType === 'sell' ? 'default' : 'outline'}
                      onClick={() => setTradeType('sell')}
                      className="flex-1"
                    >
                      Sell
                    </Button>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Amount (Tokens)</label>
                    <Input 
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Price per token</span>
                      <span className="font-semibold">${selectedToken.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Total cost</span>
                      <span className="font-semibold">
                        ${(parseFloat(tradeAmount || '0') * selectedToken.price).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Trading fee (0.3%)</span>
                      <span className="text-sm">
                        ${((parseFloat(tradeAmount || '0') * selectedToken.price) * 0.003).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={isConnected ? handleTrade : connectWallet}
                    disabled={isTrading || (isConnected && (!tradeAmount || parseFloat(tradeAmount) <= 0))}
                  >
                    {isTrading 
                      ? "Processing..." 
                      : !isConnected 
                        ? "Connect Wallet to Trade"
                        : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedToken.tokenSymbol}`
                    }
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Token Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Property</div>
                    <div className="font-semibold">{selectedToken.propertyName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Market Cap</div>
                    <div className="font-semibold">${selectedToken.marketCap.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Supply</div>
                    <div className="font-semibold">{selectedToken.totalSupply} tokens</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">24h Volume</div>
                    <div className="font-semibold">${selectedToken.volume24h.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Annual Yield</div>
                    <div className="font-semibold text-green-600">{selectedToken.apy}%</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <ArrowUpDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a token from the market to start trading</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orderbook">
          <Card>
            <CardHeader>
              <CardTitle>Order Book</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Order book functionality coming soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Advanced order matching and limit orders
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FractionalInvestmentModal
        isOpen={isFractionalModalOpen}
        onOpenChange={setIsFractionalModalOpen}
        property={selectedFractionalProperty}
      />
    </div>
  );
};