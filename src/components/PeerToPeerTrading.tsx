import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare, Handshake, Star, Clock, DollarSign, Shield } from "lucide-react";

interface TradeOffer {
  id: string;
  type: 'buy' | 'sell';
  user: string;
  userRating: number;
  tokenSymbol: string;
  propertyName: string;
  amount: number;
  pricePerToken: number;
  totalValue: number;
  timePosted: string;
  escrowEnabled: boolean;
  verified: boolean;
}

interface TradeRequest {
  id: string;
  fromUser: string;
  toUser: string;
  tokenSymbol: string;
  amount: number;
  offeredPrice: number;
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  timestamp: string;
}

export const PeerToPeerTrading = () => {
  const [selectedOffer, setSelectedOffer] = useState<TradeOffer | null>(null);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [tradeMessage, setTradeMessage] = useState('');

  const tradeOffers: TradeOffer[] = [
    {
      id: 'offer-001',
      type: 'sell',
      user: 'NomadInvestor23',
      userRating: 4.8,
      tokenSymbol: 'BAHIA',
      propertyName: 'Bahia Artist Loft',
      amount: 2.5,
      pricePerToken: 1680,
      totalValue: 4200,
      timePosted: '2 hours ago',
      escrowEnabled: true,
      verified: true
    },
    {
      id: 'offer-002',
      type: 'buy',
      user: 'CryptoTraveler',
      userRating: 4.9,
      tokenSymbol: 'TULUM',
      propertyName: 'Tulum Beach Penthouse',
      amount: 1.0,
      pricePerToken: 1920,
      totalValue: 1920,
      timePosted: '4 hours ago',
      escrowEnabled: true,
      verified: true
    },
    {
      id: 'offer-003',
      type: 'sell',
      user: 'PropertyDAO_Whale',
      userRating: 5.0,
      tokenSymbol: 'SANTORINI',
      propertyName: 'Santorini Caldera View',
      amount: 5.0,
      pricePerToken: 1750,
      totalValue: 8750,
      timePosted: '6 hours ago',
      escrowEnabled: true,
      verified: true
    },
    {
      id: 'offer-004',
      type: 'buy',
      user: 'BohoCollector',
      userRating: 4.6,
      tokenSymbol: 'BAHIA',
      propertyName: 'Bahia Artist Loft',
      amount: 0.8,
      pricePerToken: 1650,
      totalValue: 1320,
      timePosted: '1 day ago',
      escrowEnabled: false,
      verified: false
    }
  ];

  const myRequests: TradeRequest[] = [
    {
      id: 'req-001',
      fromUser: 'You',
      toUser: 'NomadInvestor23',
      tokenSymbol: 'BAHIA',
      amount: 1.5,
      offeredPrice: 1650,
      message: 'Interested in buying for immediate settlement',
      status: 'pending',
      timestamp: '1 hour ago'
    },
    {
      id: 'req-002',
      fromUser: 'PropertyEnthusiast',
      toUser: 'You',
      tokenSymbol: 'TULUM',
      amount: 2.0,
      offeredPrice: 1880,
      message: 'Looking to buy your TULUM tokens. Fair price?',
      status: 'pending',
      timestamp: '3 hours ago'
    }
  ];

  const handleCreateOffer = () => {
    if (!offerAmount || !offerPrice) return;
    console.log('Creating P2P trade offer:', { offerAmount, offerPrice });
    // Integration with smart contract escrow system
  };

  const handleAcceptOffer = (offer: TradeOffer) => {
    console.log('Accepting offer:', offer.id);
    // Integration with smart contract escrow system
  };

  const handleMakeCounterOffer = () => {
    if (!selectedOffer || !offerAmount || !offerPrice) return;
    console.log('Making counter offer to:', selectedOffer.user);
    // Integration with smart contract escrow system
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'accepted': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'declined': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Peer-to-Peer Trading</h2>
        <Badge className="bg-blue-100 text-blue-700">Smart Contract Escrow</Badge>
      </div>

      <Tabs defaultValue="marketplace" className="space-y-6">
        <TabsList>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="my-trades">My Trades</TabsTrigger>
          <TabsTrigger value="create-offer">Create Offer</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trade Offers List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Active Trade Offers</h3>
                <Badge variant="secondary">{tradeOffers.length} offers</Badge>
              </div>

              {tradeOffers.map((offer) => (
                <Card 
                  key={offer.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedOffer?.id === offer.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedOffer(offer)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {offer.tokenSymbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold">{offer.propertyName}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <span>{offer.user}</span>
                            <div className="flex items-center gap-1">
                              {getRatingStars(offer.userRating)}
                              <span className="text-xs">({offer.userRating})</span>
                            </div>
                            {offer.verified && (
                              <Badge className="text-xs bg-green-100 text-green-700">Verified</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={offer.type === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {offer.type.toUpperCase()}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">{offer.timePosted}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Amount</div>
                        <div className="font-semibold">{offer.amount} {offer.tokenSymbol}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Price per Token</div>
                        <div className="font-semibold">${offer.pricePerToken.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Total Value</div>
                        <div className="font-semibold">${offer.totalValue.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {offer.escrowEnabled && (
                        <Badge className="text-xs bg-blue-100 text-blue-700">
                          <Shield className="h-3 w-3 mr-1" />
                          Escrow Protected
                        </Badge>
                      )}
                      <Badge className="text-xs" variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {offer.timePosted}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Trade Actions */}
            <div className="space-y-4">
              {selectedOffer ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Trade with {selectedOffer.user}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm font-medium mb-2">{selectedOffer.propertyName}</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-semibold ml-1">{selectedOffer.amount} {selectedOffer.tokenSymbol}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-semibold ml-1">${selectedOffer.pricePerToken}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => handleAcceptOffer(selectedOffer)}
                    >
                      Accept Offer (${selectedOffer.totalValue.toLocaleString()})
                    </Button>

                    <div className="border-t pt-4">
                      <div className="text-sm font-medium mb-2">Make Counter Offer</div>
                      <div className="space-y-2">
                        <Input 
                          type="number"
                          placeholder="Amount"
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(e.target.value)}
                        />
                        <Input 
                          type="number"
                          placeholder="Price per token"
                          value={offerPrice}
                          onChange={(e) => setOfferPrice(e.target.value)}
                        />
                        <Input 
                          placeholder="Message (optional)"
                          value={tradeMessage}
                          onChange={(e) => setTradeMessage(e.target.value)}
                        />
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={handleMakeCounterOffer}
                        >
                          Send Counter Offer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Handshake className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select an offer to start trading</p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Market Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Offers</span>
                    <span className="font-semibold">{tradeOffers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">24h Volume</span>
                    <span className="font-semibold">$45.2k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Settlement</span>
                    <span className="font-semibold">2.3 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-semibold text-green-600">98.5%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-trades" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Trade Requests</h3>
            <Badge variant="secondary">{myRequests.length} active</Badge>
          </div>

          {myRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {request.tokenSymbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {request.fromUser === 'You' ? 'You → ' : '← '}{request.toUser}
                      </div>
                      <div className="text-sm text-muted-foreground">{request.timestamp}</div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Token</div>
                    <div className="font-semibold">{request.tokenSymbol}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Amount</div>
                    <div className="font-semibold">{request.amount}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Offered Price</div>
                    <div className="font-semibold">${request.offeredPrice.toLocaleString()}</div>
                  </div>
                </div>

                {request.message && (
                  <div className="bg-muted/50 p-2 rounded text-sm mb-3">
                    <MessageSquare className="h-3 w-3 inline mr-1" />
                    "{request.message}"
                  </div>
                )}

                {request.status === 'pending' && request.fromUser !== 'You' && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Accept</Button>
                    <Button size="sm" variant="outline">Decline</Button>
                    <Button size="sm" variant="outline">Counter Offer</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="create-offer">
          <Card>
            <CardHeader>
              <CardTitle>Create Trade Offer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Trade Type</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="sell">Sell Tokens</option>
                    <option value="buy">Buy Tokens</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Token</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="BAHIA">BAHIA - Bahia Artist Loft</option>
                    <option value="TULUM">TULUM - Tulum Beach Penthouse</option>
                    <option value="SANTORINI">SANTORINI - Santorini Caldera View</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <Input 
                    type="number"
                    placeholder="Number of tokens"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Price per Token</label>
                  <Input 
                    type="number"
                    placeholder="Price in USDT"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description (Optional)</label>
                <Input 
                  placeholder="Additional details about your offer"
                  value={tradeMessage}
                  onChange={(e) => setTradeMessage(e.target.value)}
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Smart Contract Escrow</span>
                </div>
                <div className="text-xs text-blue-700">
                  Your tokens will be held in escrow until trade completion. 0.5% escrow fee applies.
                </div>
              </div>

              <Button 
                className="w-full"
                onClick={handleCreateOffer}
                disabled={!offerAmount || !offerPrice}
              >
                Create Trade Offer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};