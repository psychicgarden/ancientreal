import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { useSafeBorrowing } from '@/hooks/useSafeBorrowing';
import { fromBase, fmtUSD, toBase } from '@/lib/money';
import { AlertTriangle, DollarSign, Shield, TrendingUp, Home } from 'lucide-react';

export const SafeBorrowing = () => {
  const { account } = useWallet();
  const { toast } = useToast();
  const { properties, collateralLoans, loading, createCollateralLoan } = useSafeBorrowing();
  
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [loanAmount, setLoanAmount] = useState(0);
  const [isCreatingLoan, setIsCreatingLoan] = useState(false);

  const selectedPropertyData = properties.find(p => p.property.id === selectedProperty);
  const maxBorrowable = selectedPropertyData ? fromBase(selectedPropertyData.availableToBorrowBase) : 0;
  
  // Interest calculations (10% APY)
  const monthlyInterestRate = 0.10 / 12;
  const monthlyPayment = loanAmount > 0 ? (loanAmount * monthlyInterestRate) : 0;

  const handleCreateLoan = async () => {
    if (!selectedPropertyData || loanAmount <= 0) return;

    try {
      setIsCreatingLoan(true);
      
      const loanAmountBase = Number(toBase(loanAmount));
      const collateralEquityBase = selectedPropertyData.paidEquityBase;
      
      await createCollateralLoan(
        selectedPropertyData.property.property_id,
        loanAmountBase,
        collateralEquityBase
      );

      toast({
        title: "Collateral Loan Created",
        description: `Successfully borrowed ${fmtUSD(BigInt(loanAmountBase))} against your property equity.`
      });

      // Reset form
      setSelectedProperty('');
      setLoanAmount(0);
    } catch (error) {
      console.error('Error creating collateral loan:', error);
      toast({
        title: "Loan Creation Failed",
        description: "Unable to create collateral loan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingLoan(false);
    }
  };

  const getLTVColor = (ltv: number) => {
    if (ltv < 30) return "text-green-600";
    if (ltv < 45) return "text-yellow-600";
    return "text-red-600";
  };

  if (!account) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to access collateral borrowing.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading your properties...</div>
        </CardContent>
      </Card>
    );
  }

  const totalAvailableCredit = properties.reduce((sum, p) => sum + fromBase(p.availableToBorrowBase), 0);
  const totalExistingLoans = collateralLoans.reduce((sum, loan) => sum + fromBase(loan.loan_amount_base), 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Credit</p>
                <p className="text-2xl font-bold text-green-600">{fmtUSD(toBase(totalAvailableCredit))}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Loans</p>
                <p className="text-2xl font-bold">{fmtUSD(toBase(totalExistingLoans))}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Properties</p>
                <p className="text-2xl font-bold">{properties.length}</p>
              </div>
              <Home className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Safe Borrowing:</strong> You can only borrow against equity you've actually paid (down payment + principal payments). 
          Maximum 50% LTV with 10% APY. Your mortgage payments must be current.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Borrow Against Property */}
        <Card>
          <CardHeader>
            <CardTitle>Borrow Against Property Equity</CardTitle>
            <CardDescription>
              Access liquidity using your paid property equity as collateral
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {properties.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No properties available for borrowing. You need to own properties with paid equity to borrow against them.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="property-select">Select Property</Label>
                  <select
                    id="property-select"
                    value={selectedProperty}
                    onChange={(e) => {
                      setSelectedProperty(e.target.value);
                      setLoanAmount(0);
                    }}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Choose a property...</option>
                    {properties.map((p) => (
                      <option key={p.property.id} value={p.property.id}>
                        {p.property.property_name} - Available: {fmtUSD(p.availableToBorrowBase)}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedPropertyData && (
                  <>
                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Paid Equity</span>
                        <span className="font-medium">{fmtUSD(selectedPropertyData.paidEquityBase)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Max Borrowable (50%)</span>
                        <span className="font-medium">{fmtUSD(selectedPropertyData.maxBorrowableBase)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Existing Loans</span>
                        <span className="font-medium">{fmtUSD(selectedPropertyData.existingLoanBase)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Available to Borrow</span>
                        <span className="font-bold text-green-600">{fmtUSD(selectedPropertyData.availableToBorrowBase)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="loan-amount">Loan Amount</Label>
                      <Input
                        id="loan-amount"
                        type="number"
                        value={loanAmount || ''}
                        onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
                        max={maxBorrowable}
                        placeholder="Enter amount to borrow"
                      />
                      <Slider
                        value={[loanAmount]}
                        onValueChange={(value) => setLoanAmount(value[0])}
                        max={maxBorrowable}
                        step={100}
                        className="mt-2"
                      />
                    </div>

                    {loanAmount > 0 && (
                      <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Loan Amount</span>
                          <span className="font-medium">{fmtUSD(toBase(loanAmount))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Interest Rate</span>
                          <span className="font-medium">10% APY</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Monthly Interest</span>
                          <span className="font-medium">{fmtUSD(toBase(monthlyPayment))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">LTV</span>
                          <span className={`font-medium ${getLTVColor((loanAmount / fromBase(selectedPropertyData.paidEquityBase)) * 100)}`}>
                            {((loanAmount / fromBase(selectedPropertyData.paidEquityBase)) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleCreateLoan}
                      disabled={!selectedProperty || loanAmount <= 0 || loanAmount > maxBorrowable || isCreatingLoan}
                      className="w-full"
                    >
                      {isCreatingLoan ? 'Creating Loan...' : `Borrow ${fmtUSD(toBase(loanAmount))}`}
                    </Button>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Active Loans */}
        <Card>
          <CardHeader>
            <CardTitle>Your Active Collateral Loans</CardTitle>
            <CardDescription>
              Manage your existing loans against property equity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {collateralLoans.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No active collateral loans
              </div>
            ) : (
              <div className="space-y-4">
                {collateralLoans.map((loan) => {
                  const property = properties.find(p => p.property.property_id === loan.property_id);
                  return (
                    <div key={loan.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{property?.property.property_name || 'Property'}</p>
                          <p className="text-sm text-muted-foreground">
                            Loan Amount: {fmtUSD(loan.loan_amount_base)}
                          </p>
                        </div>
                        <Badge variant={loan.status === 'active' ? 'default' : 'secondary'}>
                          {loan.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Interest Rate:</span>
                          <span className="ml-2">{loan.interest_rate_bps / 100}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">LTV:</span>
                          <span className={`ml-2 ${getLTVColor(loan.loan_to_value_percent)}`}>
                            {loan.loan_to_value_percent.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};