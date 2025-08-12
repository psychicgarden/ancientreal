import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { toBase, fromBase } from '@/lib/money';

interface UserProperty {
  id: string;
  property_name: string;
  property_location: string;
  image_url: string;
  property_id: number;
  purchase_price_base: number;
  down_payment_base: number;
  principal_paid_base: number;
  interest_paid_base: number;
  loan_amount_base: number;
}

interface CollateralLoan {
  id: string;
  loan_amount_base: number;
  collateral_equity_base: number;
  interest_rate_bps: number;
  loan_to_value_percent: number;
  status: string;
  property_id: number;
}

interface BorrowableProperty {
  property: UserProperty;
  paidEquityBase: number;
  maxBorrowableBase: number;
  existingLoanBase: number;
  availableToBorrowBase: number;
}

export const useSafeBorrowing = () => {
  const { account } = useWallet();
  const [properties, setProperties] = useState<BorrowableProperty[]>([]);
  const [collateralLoans, setCollateralLoans] = useState<CollateralLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBorrowableProperties = async () => {
    if (!account) {
      setProperties([]);
      setCollateralLoans([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Mock data for now since table types aren't updated yet
      // This will be replaced with real Supabase queries once types are regenerated
      const mockProperties: UserProperty[] = [
        {
          id: '1',
          property_name: 'Art Deco Loft Mexico',
          property_location: 'Mexico City, Mexico',
          image_url: '/placeholder.svg',
          property_id: 1,
          purchase_price_base: 150000000000, // $150k in USDC-6
          down_payment_base: 30000000000,   // $30k down payment
          principal_paid_base: 5000000000,  // $5k principal paid
          interest_paid_base: 2000000000,   // $2k interest paid
          loan_amount_base: 120000000000    // $120k loan
        }
      ];

      const mockLoans: CollateralLoan[] = [];

      setCollateralLoans(mockLoans);

      // Calculate borrowable amounts for each property
      const borrowableProperties: BorrowableProperty[] = mockProperties.map(property => {
        const paidEquityBase = property.down_payment_base + (property.principal_paid_base || 0);
        
        // Conservative 50% LTV on paid equity only
        const maxBorrowableBase = Math.floor(paidEquityBase / 2);
        
        // Check existing loans against this property
        const existingLoanBase = mockLoans
          ?.filter(loan => loan.property_id === property.property_id)
          ?.reduce((sum, loan) => sum + loan.loan_amount_base, 0) || 0;
        
        const availableToBorrowBase = maxBorrowableBase > existingLoanBase 
          ? maxBorrowableBase - existingLoanBase 
          : 0;

        return {
          property,
          paidEquityBase,
          maxBorrowableBase,
          existingLoanBase,
          availableToBorrowBase
        };
      });

      setProperties(borrowableProperties);
    } catch (err) {
      console.error('Error fetching borrowable properties:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createCollateralLoan = async (
    propertyId: number,
    loanAmountBase: number,
    collateralEquityBase: number
  ) => {
    if (!account) throw new Error('Wallet not connected');

    // Mock implementation for now - will be replaced with real Supabase insert
    const loanToValuePercent = (loanAmountBase * 100) / collateralEquityBase;
    
    console.log('Creating mock collateral loan:', {
      user_wallet_address: account.toLowerCase(),
      property_id: propertyId,
      loan_amount_base: loanAmountBase,
      collateral_equity_base: collateralEquityBase,
      loan_to_value_percent: loanToValuePercent,
      interest_rate_bps: 1200 // 12% APY
    });
    
    // Simulate successful loan creation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Refresh data after creating loan
    await fetchBorrowableProperties();
    
    return { success: true };
  };

  useEffect(() => {
    fetchBorrowableProperties();
  }, [account]);

  return {
    properties,
    collateralLoans,
    loading,
    error,
    createCollateralLoan,
    refetch: fetchBorrowableProperties
  };
};