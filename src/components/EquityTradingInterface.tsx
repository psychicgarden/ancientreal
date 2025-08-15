import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, ArrowUpDown, Users, DollarSign, PlusCircle, Eye } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserHolding {
  id: string;
  propertyName: string;
  propertyLocation: string;
  sharesOwned: number;
  totalShares: number;
  currentValue: number;
  monthlyIncome: number;
  purchasePrice: number;
  profitLoss: number;
  profitLossPercent: number;
}

interface AvailableTrade {
  id: string;
  propertyName: string;
  propertyLocation: string;
  sharesAvailable: number;
  pricePerShare: number;
  sellerAddress: string;
  monthlyIncomePerShare: number;
  totalValue: number;
}

export const EquityTradingInterface = () => {
  const { isConnected, connectWallet, account } = useWallet();
  const { toast } = useToast();
  const [userHoldings, setUserHoldings] = useState<UserHolding[]>([]);
  const [availableTrades, setAvailableTrades] = useState<AvailableTrade[]>([]);
  const [selectedHolding, setSelectedHolding] = useState<UserHolding | null>(null);
  const [listingPrice, setListingPrice] = useState('');
  const [sharesToList, setSharesToList] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch user's current holdings
  const fetchUserHoldings = async () => {
    if (!account) return;
    
    try {
      const { data, error } = await supabase
        .from('fractional_investments')
        .select(`
          *,
          property_fractionalization(
            property_name,
            property_location,
            current_speculation_price,
            monthly_base_rent,
            total_tokens_available
          )
        `)
        .eq('investor_wallet_address', account.toLowerCase())
        .eq('status', 'active');

      if (error) throw error;

      const holdings: UserHolding[] = data?.map(investment => {
        const property = investment.property_fractionalization;
        const currentSharePrice = property.current_speculation_price / property.total_tokens_available;
        const currentValue = investment.token_amount * currentSharePrice;
        const monthlyIncome = (investment.token_amount / property.total_tokens_available) * property.monthly_base_rent;
        const profitLoss = currentValue - investment.investment_amount;
        const profitLossPercent = (profitLoss / investment.investment_amount) * 100;

        return {
          id: investment.id,
          propertyName: property.property_name,
          propertyLocation: property.property_location,
          sharesOwned: investment.token_amount,
          totalShares: property.total_tokens_available,
          currentValue,
          monthlyIncome,
          purchasePrice: investment.investment_amount,
          profitLoss,
          profitLossPercent
        };
      }) || [];

      setUserHoldings(holdings);
    } catch (error) {
      console.error('Error fetching user holdings:', error);
    }
  };

  // Fetch available trades from other users
  const fetchAvailableTrades = async () => {
    try {
      // First get the orders
      const { data: orders, error: ordersError } = await supabase
        .from('secondary_orders')
        .select('*')
        .eq('status', 'open')
        .eq('order_type', 'sell')
        .neq('owner_wallet_address', account?.toLowerCase() || '');

      if (ordersError) throw ordersError;

      const trades: AvailableTrade[] = [];

      // Then get property details for each order
      for (const order of orders || []) {
        const { data: property, error: propertyError } = await supabase
          .from('property_fractionalization')
          .select('property_name, property_location, monthly_base_rent, total_tokens_available')
          .eq('id', order.property_fractionalization_id)
          .single();

        if (propertyError) continue; // Skip if property not found

        const availableShares = order.token_amount - (order.tokens_filled || 0);
        if (availableShares <= 0) continue; // Skip if no shares available

        const monthlyIncomePerShare = property.monthly_base_rent / property.total_tokens_available;
        
        trades.push({
          id: order.id,
          propertyName: property.property_name,
          propertyLocation: property.property_location,
          sharesAvailable: availableShares,
          pricePerShare: order.price_per_token,
          sellerAddress: order.owner_wallet_address,
          monthlyIncomePerShare,
          totalValue: availableShares * order.price_per_token
        });
      }

      setAvailableTrades(trades);
    } catch (error) {
      console.error('Error fetching available trades:', error);
    }
  };

  useEffect(() => {
    if (account) {
      Promise.all([fetchUserHoldings(), fetchAvailableTrades()]).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [account]);

  const handleListForSale = async () => {
    if (!selectedHolding || !listingPrice || !sharesToList) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const shares = parseInt(sharesToList);
    const price = parseFloat(listingPrice);

    if (shares > selectedHolding.sharesOwned) {
      toast({
        title: "Insufficient Shares",
        description: `You only own ${selectedHolding.sharesOwned} shares`,
        variant: "destructive"
      });
      return;
    }

    try {
      // Get the property fractionalization ID
      const { data: investment } = await supabase
        .from('fractional_investments')
        .select('property_id')
        .eq('id', selectedHolding.id)
        .single();

      // Create sell order
      const { error } = await supabase
        .from('secondary_orders')
        .insert({
          property_fractionalization_id: investment.property_id,
          order_type: 'sell',
          token_amount: shares,
          price_per_token: price,
          owner_wallet_address: account?.toLowerCase(),
          status: 'open'
        });

      if (error) throw error;

      toast({
        title: "Listed Successfully",
        description: `Listed ${shares} shares for $${price} each`,
      });

      setListingPrice('');
      setSharesToList('');
      setSelectedHolding(null);
      await fetchAvailableTrades();
    } catch (error) {
      toast({
        title: "Listing Failed",
        description: "Unable to list shares for sale",
        variant: "destructive"
      });
    }
  };

  const handleBuyShares = async (trade: AvailableTrade) => {
    if (!account) return;

    try {
      const { error } = await supabase.rpc('process_secondary_order_fill', {
        _order_id: trade.id,
        _buyer_wallet_address: account.toLowerCase(),
        _fill_amount: trade.sharesAvailable,
        _price_per_token: trade.pricePerShare
      });

      if (error) throw error;

      toast({
        title: "Purchase Successful",
        description: `Bought ${trade.sharesAvailable} shares of ${trade.propertyName}`,
      });

      await Promise.all([fetchUserHoldings(), fetchAvailableTrades()]);
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Unable to complete purchase",
        variant: "destructive"
      });
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <ArrowUpDown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Connect Wallet to Trade</h3>
          <p className="text-muted-foreground mb-4">
            Connect your wallet to view your holdings and trade with other investors
          </p>
          <Button onClick={connectWallet}>Connect Wallet</Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded-lg"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Trade Your Equity</h3>
        <p className="text-muted-foreground">
          Manage your portfolio and trade shares with other investors
        </p>
      </div>

      <Tabs defaultValue="holdings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="holdings">My Holdings</TabsTrigger>
          <TabsTrigger value="marketplace">Available Trades</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="space-y-4">
          {userHoldings.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  You don't own any property shares yet. Start by buying shares in the "Buy Shares" tab.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Holdings List */}
              <div className="space-y-4">
                {userHoldings.map((holding) => (
                  <Card 
                    key={holding.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedHolding?.id === holding.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedHolding(holding)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{holding.propertyName}</h4>
                          <p className="text-sm text-muted-foreground">{holding.propertyLocation}</p>
                        </div>
                        <Badge 
                          variant={holding.profitLoss >= 0 ? "default" : "destructive"}
                          className={holding.profitLoss >= 0 ? "bg-green-100 text-green-700" : ""}
                        >
                          {holding.profitLoss >= 0 ? '+' : ''}
                          {holding.profitLossPercent.toFixed(1)}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Shares Owned</div>
                          <div className="font-semibold">{holding.sharesOwned.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Current Value</div>
                          <div className="font-semibold">${holding.currentValue.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Monthly Income</div>
                          <div className="font-semibold text-green-600">${holding.monthlyIncome.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Profit/Loss</div>
                          <div className={`font-semibold ${holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${holding.profitLoss.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Listing Panel */}
              <div>
                {selectedHolding ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PlusCircle className="h-5 w-5" />
                        List Shares for Sale
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Shares to List</label>
                        <Input
                          type="number"
                          value={sharesToList}
                          onChange={(e) => setSharesToList(e.target.value)}
                          placeholder={`Max: ${selectedHolding.sharesOwned}`}
                          max={selectedHolding.sharesOwned}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Price per Share</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={listingPrice}
                          onChange={(e) => setListingPrice(e.target.value)}
                          placeholder="Price in USD"
                        />
                      </div>

                      {sharesToList && listingPrice && (
                        <div className="p-3 bg-muted/50 rounded-lg text-sm">
                          <div className="flex justify-between">
                            <span>Total Listing Value:</span>
                            <span className="font-semibold">
                              ${(parseInt(sharesToList) * parseFloat(listingPrice)).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}

                      <Button 
                        onClick={handleListForSale}
                        className="w-full"
                        disabled={!sharesToList || !listingPrice}
                      >
                        List for Sale
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Select a holding to list shares for sale
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          {availableTrades.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <ArrowUpDown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No shares available for purchase at the moment
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {availableTrades.map((trade) => (
                <Card key={trade.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{trade.propertyName}</h4>
                        <p className="text-muted-foreground">{trade.propertyLocation}</p>
                        
                        <div className="grid grid-cols-4 gap-4 mt-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Shares Available</div>
                            <div className="font-semibold">{trade.sharesAvailable.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Price per Share</div>
                            <div className="font-semibold">${trade.pricePerShare.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Monthly Income/Share</div>
                            <div className="font-semibold text-green-600">
                              ${trade.monthlyIncomePerShare.toFixed(4)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Total Value</div>
                            <div className="font-semibold">${trade.totalValue.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                      
                      <Button onClick={() => handleBuyShares(trade)}>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Buy All Shares
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};