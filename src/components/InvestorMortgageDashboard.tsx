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
import { fmtUSD, asUSD, principalBase, fromBase } from "@/lib/money";
import { PROPERTIES_CATALOG } from "@/lib/propertiesCatalog";
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
  Banknote,
  Home,
  CreditCard,
  PiggyBank,
  CheckCircle2,
  Star,
  MapPin
} from "lucide-react";
import { computeMonthlyPaymentUSD, computeNextDueDate } from "@/lib/finance";

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
        
        // Fetch data from Supabase - Clean up duplicates and get unique properties
        const acct = account?.toLowerCase() ?? "";
        const { data: properties, error: propertiesError } = await supabase
          .rpc('get_user_portfolio', { wallet: acct });

        // Remove duplicates by property_name
        const uniqueProperties = properties?.reduce((acc: any[], current: any) => {
          const existingProperty = acc.find(p => p.property_name === current.property_name);
          if (!existingProperty) {
            acc.push(current);
          }
          return acc;
        }, []) || [];

        if (propertiesError) {
          throw propertiesError;
        }

        if (uniqueProperties && uniqueProperties.length > 0) {
          const property = uniqueProperties[0]; // Use first unique property
          setUserProperty(property);
          
          // Transform data with correct base-unit conversions
          const principalAmtUsd = principalBase(property) != null
            ? fromBase(principalBase(property)!)
            : Math.max(0, Number(property.purchase_price || 0) - Number(property.down_payment || 0));

          const remainingBalUsd = (property as any).remaining_balance_base != null
            ? fromBase((property as any).remaining_balance_base)
            : Number(property.remaining_balance || 0);

          const loanUsd = (property as any).loan_amount_base != null
            ? fromBase((property as any).loan_amount_base)
            : principalAmtUsd;
          const aprBps = Number((property as any).apr_bps ?? 800);
          const termMonths = Number((property as any).term_months ?? 120);
          const monthlyPaymentUsd = Number(property.monthly_payment || 0) > 0
            ? Number(property.monthly_payment)
            : computeMonthlyPaymentUSD(loanUsd, aprBps, termMonths);

          const due = computeNextDueDate(property.purchase_date);

          const mortgageDetails = {
            isActive: remainingBalUsd > 0,
            principalAmount: principalAmtUsd,
            remainingBalance: remainingBalUsd,
            monthlyPayment: monthlyPaymentUsd,
            nextPaymentDue: due.getTime(),
            isOverdue: false,
            daysPastDue: 0,
            missedPayments: 0,
            startDate: Math.floor(new Date(property.purchase_date).getTime() / 1000),
            downPayment: (property as any).down_payment_base ? fromBase((property as any).down_payment_base) : Number(property.down_payment || 0),
            isCompleted: remainingBalUsd <= 0,
            isForeclosed: false,
            aprBps,
            termMonths,
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

  // Get property details from catalog for better visuals
  const getPropertyDetails = (propertyName: string) => {
    const matchingProperty = PROPERTIES_CATALOG.find(p => 
      p.name.toLowerCase().includes(propertyName.toLowerCase().split(' ')[0]) ||
      propertyName.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
    );
    return matchingProperty ? {
      name: matchingProperty.name,
      location: matchingProperty.location,
      image: matchingProperty.image,
      rating: 4.8
    } : {
      name: propertyName,
      location: userProperty?.property_location || 'Unknown Location',
      image: '/placeholder.svg',
      rating: 4.8
    };
  };

  const propertyDetails = getPropertyDetails(userProperty?.property_name || '');

  return (
    <div className="space-y-6">
      {/* Hero Section with Property Visual */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-background via-muted/30 to-primary/5 border">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Property Image */}
            <div className="relative">
              <div className="w-48 h-32 rounded-lg overflow-hidden border shadow-lg">
                <img 
                  src={propertyDetails.image} 
                  alt={propertyDetails.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-primary/90 hover:bg-primary">
                  <Home className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
            
            {/* Property Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {propertyDetails.name}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{propertyDetails.location}</span>
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{propertyDetails.rating}</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-background/60 border">
                  <div className="text-2xl font-bold text-primary">
                    {mortgageProgress.toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Paid Off</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-background/60 border">
                  <div className="text-2xl font-bold text-green-600">
                    ${((mortgageData.principalAmount - mortgageData.remainingBalance) + mortgageData.downPayment).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Equity</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-background/60 border">
                  <div className={`text-2xl font-bold ${
                    isPaymentOverdue ? 'text-destructive' : 
                    isPaymentSoon ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {isPaymentOverdue ? 'OVERDUE' : `${daysUntilPayment}d`}
                  </div>
                  <div className="text-xs text-muted-foreground">Next Payment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Alert */}
      {(isPaymentOverdue || isPaymentSoon || mortgageData.missedPayments > 0) && (
        <Card className={`relative overflow-hidden ${
          isPaymentOverdue || mortgageData.missedPayments >= 3 ? 'border-destructive bg-destructive/5' :
          isPaymentSoon ? 'border-yellow-500 bg-yellow-500/5' :
          'border-orange-500 bg-orange-500/5'
        }`}>
          <div className={`absolute inset-y-0 left-0 w-1 ${
            isPaymentOverdue || mortgageData.missedPayments >= 3 ? 'bg-destructive' :
            isPaymentSoon ? 'bg-yellow-500' : 'bg-orange-500'
          }`} />
          <CardHeader className="pl-8">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${
                isPaymentOverdue || mortgageData.missedPayments >= 3 ? 'text-destructive' :
                isPaymentSoon ? 'text-yellow-600' : 'text-orange-600'
              }`} />
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-8 space-y-4">
            {isPaymentOverdue && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">Payment Overdue</p>
                  <p className="text-sm text-muted-foreground">Make a payment immediately to avoid foreclosure proceedings.</p>
                </div>
              </div>
            )}
            {isPaymentSoon && !isPaymentOverdue && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-700">Payment Due Soon</p>
                  <p className="text-sm text-muted-foreground">Payment due in {daysUntilPayment} days.</p>
                </div>
              </div>
            )}
            {mortgageData.missedPayments > 0 && (
              <>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-orange-700">
                      {mortgageData.missedPayments} Missed Payment{mortgageData.missedPayments > 1 ? 's' : ''}
                    </p>
                    {mortgageData.missedPayments >= 3 && (
                      <p className="text-sm text-destructive font-medium">⚠️ FORECLOSURE WARNING: One more missed payment will trigger foreclosure!</p>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Payment Standing</span>
                    <span className={`font-semibold ${
                      mortgageData.missedPayments >= 3 ? 'text-destructive' :
                      mortgageData.missedPayments >= 2 ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {4 - mortgageData.missedPayments}/4 payments current
                    </span>
                  </div>
                  <Progress 
                    value={paymentProgress} 
                    className={`h-3 ${
                      mortgageData.missedPayments >= 3 ? '[&>div]:bg-destructive' :
                      mortgageData.missedPayments >= 2 ? '[&>div]:bg-orange-500' :
                      '[&>div]:bg-green-500'
                    }`}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-destructive/10" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <div className="p-2 rounded-lg bg-destructive/10">
              <DollarSign className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-destructive">
              {asUSD((userProperty as any)?.remaining_balance_base, mortgageData.remainingBalance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {principalBase(userProperty) != null 
                ? fmtUSD(principalBase(userProperty)!) 
                : `$${mortgageData.principalAmount?.toLocaleString() || '0'}`} principal
            </p>
            <div className="mt-2">
              <Progress value={100 - mortgageProgress} className="h-1 bg-muted [&>div]:bg-destructive/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payment</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-primary">
              ${mortgageData.monthlyPayment?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {(mortgageData.aprBps ?? 800) / 100}% APR • {(mortgageData.termMonths ?? 120) / 12} years
            </p>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">Auto-pay enabled</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${
            isPaymentOverdue ? 'from-destructive/5 to-destructive/10' :
            isPaymentSoon ? 'from-yellow-500/5 to-yellow-500/10' :
            'from-green-500/5 to-green-500/10'
          }`} />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <div className={`p-2 rounded-lg ${
              isPaymentOverdue ? 'bg-destructive/10' :
              isPaymentSoon ? 'bg-yellow-500/10' :
              'bg-green-500/10'
            }`}>
              <Calendar className={`h-4 w-4 ${
                isPaymentOverdue ? 'text-destructive' :
                isPaymentSoon ? 'text-yellow-600' :
                'text-green-600'
              }`} />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className={`text-2xl font-bold ${
              isPaymentOverdue ? 'text-destructive' : 
              isPaymentSoon ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {isPaymentOverdue ? 'OVERDUE' : `${daysUntilPayment} days`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Due: {mortgageData.nextPaymentDue ? 
                new Date(mortgageData.nextPaymentDue).toLocaleDateString() : 
                'Not scheduled'
              }
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-500/10" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equity</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10">
              <PiggyBank className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-green-600">
              ${((mortgageData.principalAmount - mortgageData.remainingBalance) + mortgageData.downPayment).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Down payment + principal paid
            </p>
            <div className="mt-2">
              <Progress value={mortgageProgress} className="h-1 bg-muted [&>div]:bg-green-500/60" />
            </div>
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

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button
          onClick={handleMakePayment}
          disabled={isPurchasingProperty || mortgageData.isCompleted}
          className="h-12 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
          size="lg"
        >
          <CreditCard className="h-5 w-5" />
          Make Payment (${mortgageData.monthlyPayment?.toLocaleString() || '0'})
        </Button>
        
        {onNavigateToProperties && (
          <Button 
            variant="outline" 
            onClick={() => onNavigateToProperties({
              propertyId: userProperty?.id,
              name: userProperty?.property_name,
              location: userProperty?.property_location
            })}
            className="h-12 flex items-center justify-center gap-2"
            size="lg"
          >
            <Building2 className="h-5 w-5" />
            View Property Details
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={handleViewOnExplorer}
          className="h-12 flex items-center justify-center gap-2"
          size="lg"
        >
          <ExternalLink className="h-5 w-5" />
          Blockchain Explorer
        </Button>
      </div>

      {/* Payment Modal */}
      {userProperty && (
        <MortgagePaymentModal 
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          property={{
            id: userProperty.id,
            title: userProperty.property_name,
            location: userProperty.property_location,
            image: propertyDetails.image,
            value: userProperty.current_value,
            monthlyPayment: userProperty.monthly_payment,
            remainingBalance: userProperty.remaining_balance
          }}
          onSuccess={() => {
            setPaymentModalOpen(false);
            onNavigateToProperties?.({
              propertyId: userProperty.id,
              name: userProperty.property_name,
              location: userProperty.property_location,
            });
          }}
        />
      )}
    </div>
  );
};