import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TrendingUp, MapPin, Users, DollarSign, Calculator, ArrowUpDown } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { useSecondaryOrders, SecondaryOrder } from "@/hooks/useSecondaryOrders";
import { supabase } from "@/integrations/supabase/client";

export const PropertySharesInterface = () => {
  const { isConnected, connectWallet, account } = useWallet();
  const { toast } = useToast();
  const { orders, loading } = useSecondaryOrders();
  const [selectedOrder, setSelectedOrder] = useState<SecondaryOrder | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState('');

  const calculateTokens = (amount: number, pricePerToken: number) => {
    return Math.floor(amount / pricePerToken);
  };

  const calculateMonthlyIncome = (tokens: number, monthlyRent: number, totalTokens: number) => {
    return (tokens / totalTokens) * monthlyRent;
  };

  const calculatePricePremium = (currentPrice: number, originalPrice: number) => {
    return ((currentPrice - originalPrice) / originalPrice) * 100;
  };

  const handlePurchase = async () => {
    if (!selectedOrder || !purchaseAmount || !account) {
      toast({
        title: "Missing Information",
        description: "Please select an order and enter a purchase amount",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(purchaseAmount);
    const tokens = calculateTokens(amount, selectedOrder.price_per_token);
    const availableTokens = selectedOrder.token_amount - selectedOrder.tokens_filled;
    
    if (tokens === 0) {
      toast({
        title: "Purchase Too Small",
        description: `Minimum purchase: $${selectedOrder.price_per_token.toFixed(2)}`,
        variant: "destructive"
      });
      return;
    }

    if (tokens > availableTokens) {
      toast({
        title: "Insufficient Tokens",
        description: `Only ${availableTokens} tokens available`,
        variant: "destructive"
      });
      return;
    }

    try {
      // Execute the trade via the RPC function
      const { data, error } = await supabase.rpc('process_secondary_order_fill', {
        _order_id: selectedOrder.id,
        _buyer_wallet_address: account,
        _fill_amount: tokens,
        _price_per_token: selectedOrder.price_per_token,
        _tx_hash: `demo_${Date.now()}` // In production, this would be the actual transaction hash
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Purchase Successful!",
        description: `Purchased ${tokens} tokens from ${selectedOrder.property_name}`,
      });
      
      setPurchaseAmount('');
      setSelectedOrder(null);
      
      // Refresh orders after successful purchase
      // This would typically be handled by real-time subscriptions
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "An error occurred during purchase",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-48 bg-muted rounded-lg"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Secondary Marketplace</h3>
        <p className="text-muted-foreground">
          Buy fractional shares from existing investors. Properties may be priced above or below original value.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ArrowUpDown className="h-4 w-4" />
          Peer-to-peer trading with price discovery
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Secondary Orders List */}
        <div className="lg:col-span-2 space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No shares available for purchase in the secondary market</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Check back later as investors list their shares for sale
                </p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => {
              const availableTokens = order.token_amount - order.tokens_filled;
              const totalValue = availableTokens * order.price_per_token;
              const premium = order.original_purchase_price 
                ? calculatePricePremium(order.price_per_token, order.original_purchase_price / (order.total_tokens_available || 1))
                : 0;
              
              return (
                <Card 
                  key={order.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedOrder?.id === order.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img 
                        src={order.property_image_url || '/placeholder.svg'} 
                        alt={order.property_name || 'Property'}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{order.property_name}</h4>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {order.property_location}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Seller: {order.owner_wallet_address.slice(0, 6)}...{order.owner_wallet_address.slice(-4)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xl font-bold ${premium >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {premium >= 0 ? '+' : ''}{premium.toFixed(1)}%
                            </div>
                            <div className="text-xs text-muted-foreground">vs Original</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Price/Token</div>
                            <div className="font-semibold">${order.price_per_token.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Available Tokens</div>
                            <div className="font-semibold">{availableTokens.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Total Value</div>
                            <div className="font-semibold">${totalValue.toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            <DollarSign className="h-3 w-3 mr-1" />
                            Secondary Market
                          </Badge>
                          {premium >= 0 ? (
                            <Badge variant="destructive">
                              Premium Pricing
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-700">
                              Discounted
                            </Badge>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Listed {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Purchase Panel */}
        <div className="space-y-4">
          {selectedOrder ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Purchase Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property:</span>
                      <span className="font-medium">{selectedOrder.property_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price per Token:</span>
                      <span className="font-medium">${selectedOrder.price_per_token.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available:</span>
                      <span className="font-medium">{(selectedOrder.token_amount - selectedOrder.tokens_filled).toLocaleString()} tokens</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Purchase Amount (USD)</label>
                  <Input
                    type="number"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    placeholder="Enter amount in USD"
                    className="mt-1"
                  />
                </div>

                {purchaseAmount && parseFloat(purchaseAmount) > 0 && (
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium">Purchase Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tokens Purchased:</span>
                        <span className="font-semibold">
                          {calculateTokens(parseFloat(purchaseAmount), selectedOrder.price_per_token)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Income:</span>
                        <span className="font-semibold text-green-600">
                          ${calculateMonthlyIncome(
                            calculateTokens(parseFloat(purchaseAmount), selectedOrder.price_per_token),
                            selectedOrder.monthly_base_rent || 0,
                            selectedOrder.total_tokens_available || 1
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Cost:</span>
                        <span className="font-semibold">
                          ${parseFloat(purchaseAmount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {isConnected ? (
                  <Button 
                    onClick={handlePurchase}
                    className="w-full"
                    disabled={!purchaseAmount || parseFloat(purchaseAmount) <= 0}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Purchase Tokens
                  </Button>
                ) : (
                  <Button onClick={connectWallet} className="w-full">
                    Connect Wallet to Trade
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Select an order to see purchase details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};