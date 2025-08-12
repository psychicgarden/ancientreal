import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { NETWORK_CONFIG, CONTRACTS } from "@/lib/contracts";
import { supabase } from "@/integrations/supabase/client";
import { MortgagePaymentModal } from "@/components/MortgagePaymentModal";
import { fmtUSD, asUSD, principalBase } from "@/lib/money";
import { 
  Building2, 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  ExternalLink,
  Clock,
  Target,
  Banknote
} from "lucide-react";

export const InvestorMortgageDashboard = ({ onNavigateToProperties }: { onNavigateToProperties?: (args?: { propertyId?: string; name?: string; location?: string }) => void }) => {
  const { 
    isConnected, 
    account, 
    makePayment,
    isPurchasingProperty 
  } = useWallet();
  
  const { toast } = useToast();
  const [mortgageData, setMortgageData] = useState<any>(null);
  const [propertyData, setPropertyData] = useState<any>(null);
  const [userProperty, setUserProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    const fetchMortgageData = async () => {
      if (!isConnected || !account) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching mortgage details for account:', account);
        
        // Fetch data from Supabase instead of smart contracts
        const { data: properties, error: propertiesError } = await supabase
          .from('user_properties')
          .select('*')
          .eq('user_address', account?.toLowerCase() ?? '')
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (propertiesError) {
          throw propertiesError;
        }

        if (properties && properties.length > 0) {
          const property = properties[0]; // Use first active property
          setUserProperty(property);
          
          // Transform data to match expected format with base unit support
          const principalAmt = principalBase(property) ?? (property.purchase_price - property.down_payment);
          const remainingBal = (property as any).remaining_balance_base ? Number((property as any).remaining_balance_base) / 1_000_000 : property.remaining_balance;
          
          const mortgageDetails = {
            isActive: remainingBal > 0,
            principalAmount: principalAmt,
            remainingBalance: remainingBal,
            monthlyPayment: property.monthly_payment,
            nextPaymentDue: Date.now() + 30 * 24 * 60 * 60 * 1000, // Next month
            isOverdue: false, // Could be calculated based on last payment
            daysPastDue: 0,
            missedPayments: 0,
            startDate: Math.floor(new Date(property.purchase_date).getTime() / 1000),
            downPayment: (property as any).down_payment_base ? Number((property as any).down_payment_base) / 1_000_000 : property.down_payment,
            isCompleted: remainingBal <= 0,
            isForeclosed: false
          };

          const propertyDetails = {
            propertyValue: property.current_value,
            equity: property.current_value * (property.equity_percentage / 100),
            monthlyRental: 2500, // Sample data
            occupancyRate: 95
          };

          setMortgageData(mortgageDetails);
          setPropertyData(propertyDetails);
        } else {
          // No properties found
          setMortgageData({ isActive: false });
          setPropertyData(null);
          setUserProperty(null);
        }
      } catch (error) {
        console.error('Error fetching mortgage data:', error);
        toast({
          title: "Data Loading Error",
          description: "Failed to load mortgage data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMortgageData();
  }, [isConnected, account, toast]);

  const handleMakePayment = () => {
    setPaymentModalOpen(true);
  };

  const handleViewOnExplorer = () => {
    const explorerUrl = NETWORK_CONFIG.blockExplorerUrls[0];
    const targetUrl = `${explorerUrl}address/${account}`;
    window.open(targetUrl, '_blank');
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>Connect your wallet to view your mortgage details</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Mortgage Data...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!mortgageData || !mortgageData.isActive) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Mortgage</CardTitle>
          <CardDescription>You don't have an active mortgage. Consider purchasing a property!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const daysUntilPayment = mortgageData.nextPaymentDue 
    ? Math.ceil((mortgageData.nextPaymentDue - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const isPaymentOverdue = daysUntilPayment < 0;
  const isPaymentSoon = daysUntilPayment <= 7 && daysUntilPayment > 0;
  
  const paymentProgress = ((4 - mortgageData.missedPayments) / 4) * 100;
  const mortgageProgress = ((mortgageData.principalAmount - mortgageData.remainingBalance) / mortgageData.principalAmount) * 100;

  return (
    <div className="space-y-6">
      {/* Mortgage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {userProperty?.property_name || 'Active Mortgage'}
            </span>
            <div className="flex gap-2">
              {mortgageData.isForeclosed && (
                <Badge variant="destructive">Foreclosed</Badge>
              )}
              {mortgageData.isCompleted && (
                <Badge variant="default" className="bg-green-500">Completed</Badge>
              )}
              {mortgageData.isActive && !mortgageData.isForeclosed && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600">Active</Badge>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            Smart Contract Address: {account?.slice(0, 20)}...
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Payment Status Alert */}
      {(isPaymentOverdue || isPaymentSoon || mortgageData.missedPayments > 0) && (
        <Card className={`border-l-4 ${
          isPaymentOverdue || mortgageData.missedPayments >= 3 ? 'border-l-red-500 bg-red-50 dark:bg-red-950/10' :
          isPaymentSoon ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/10' :
          'border-l-orange-500 bg-orange-50 dark:bg-orange-950/10'
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${
                isPaymentOverdue || mortgageData.missedPayments >= 3 ? 'text-red-500' :
                isPaymentSoon ? 'text-yellow-500' : 'text-orange-500'
              }`} />
              Payment Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPaymentOverdue && (
              <p className="text-red-700 dark:text-red-400">
                ⚠️ Payment is overdue! Make a payment immediately to avoid foreclosure.
              </p>
            )}
            {isPaymentSoon && !isPaymentOverdue && (
              <p className="text-yellow-700 dark:text-yellow-400">
                💡 Payment due in {daysUntilPayment} days. Consider making your payment soon.
              </p>
            )}
            {mortgageData.missedPayments > 0 && (
              <p className="text-orange-700 dark:text-orange-400 mt-2">
                You have {mortgageData.missedPayments} missed payment(s). 
                {mortgageData.missedPayments >= 3 && " ⚠️ FORECLOSURE WARNING: 1 more missed payment will trigger foreclosure!"}
              </p>
            )}
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Foreclosure Risk</span>
                <span>{4 - mortgageData.missedPayments}/4 payments remaining</span>
              </div>
              <Progress 
                value={paymentProgress} 
                className={`h-2 ${
                  mortgageData.missedPayments >= 3 ? '[&>div]:bg-red-500' :
                  mortgageData.missedPayments >= 2 ? '[&>div]:bg-orange-500' :
                  '[&>div]:bg-green-500'
                }`}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {asUSD((userProperty as any)?.remaining_balance_base, mortgageData.remainingBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              of {principalBase(userProperty) != null 
                ? fmtUSD(principalBase(userProperty)!) 
                : `$${mortgageData.principalAmount?.toLocaleString() || '0'}`} principal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payment</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${mortgageData.monthlyPayment?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              8% APR, 10 year term
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              isPaymentOverdue ? 'text-red-600' : 
              isPaymentSoon ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {isPaymentOverdue ? 'OVERDUE' : `${daysUntilPayment} days`}
            </div>
            <p className="text-xs text-muted-foreground">
              {mortgageData.nextPaymentDue ? 
                new Date(mortgageData.nextPaymentDue).toLocaleDateString() : 
                'Not scheduled'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equity Built</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${((mortgageData.principalAmount - mortgageData.remainingBalance) + mortgageData.downPayment).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Down payment + principal paid
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mortgage Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Mortgage Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Principal Paid Down</span>
              <span>{mortgageProgress.toFixed(1)}% complete</span>
            </div>
            <Progress value={mortgageProgress} className="h-3" />
            <p className="text-xs text-muted-foreground mt-1">
              ${(mortgageData.principalAmount - mortgageData.remainingBalance).toLocaleString()} of ${mortgageData.principalAmount?.toLocaleString()} paid
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Start Date:</span>
              <div className="font-medium">
                {mortgageData.startDate ? 
                  new Date(mortgageData.startDate * 1000).toLocaleDateString() : 
                  'Not available'
                }
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Maturity Date:</span>
              <div className="font-medium">
                {mortgageData.startDate ? 
                  new Date((mortgageData.startDate + (10 * 365 * 24 * 60 * 60)) * 1000).toLocaleDateString() : 
                  'Not available'
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Appreciation */}
      {userProperty && (() => {
        const originalValue = userProperty.purchase_price || 0;
        const appreciationRate = 0.08; // 8% annual appreciation
        const years = 10;
        const projectedValue = originalValue * Math.pow(1 + appreciationRate, years);
        const totalAppreciation = projectedValue - originalValue;
        
        // Your appreciation split percentages
        const yourShare = totalAppreciation * 0.5;
        const ancientShare = totalAppreciation * 0.4;
        const lenderShare = totalAppreciation * 0.1;
        
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Property Appreciation (10-Year Projection @ 8% APY)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">
                    ${originalValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Original Value</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-xl font-bold text-green-600">
                    ${Math.round(projectedValue).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Projected Value ({Math.round((projectedValue / originalValue - 1) * 100)}% growth)</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">
                    ${Math.round(totalAppreciation).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Appreciation</div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <strong>Your Appreciation Split (50% of gains):</strong>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="font-semibold">
                      ${Math.round(yourShare).toLocaleString()}
                    </div>
                    <div className="text-xs">Your Share (50%)</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="font-semibold">
                      ${Math.round(ancientShare).toLocaleString()}
                    </div>
                    <div className="text-xs">Ancient (40%)</div>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <div className="font-semibold">
                      ${Math.round(lenderShare).toLocaleString()}
                    </div>
                    <div className="text-xs">Lenders (10%)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          onClick={handleMakePayment}
          disabled={isPurchasingProperty || mortgageData.isCompleted || mortgageData.isForeclosed}
          size="lg"
          className="w-full"
        >
          {isPurchasingProperty ? "Processing Payment..." : "Make Monthly Payment"}
        </Button>
        
        {userProperty && (
          <MortgagePaymentModal 
            isOpen={paymentModalOpen}
            onClose={() => setPaymentModalOpen(false)}
            property={{
              id: userProperty.id,
              title: userProperty.property_name,
              location: userProperty.property_location,
              image: userProperty.image_url || "/src/assets/villa-bali.jpg",
              value: userProperty.current_value,
              monthlyPayment: userProperty.monthly_payment,
              remainingBalance: userProperty.remaining_balance
            }}
            onSuccess={() => onNavigateToProperties?.({
              propertyId: userProperty.id,
              name: userProperty.property_name,
              location: userProperty.property_location,
            })}
          />
        )}
        
        <Button 
          variant="secondary" 
          size="lg" 
          className="w-full"
          onClick={() => onNavigateToProperties?.({
            propertyId: userProperty?.id,
            name: userProperty?.property_name,
            location: userProperty?.property_location,
          })}
        >
          View in My Properties
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full"
          onClick={handleViewOnExplorer}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Blockchain Explorer
        </Button>
      </div>
    </div>
  );
};