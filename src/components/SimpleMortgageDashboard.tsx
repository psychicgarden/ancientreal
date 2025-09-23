import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import { ContractDatabaseIntegration } from '@/lib/contract-database-integration';
import { usePaymentSync } from '@/hooks/usePaymentSync';
import { ENHANCED_AVAX_MORTGAGE_ABI, ENHANCED_AVAX_MORTGAGE_CONFIG, convertUSDToAVAX, formatAVAXAmount } from '@/lib/enhanced-avax-mortgage-abi';
import { TrendingUp, Calendar, DollarSign, Home, PiggyBank, RefreshCw, AlertTriangle } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getPropertyImage } from '@/lib/propertyImageMapping';
import { PROPERTIES_CATALOG } from '@/lib/propertiesCatalog';

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
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [account, setAccount] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>('');
  const [mortgageDetails, setMortgageDetails] = useState<any>(null);
  const { toast } = useToast();
  
  // Featured property from catalog for payment context
  const featuredProperty = PROPERTIES_CATALOG[0];
  
  // Initialize payment sync hook
  usePaymentSync(contractAddress, account);

  // Load contract address and get connected wallet address
  useEffect(() => {
    const initialize = async () => {
      // Load Enhanced AVAX Mortgage contract address
      try {
        const address = await ContractDatabaseIntegration.getContractAddress('ENHANCED_AVAX_MORTGAGE');
        setContractAddress(address);
        console.log('✅ Enhanced AVAX Mortgage contract address loaded:', address);
      } catch (error) {
        console.error('❌ Failed to load ENHANCED_AVAX_MORTGAGE contract address:', error);
        toast({
          title: "Contract Loading Failed",
          description: "Could not load Enhanced AVAX Mortgage contract address.",
          variant: "destructive"
        });
      }
      
      // Get connected wallet address
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
    initialize();
  }, []);

  // Load user properties and payment history
  useEffect(() => {
    if (account) {
      loadUserData();
    }
  }, [account]);

  // Real-time subscription to payment updates
  useEffect(() => {
    if (!account) return;

    const channel = supabase
      .channel('payment-updates-dashboard')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mortgage_payments_ledger',
          filter: `user_address=eq.${account.toLowerCase()}`
        },
        (payload) => {
          console.log('🔄 Dashboard: New payment detected, refreshing data:', payload);
          loadUserData();
          toast({
            title: "✅ Payment Updated",
            description: "Your dashboard has been updated with the latest payment!",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
    const totalPrincipalPaid = (property.principal_paid_base || 0) / 1000000; // Convert from base units
    const loanAmount = property.purchase_price - property.down_payment;
    const progress = Math.min((totalPrincipalPaid / loanAmount) * 100, 100);
    return progress;
  };

  // Calculate total payments made (should sum all actual payments, not just principal+interest in property record)
  const calculateTotalPaid = async (userAddress: string, propertyId: number): Promise<number> => {
    try {
      const { data: payments, error } = await supabase
        .from('mortgage_payments_ledger')
        .select('principal_delta_base, interest_delta_base')
        .eq('user_address', userAddress.toLowerCase())
        .eq('property_id', propertyId);

      if (error) {
        console.error('Error fetching total payments:', error);
        return 0;
      }

      const total = payments?.reduce((sum, payment) => 
        sum + (payment.principal_delta_base + payment.interest_delta_base), 0) || 0;
      
      return total / 1000000; // Convert to USD
    } catch (error) {
      console.error('Error calculating total paid:', error);
      return 0;
    }
  };

  // USD to AVAX conversion using enhanced config
  const convertUSDToAVAXLocal = (usdAmount: number): string => {
    return convertUSDToAVAX(usdAmount);
  };

  // Calculate actual months paid by querying database
  const calculateMonthsPaid = async (userAddress: string): Promise<number> => {
    try {
      const { data: payments, error } = await supabase
        .from('mortgage_payments_ledger')
        .select('id')
        .eq('user_address', userAddress.toLowerCase())
        .eq('property_id', 1);

      if (error) {
        console.error('Error fetching payment count:', error);
        return 0;
      }

      return payments?.length || 0;
    } catch (error) {
      console.error('Error calculating months paid:', error);
      return 0;
    }
  };

  // Make mortgage payment using Enhanced AVAX Mortgage contract
  const handleMakePayment = async () => {
    if (!account || !contractAddress || properties.length === 0) return;

    setIsPaymentLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ENHANCED_AVAX_MORTGAGE_ABI, signer);

      // Use the monthly payment from configuration
      const monthlyPaymentUSD = 1252;
      const monthlyPaymentAVAX = "0.00001252";
      const paymentAmount = ethers.parseEther(monthlyPaymentAVAX);

      console.log(`💰 Enhanced Mortgage payment: $${monthlyPaymentUSD} USD → ${monthlyPaymentAVAX} AVAX`);

      toast({
        title: "💰 Processing Payment",
        description: `Submitting $${monthlyPaymentUSD.toFixed(2)} USD payment...`,
      });

      const tx = await contract.makePayment({ value: paymentAmount });
      
      toast({
        title: "⏳ Transaction Pending",
        description: "Processing Enhanced AVAX Mortgage payment...",
      });

      const receipt = await tx.wait();
      
      toast({
        title: "✅ Payment Complete!",
        description: `Enhanced AVAX Mortgage payment processed successfully`,
      });

      // Auto-refresh data after payment
      setTimeout(async () => {
        console.log('🔄 Auto-refreshing dashboard after payment...');
        await loadUserData();
      }, 3000);

    } catch (error: any) {
      console.error('Enhanced AVAX Mortgage payment failed:', error);
      toast({
        title: "❌ Payment Failed", 
        description: error.message || 'Enhanced AVAX Mortgage payment failed',
        variant: "destructive"
      });
    } finally {
      setIsPaymentLoading(false);
    }
  };


  if (!account) {
    return (
      <Card>
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Wallet Connection Required</h3>
              <p className="text-muted-foreground mb-4">
                Connect your wallet to view and manage your mortgage dashboard
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Refresh Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!contractAddress) {
    return (
      <Card>
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Contract Not Available</h3>
              <p className="text-muted-foreground mb-4">
                SIMPLE_MORTGAGE contract address not found. Please ensure contracts are deployed.
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry Loading Contract
              </Button>
            </div>
          </div>
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
        // Show the actual total from the database payments
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

              {/* Payment Action */}
              <div className="pt-4 border-t">
                <div className="text-center mb-3 text-sm text-muted-foreground">
                  Enhanced AVAX Mortgage Payment: $1,252 USD (0.00001252 AVAX)
                </div>
                <Button 
                  onClick={handleMakePayment}
                  disabled={isPaymentLoading}
                  className="w-full"
                  size="lg"
                >
                  {isPaymentLoading 
                    ? "Processing Payment..." 
                    : `Make Monthly Payment ($1,252)`
                  }
                </Button>
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
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? "Loading..." : "Refresh Data"}
        </Button>
      </div>
    </div>
  );
};