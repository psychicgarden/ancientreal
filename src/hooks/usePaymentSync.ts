import { useEffect } from 'react';
import { ethers } from 'ethers';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentEventData {
  borrower: string;
  paymentAmount: bigint;
  principalPaid: bigint;
  interestPaid: bigint;
  remainingBalance: bigint;
  transactionHash?: string;
}

export const usePaymentSync = (contractAddress: string, account: string) => {
  const { toast } = useToast();

  const syncPaymentToDatabase = async (eventData: PaymentEventData) => {
    try {
      // Convert AVAX back to USD using the test ratio: 0.00129 AVAX = $129,000
      const AVAX_TO_USD_RATIO = 129000 / 0.00129; // ~100,000,000
      
      const paymentAmountUSD = parseFloat(ethers.formatEther(eventData.paymentAmount)) * AVAX_TO_USD_RATIO;
      const principalPaidUSD = parseFloat(ethers.formatEther(eventData.principalPaid)) * AVAX_TO_USD_RATIO;
      const interestPaidUSD = parseFloat(ethers.formatEther(eventData.interestPaid)) * AVAX_TO_USD_RATIO;
      const remainingBalanceUSD = parseFloat(ethers.formatEther(eventData.remainingBalance)) * AVAX_TO_USD_RATIO;

      // Determine property ID dynamically based on payment amount
      // Bahia property (ID: 2) has higher monthly payments (~$1,261), Art Deco Loft (ID: 1) has lower payments (~$700)
      const propertyId = paymentAmountUSD > 1000 ? 2 : 1;

      console.log('💰 Converting AVAX to USD:', {
        paymentAmountAVAX: ethers.formatEther(eventData.paymentAmount),
        paymentAmountUSD: paymentAmountUSD.toFixed(2),
        principalPaidUSD: principalPaidUSD.toFixed(2),
        interestPaidUSD: interestPaidUSD.toFixed(2),
        detectedPropertyId: propertyId
      });

      // Convert to 6-decimal base units for database storage (USDC-6 format)
      const principalPaidBase = Math.round(principalPaidUSD * 1_000_000);
      const interestPaidBase = Math.round(interestPaidUSD * 1_000_000);

      console.log('💾 Database conversion:', {
        principalPaidUSD: principalPaidUSD.toFixed(2),
        principalPaidBase,
        interestPaidUSD: interestPaidUSD.toFixed(2),
        interestPaidBase
      });

      // Insert payment into mortgage_payments_ledger
      const { error: ledgerError } = await supabase
        .from('mortgage_payments_ledger')
        .insert({
          user_address: eventData.borrower.toLowerCase(),
          property_id: propertyId, // Dynamic property ID detection
          principal_delta_base: principalPaidBase,
          interest_delta_base: interestPaidBase,
          tx_hash: eventData.transactionHash
        });

      if (ledgerError) {
        throw new Error(`Ledger insert failed: ${ledgerError.message}`);
      }

      // Apply payment to user_properties using database function
      const { error: applyError } = await supabase.rpc('apply_mortgage_payment', {
        p_user_address: eventData.borrower.toLowerCase(),
        p_property_id: propertyId, // Dynamic property ID
        p_principal_delta_base: principalPaidBase,
        p_interest_delta_base: interestPaidBase,
        p_tx_hash: eventData.transactionHash
      });

      if (applyError) {
        console.error('⚠️ Failed to apply payment to user_properties:', applyError);
        // Don't throw - payment is already recorded in ledger
      } else {
        console.log('✅ Payment applied to user_properties successfully');
      }

      // Insert transaction record
      const { error: transactionError } = await supabase
        .from('user_transactions')
        .insert({
          user_wallet_address: eventData.borrower.toLowerCase(),
          transaction_type: 'mortgage_payment',
          amount: paymentAmountUSD,
          status: 'completed',
          transaction_hash: eventData.transactionHash,
          metadata: {
            principal_paid: principalPaidUSD,
            interest_paid: interestPaidUSD,
            remaining_balance: remainingBalanceUSD,
            property_type: 'avax_mortgage'
          }
        });

      if (transactionError) {
        throw new Error(`Transaction insert failed: ${transactionError.message}`);
      }

      // Update remaining balance in user_properties (if exists)
      const newRemainingBalance = remainingBalanceUSD;
      const { error: balanceError } = await supabase
        .from('user_properties')
        .update({
          remaining_balance: newRemainingBalance,
          updated_at: new Date().toISOString()
        })
        .eq('user_address', eventData.borrower.toLowerCase())
        .eq('property_id', propertyId); // Dynamic property ID

      if (balanceError) {
        console.warn('⚠️ Balance update failed (non-critical):', balanceError.message);
      } else {
        console.log('✅ Updated remaining balance to:', newRemainingBalance);
      }

      console.log('✅ Payment synced to database:', {
        borrower: eventData.borrower,
        paymentAmount: paymentAmountUSD.toFixed(2),
        remainingBalance: remainingBalanceUSD.toFixed(2),
        transactionHash: eventData.transactionHash
      });

      toast({
        title: "✅ Payment Synced",
        description: `Payment of $${paymentAmountUSD.toFixed(2)} synced to database`,
      });

    } catch (error) {
      console.error('❌ Failed to sync payment to database:', error);
      toast({
        title: "⚠️ Sync Warning",
        description: "Payment succeeded on blockchain but database sync failed",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (!contractAddress || !account || !window.ethereum) {
      console.log('🔇 Payment sync not initialized:', { contractAddress, account, ethereum: !!window.ethereum });
      return;
    }

    let contract: ethers.Contract | null = null;

    const setupEventListener = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const ABI = [
          'event PaymentMade(address indexed borrower, uint256 paymentAmount, uint256 principalPaid, uint256 interestPaid, uint256 remainingBalance)'
        ];
        
        contract = new ethers.Contract(contractAddress, ABI, provider);
        
        console.log('🔧 Setting up payment listeners for:', {
          contractAddress,
          account: account.toLowerCase(),
          provider: provider.constructor.name
        });

        // Listen for ALL PaymentMade events first to debug
        contract.on('PaymentMade', async (borrower, paymentAmount, principalPaid, interestPaid, remainingBalance, event) => {
          console.log('📨 ANY Payment event received:', {
            borrower: borrower.toLowerCase(),
            currentAccount: account.toLowerCase(),
            paymentAmount: ethers.formatEther(paymentAmount),
            principalPaid: ethers.formatEther(principalPaid),
            interestPaid: ethers.formatEther(interestPaid),
            remainingBalance: ethers.formatEther(remainingBalance),
            txHash: event.transactionHash,
            isForCurrentUser: borrower.toLowerCase() === account.toLowerCase()
          });

          // Only process if it's for the current user
          if (borrower.toLowerCase() === account.toLowerCase()) {
            console.log('✅ Processing payment for current user');
            await syncPaymentToDatabase({
              borrower,
              paymentAmount,
              principalPaid,
              interestPaid,
              remainingBalance,
              transactionHash: event.transactionHash
            });
          } else {
            console.log('⏭️ Skipping payment for different user');
          }
        });

        console.log('🎧 Payment event listener activated for contract:', contractAddress, 'account:', account);

      } catch (error) {
        console.error('❌ Failed to setup payment event listener:', error);
      }
    };

    setupEventListener();

    // Cleanup function
    return () => {
      if (contract) {
        contract.removeAllListeners();
        console.log('🧹 Payment event listeners removed');
      }
    };
  }, [contractAddress, account, toast]);

  return { syncPaymentToDatabase };
};