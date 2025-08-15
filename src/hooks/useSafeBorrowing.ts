import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { toBase, fromBase } from '@/lib/money';
import { supabase } from '@/integrations/supabase/client';

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

      // Fetch user properties from database
      const { data: userProperties, error: propertiesError } = await supabase
        .from('user_properties')
        .select('*')
        .eq('user_wallet_address', account.toLowerCase())
        .eq('is_active', true);

      if (propertiesError) throw propertiesError;

      // Fetch existing collateral loans
      const { data: existingLoans, error: loansError } = await supabase
        .from('collateral_loans')
        .select('*')
        .eq('user_wallet_address', account.toLowerCase())
        .in('status', ['active', 'pending']);

      if (loansError) throw loansError;

      setCollateralLoans(existingLoans || []);

      // Calculate borrowable amounts for each property
      const borrowableProperties: BorrowableProperty[] = (userProperties || []).map(property => {
        const paidEquityBase = (property.down_payment_base || 0) + (property.principal_paid_base || 0);
        
        // Conservative 50% LTV on paid equity only
        const maxBorrowableBase = Math.floor(paidEquityBase / 2);
        
        // Check existing loans against this property
        const existingLoanBase = (existingLoans || [])
          ?.filter(loan => loan.property_id === property.property_id)
          ?.reduce((sum, loan) => sum + loan.loan_amount_base, 0) || 0;
        
        const availableToBorrowBase = maxBorrowableBase > existingLoanBase 
          ? maxBorrowableBase - existingLoanBase 
          : 0;

        return {
          property: {
            id: property.id,
            property_name: property.property_name || 'Unknown Property',
            property_location: property.property_location || 'Unknown Location',
            image_url: property.image_url || '/placeholder.svg',
            property_id: property.property_id || 0,
            purchase_price_base: property.purchase_price_base || 0,
            down_payment_base: property.down_payment_base || 0,
            principal_paid_base: property.principal_paid_base || 0,
            interest_paid_base: property.interest_paid_base || 0,
            loan_amount_base: property.loan_amount_base || 0
          },
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

    const loanToValuePercent = (loanAmountBase * 100) / collateralEquityBase;
    
    const { error } = await supabase
      .from('collateral_loans')
      .insert({
        user_wallet_address: account.toLowerCase(),
        property_id: propertyId,
        loan_amount_base: loanAmountBase,
        collateral_equity_base: collateralEquityBase,
        loan_to_value_percent: loanToValuePercent,
        interest_rate_bps: 1000 // 10% APY
      });
    
    if (error) throw error;
    
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