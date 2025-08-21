import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, Calendar, DollarSign, Home, PiggyBank } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import artDecoLoftMexico from '@/assets/art-deco-loft-mexico.jpg';

interface MortgageProperty {
  id: string;
  property_name: string;
  property_location: string;
  image_url: string;
  purchase_price: number;
  down_payment: number;
  remaining_balance: number;
  monthly_payment: number;
  equity_percentage: number;
  principal_paid_base: number;
  interest_paid_base: number;
  purchase_date: string;
}

interface PaymentHistory {
  id: number;
  principal_delta_base: number;
  interest_delta_base: number;
  created_at: string;
  tx_hash: string;
}

export const SimpleMortgageDashboard = () => {
  const [properties, setProperties] = useState<MortgageProperty[]>([]);
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<string>('');
  const { toast } = useToast();

  // Get connected wallet address
  useEffect(() => {
    const getAccount = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0].toLowerCase());
          }
        } catch (error) {
          console.error('Failed to get account:', error);
        }
      }
    };
    getAccount();
  }, []);

  // Load user properties and payment history
  useEffect(() => {
    if (account) {
      loadUserData();
    }
  }, [account]);

  const loadUserData = async () => {
    if (!account) return;
    
    setIsLoading(true);
    try {
      // Load properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('user_properties')
        .select('*')
        .eq('user_address', account)
        .eq('is_active', true);

      if (propertiesError) throw propertiesError;
      setProperties(propertiesData || []);

      // Load payment history
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('mortgage_payments_ledger')
        .select('*')
        .eq('user_address', account)
        .order('created_at', { ascending: false })
        .limit(10);

      if (paymentsError) throw paymentsError;
      setPayments(paymentsData || []);

    } catch (error) {
      console.error('Failed to load user data:', error);
      toast({
        title: "❌ Loading Failed",
        description: "Could not load your mortgage data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEquityProgress = (property: MortgageProperty) => {
    const totalPaid = (property.principal_paid_base || 0) / 1000000; // Convert from base units
    const loanAmount = property.purchase_price - property.down_payment;
    const progress = Math.min((totalPaid / loanAmount) * 100, 100);
    return progress;
  };

  const getPropertyImage = (property: MortgageProperty) => {
    // Map broken database URLs to correct assets
    if (property.image_url?.includes('boho-art-deco-loft-mexico') || 
        property.property_name?.toLowerCase().includes('art deco')) {
      return artDecoLoftMexico;
    }
    return property.image_url || artDecoLoftMexico; // Fallback
  };

  if (!account) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Connect your wallet to view mortgage dashboard</p>
        </CardContent>
      </Card>
    );
  }

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Home className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
          <p className="text-muted-foreground mb-4">
            Purchase your first property from the Investment Platform tab
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Properties Overview */}
      {properties.map((property) => {
        const equityProgress = calculateEquityProgress(property);
        const totalPaidUSD = ((property.principal_paid_base || 0) + (property.interest_paid_base || 0)) / 1000000;
        
        return (
          <Card key={property.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <OptimizedImage
                    src={getPropertyImage(property)}
                    alt={property.property_name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-primary" />
                      {property.property_name}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">{property.property_location}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-primary/10">
                  Active Investment
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <DollarSign className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <div className="text-sm text-muted-foreground">Purchase Price</div>
                  <div className="font-semibold">${property.purchase_price?.toLocaleString()}</div>
                </div>
                
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <PiggyBank className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <div className="text-sm text-muted-foreground">Down Payment</div>
                  <div className="font-semibold">${property.down_payment?.toLocaleString()}</div>
                </div>
                
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <div className="text-sm text-muted-foreground">Total Paid</div>
                  <div className="font-semibold">${totalPaidUSD.toLocaleString()}</div>
                </div>
                
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Calendar className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <div className="text-sm text-muted-foreground">Monthly Payment</div>
                  <div className="font-semibold">${property.monthly_payment?.toLocaleString()}</div>
                </div>
              </div>

              {/* Equity Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Equity Built</span>
                  <span>{equityProgress.toFixed(1)}%</span>
                </div>
                <Progress value={equityProgress} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>${((property.principal_paid_base || 0) / 1000000).toLocaleString()} paid</span>
                  <span>${(property.remaining_balance || 0).toLocaleString()} remaining</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Recent Payment History */}
      {payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium">
                      ${((payment.principal_delta_base + payment.interest_delta_base) / 1000000).toFixed(2)} Payment
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Principal: ${(payment.principal_delta_base / 1000000).toFixed(2)} • 
                      Interest: ${(payment.interest_delta_base / 1000000).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <Button 
          onClick={loadUserData} 
          disabled={isLoading}
          variant="outline"
        >
          {isLoading ? "Loading..." : "Refresh Data"}
        </Button>
      </div>
    </div>
  );
};