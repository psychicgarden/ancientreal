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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import RentalIncomeTracker from "./RentalIncomeTracker";


interface TokenListing {
  id: string; // display id
  propertyName: string;
  tokenSymbol: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  totalSupply: number;
  marketCap: number;
  apy: number;
  // Added fields for real secondary orders
  propertyFractionalizationId: string;
  orderId: string;
  availableAmount: number;
  ownerWalletAddress?: string;
}

export const SecondaryMarketplace = () => {
  const { isConnected, connectWallet, account } = useWallet();
  const { toast } = useToast();
  const [selectedToken, setSelectedToken] = useState<TokenListing | null>(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [isTrading, setIsTrading] = useState(false);
  const [fractionalProperties, setFractionalProperties] = useState<any[]>([]);
  const [selectedFractionalProperty, setSelectedFractionalProperty] = useState<any>(null);
  const [isFractionalModalOpen, setIsFractionalModalOpen] = useState(false);
const [tokenListings, setTokenListings] = useState<TokenListing[]>([]);
const [ownedProperties, setOwnedProperties] = useState<any[]>([]);
const [isListDialogOpen, setIsListDialogOpen] = useState(false);
const [propertyToList, setPropertyToList] = useState<any>(null);
const [speculationPrice, setSpeculationPrice] = useState<string>("");
const [tokensAvailable, setTokensAvailable] = useState<string>("1000000");
const [minInvestment, setMinInvestment] = useState<string>("50");

// Fetch fractional properties and open secondary orders
useEffect(() => {
  fetchFractionalProperties();
  fetchOpenOrders();
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

const fetchOpenOrders = async () => {
  try {
    const { data: orders, error } = await supabase
      .from('secondary_orders')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const listings: TokenListing[] = (orders || []).map((o: any) => {
      const propertyName = `Property ${String(o.property_fractionalization_id).slice(0, 6)}`;
      return {
        id: o.id,
        propertyName,
        tokenSymbol: 'PROP',
        price: Number(o.price_per_token) || 0,
        priceChange24h: 0,
        volume24h: 0,
        liquidity: 0,
        totalSupply: 0,
        marketCap: 0,
        apy: 0,
        propertyFractionalizationId: o.property_fractionalization_id,
        orderId: o.id,
        availableAmount: Math.max(0, Number(o.token_amount) - Number(o.tokens_filled || 0)),
        ownerWalletAddress: o.owner_wallet_address
      } as TokenListing;
    });

    setTokenListings(listings);
  } catch (error) {
    console.error('Error fetching secondary orders:', error);
  }
};

const fetchOwnedProperties = async () => {
  if (!account) return;
  try {
    const { data, error } = await supabase
      .from('user_properties')
      .select('*')
      .eq('user_wallet_address', account.toLowerCase());
    if (error) throw error;
    setOwnedProperties(data || []);
  } catch (error) {
    console.error('Error fetching owned properties:', error);
  }
};

useEffect(() => {
  if (account) fetchOwnedProperties();
}, [account]);

useEffect(() => {
  const channel = supabase
    .channel('secondary-marketplace')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'secondary_trades' }, (payload) => {
      const newTrade: any = (payload as any).new || (payload as any).record || (payload as any);
      const me = (account || '').toLowerCase();
      if (!newTrade) return;
      // Always refresh order book
      fetchOpenOrders();
      if (!me) return;
      const buyer = String(newTrade.buyer_wallet_address || '').toLowerCase();
      const seller = String(newTrade.seller_wallet_address || '').toLowerCase();
      if (buyer === me || seller === me) {
        toast({
          title: 'Trade matched',
          description: `Filled ${Number(newTrade.token_amount).toLocaleString()} tokens at $${Number(newTrade.price_per_token).toLocaleString()}`
        });
      }
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'secondary_orders' }, () => {
      fetchOpenOrders();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [account]);

const handleCreateListing = async () => {
  if (!propertyToList || !account) return;
  const originalPrice = Number(propertyToList.purchase_price || 0);
  const specPrice = Number(speculationPrice || 0);
  if (!specPrice || specPrice <= 0) {
    toast({ title: 'Invalid price', description: 'Enter a valid speculation price', variant: 'destructive' });
    return;
  }
  const tokens = Number(tokensAvailable || 0);
  const minInv = Number(minInvestment || 50);
  const tenYears = new Date();
  tenYears.setFullYear(tenYears.getFullYear() + 10);
  try {
    const { error } = await supabase.from('property_fractionalization').insert({
      property_id: propertyToList.id,
      owner_wallet_address: account.toLowerCase(),
      original_purchase_price: originalPrice,
      current_speculation_price: specPrice,
      total_tokens_available: tokens,
      tokens_sold: 0,
      min_investment: minInv,
      is_active: true,
      year_10_trigger_date: tenYears.toISOString()
    });
    if (error) throw error;
    toast({ title: 'Listing Created', description: `${propertyToList.property_name || 'Property'} listed at $${specPrice.toLocaleString()}` });
    setIsListDialogOpen(false);
    setPropertyToList(null);
    setSpeculationPrice("");
    await fetchFractionalProperties();
    await fetchOpenOrders();
  } catch (error) {
    console.error('Failed to create listing:', error);
    toast({ title: 'Failed to create listing', description: 'Please try again.', variant: 'destructive' });
  }
};

// token listings are loaded from Supabase secondary_orders into state

const handleTrade = async () => {
  if (!selectedToken || !tradeAmount || !isConnected) {
    toast({
      title: "Connection Required",
      description: "Please connect your wallet to trade",
      variant: "destructive"
    });
    return;
  }

  const amount = parseFloat(tradeAmount);
  if (isNaN(amount) || amount <= 0) {
    toast({ title: "Invalid amount", description: "Enter a valid number of tokens", variant: "destructive" });
    return;
  }
  
  setIsTrading(true);
  try {
    if (tradeType === 'buy') {
      if (amount > (selectedToken.availableAmount || 0)) {
        toast({ title: "Not enough available", description: "Order doesn't have that many tokens available", variant: "destructive" });
        setIsTrading(false);
        return;
      }

      const totalCost = amount * selectedToken.price;

      const { data: tradeId, error: rpcErr } = await supabase.rpc('process_secondary_order_fill', {
        _order_id: selectedToken.orderId,
        _buyer_wallet_address: (account || '').toLowerCase(),
        _fill_amount: amount,
        _price_per_token: selectedToken.price,
        _tx_hash: null
      });
      if (rpcErr) throw rpcErr;

      // Refresh listings
      await fetchOpenOrders();

      toast({ title: "Trade Executed", description: `Purchased ${amount} tokens for $${totalCost.toFixed(2)}` });
      setTradeAmount('');
    } else {
      // SELL: create a new sell order for the selected property's token
      if (!selectedToken) {
        toast({ title: "Select a property", description: "Pick a listing or property before placing a sell order", variant: "destructive" });
        return;
      }

      const { error: orderInsertErr } = await supabase.from('secondary_orders').insert({
        property_fractionalization_id: selectedToken.propertyFractionalizationId,
        order_type: 'sell',
        price_per_token: selectedToken.price,
        token_amount: amount,
        owner_wallet_address: (account || 'unknown').toLowerCase(),
        status: 'open'
      });
      if (orderInsertErr) throw orderInsertErr;

      await fetchOpenOrders();
      toast({ title: "Sell order placed", description: `Listed ${amount} tokens at $${selectedToken.price.toLocaleString()} each.` });
      setTradeAmount('');
    }
  } catch (error) {
    console.error(error);
    toast({ title: "Trade Failed", description: "Unable to execute trade. Please try again.", variant: "destructive" });
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
      <p className="text-muted-foreground">Peer-to-peer market to buy and sell fractional shares from other investors. Buy fills open orders; Sell posts your own order.</p>


      <Tabs defaultValue="market" className="space-y-6">
<TabsList>
  <TabsTrigger value="discovery">Property Discovery</TabsTrigger>
  <TabsTrigger value="fractional">Fractional Investments</TabsTrigger>
  <TabsTrigger value="income">Rental Income</TabsTrigger>
  <TabsTrigger value="market">Token Trading</TabsTrigger>
  <TabsTrigger value="trade">Trade</TabsTrigger>
  <TabsTrigger value="orderbook">Order Book</TabsTrigger>
</TabsList>

        <TabsContent value="discovery" className="space-y-4">
          <PropertyMap onPropertySelect={(property) => {
            if (property.type === 'fractional') {
              // Transform property data to match FractionalProperty interface
              const transformedProperty = {
                id: property.id,
                name: property.name || `Property ${property.id.slice(0, 6)}`,
                location: property.location || 'Unknown Location',
                originalPrice: (property as any).originalPrice || 0,
                currentSpeculationPrice: (property as any).speculationPrice || 0,
                minInvestment: (property as any).minInvestment || 50,
                totalTokensAvailable: (property as any).totalTokensAvailable || 1000000,
                tokensSold: (property as any).tokensSold || 0,
                ownerWalletAddress: (property as any).ownerWalletAddress || '',
                year10TriggerDate: (property as any).year10TriggerDate || new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(),
                roi: (property as any).roi || 8.5,
                imageUrl: (property as any).imageUrl
              };
              setSelectedFractionalProperty(transformedProperty);
              setIsFractionalModalOpen(true);
            }
          }} />
        </TabsContent>

        <TabsContent value="fractional" className="space-y-6">
          {isConnected && ownedProperties.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Owned Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ownedProperties.map((p) => (
                    <div key={p.id} className="p-4 border rounded-lg bg-card">
                      <div className="font-semibold">{p.property_name}</div>
                      <div className="text-sm text-muted-foreground">{p.property_location}</div>
                      <div className="mt-2 text-sm">
                        Purchase Price: <span className="font-semibold">${Number(p.purchase_price).toLocaleString()}</span>
                      </div>
                      <div className="mt-3">
                        <Button onClick={() => { setPropertyToList(p); setSpeculationPrice(""); setTokensAvailable("1000000"); setMinInvestment("50"); setIsListDialogOpen(true); }}>
                          List Fractional Offering
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Active Fractional Investments</h3>
              <Badge variant="secondary">{fractionalProperties.length} listings</Badge>
            </div>
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
                          // Transform database property to FractionalProperty interface
                          const transformedProperty = {
                            id: property.id,
                            name: property.property_name || `Property ${property.id.slice(0, 6)}`,
                            location: property.property_location || 'Mazunte, Oaxaca',
                            originalPrice: Number(property.original_purchase_price) || 0,
                            currentSpeculationPrice: Number(property.current_speculation_price) || 0,
                            minInvestment: Number(property.min_investment) || 50,
                            totalTokensAvailable: Number(property.total_tokens_available) || 1000000,
                            tokensSold: Number(property.tokens_sold) || 0,
                            ownerWalletAddress: property.owner_wallet_address || '',
                            year10TriggerDate: property.year_10_trigger_date || new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(),
                            roi: 8.5, // Default ROI based on property value range
                            imageUrl: property.image_url
                          };
                          setSelectedFractionalProperty(transformedProperty);
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
          </div>
        </TabsContent>

        <TabsContent value="income" className="space-y-4">
          <RentalIncomeTracker />
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <div className="space-y-6">
            {/* AMM-style Trading Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5" />
                  Token Swap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From</label>
                    <div className="flex gap-2">
                      <Input 
                        type="number"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        placeholder="0.00"
                        className="flex-1"
                      />
                      <Badge variant="secondary" className="px-3 py-2">USDT</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">To (estimated)</label>
                    <div className="flex gap-2">
                      <Input 
                        type="number"
                        value={selectedToken && tradeAmount ? (parseFloat(tradeAmount) / selectedToken.price).toFixed(4) : ''}
                        readOnly
                        className="flex-1 bg-muted"
                      />
                      <Badge variant="secondary" className="px-3 py-2">
                        {selectedToken ? selectedToken.tokenSymbol : 'PROP'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {selectedToken && tradeAmount && (
                  <div className="bg-muted p-3 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Exchange Rate:</span>
                      <span>1 {selectedToken.tokenSymbol} = ${selectedToken.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Cost:</span>
                      <span>${(parseFloat(tradeAmount) || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Trading Fee (0.3%):</span>
                      <span>${((parseFloat(tradeAmount) || 0) * 0.003).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  onClick={handleTrade}
                  disabled={!selectedToken || !tradeAmount || isTrading}
                >
                  {isTrading ? 'Processing...' : `Swap for ${selectedToken?.tokenSymbol || 'Tokens'}`}
                </Button>
              </CardContent>
            </Card>

            {/* Token Listings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Property Tokens</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tokenListings.map((token) => (
                        <div 
                          key={token.id}
                          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-all ${
                            selectedToken?.id === token.id ? 'ring-2 ring-primary shadow-lg' : ''
                          }`}
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

        <TabsContent value="orderbook" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Placement */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Place Advanced Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Order Type</label>
                    <select 
                      className="w-full p-2 border rounded-md bg-background"
                      value={tradeType}
                      onChange={(e) => setTradeType(e.target.value as 'buy' | 'sell')}
                    >
                      <option value="buy">Market Buy</option>
                      <option value="sell">Market Sell</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Token Amount</label>
                    <Input
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  {selectedToken && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price per Token</label>
                      <Input
                        type="number"
                        value={selectedToken.price}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  )}

                  <div className="bg-muted p-3 rounded-lg space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Estimated Total:</span>
                      <span>
                        ${selectedToken && tradeAmount ? 
                          (parseFloat(tradeAmount) * selectedToken.price).toFixed(2) : 
                          '0.00'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Trading Fee:</span>
                      <span>
                        ${selectedToken && tradeAmount ? 
                          (parseFloat(tradeAmount) * selectedToken.price * 0.003).toFixed(2) : 
                          '0.00'
                        }
                      </span>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handleTrade}
                    disabled={!selectedToken || !tradeAmount || isTrading}
                  >
                    {isTrading ? 'Processing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedToken?.tokenSymbol || 'Tokens'}`}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Market Depth & Order Book */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Market Depth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-green-600 mb-3">Buy Orders</h4>
                      <div className="space-y-2">
                        {tokenListings.slice(0, 5).map((token, idx) => (
                          <div key={`buy-${idx}`} className="flex justify-between text-sm p-2 bg-green-50 rounded">
                            <span className="text-green-700">${token.price.toFixed(2)}</span>
                            <span>{token.availableAmount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-red-600 mb-3">Sell Orders</h4>
                      <div className="space-y-2">
                        {tokenListings.slice(0, 5).map((token, idx) => (
                          <div key={`sell-${idx}`} className="flex justify-between text-sm p-2 bg-red-50 rounded">
                            <span className="text-red-700">${(token.price * 1.02).toFixed(2)}</span>
                            <span>{(token.availableAmount * 0.8).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tokenListings.slice(0, 8).map((token, idx) => (
                      <div key={`trade-${idx}`} className="flex justify-between text-sm p-2 border-b">
                        <span>{token.tokenSymbol}</span>
                        <span>${token.price.toFixed(2)}</span>
                        <span>{(Math.random() * 10).toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">
                          {Math.floor(Math.random() * 60)}m ago
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>List Fractional Offering</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="specPrice">Speculation Price (USD)</Label>
              <Input id="specPrice" type="number" value={speculationPrice} onChange={(e) => setSpeculationPrice(e.target.value)} placeholder={propertyToList ? String(propertyToList.current_value || propertyToList.purchase_price) : "180000"} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tokensAvail">Total Tokens Available</Label>
                <Input id="tokensAvail" type="number" value={tokensAvailable} onChange={(e) => setTokensAvailable(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="minInv">Min Investment (USD)</Label>
                <Input id="minInv" type="number" value={minInvestment} onChange={(e) => setMinInvestment(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsListDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateListing}>Create Listing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FractionalInvestmentModal
        isOpen={isFractionalModalOpen}
        onOpenChange={setIsFractionalModalOpen}
        property={selectedFractionalProperty}
      />
    </div>
  );
};