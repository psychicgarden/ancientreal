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
      const paymentAmountUSD = parseFloat(ethers.formatEther(eventData.paymentAmount));
      const principalPaidUSD = parseFloat(ethers.formatEther(eventData.principalPaid));
      const interestPaidUSD = parseFloat(ethers.formatEther(eventData.interestPaid));
      const remainingBalanceUSD = parseFloat(ethers.formatEther(eventData.remainingBalance));

      // Insert payment into mortgage_payments_ledger
      await supabase
        .from('mortgage_payments_ledger')
        .insert({
          user_address: eventData.borrower.toLowerCase(),
          property_id: 1, // Using property ID 1 for AVAX mortgage
          principal_delta_base: Number(eventData.principalPaid),
          interest_delta_base: Number(eventData.interestPaid),
          tx_hash: eventData.transactionHash
        });

      // Insert transaction record
      await supabase
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

      // Update user_properties remaining balance (if exists)
      await supabase
        .from('user_properties')
        .update({
          remaining_balance: remainingBalanceUSD,
          updated_at: new Date().toISOString()
        })
        .eq('user_address', eventData.borrower.toLowerCase())
        .eq('property_id', 1);

      console.log('✅ Payment synced to database:', {
        borrower: eventData.borrower,
        paymentAmount: paymentAmountUSD,
        remainingBalance: remainingBalanceUSD
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
    if (!contractAddress || !account || !window.ethereum) return;

    let contract: ethers.Contract | null = null;

    const setupEventListener = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const ABI = [
          'event PaymentMade(address indexed borrower, uint256 paymentAmount, uint256 principalPaid, uint256 interestPaid, uint256 remainingBalance)'
        ];
        
        contract = new ethers.Contract(contractAddress, ABI, provider);
        
        // Listen for PaymentMade events from this user
        const filter = contract.filters.PaymentMade(account);
        
        contract.on(filter, async (borrower, paymentAmount, principalPaid, interestPaid, remainingBalance, event) => {
          console.log('📨 Payment event received:', {
            borrower,
            paymentAmount: ethers.formatEther(paymentAmount),
            principalPaid: ethers.formatEther(principalPaid),
            interestPaid: ethers.formatEther(interestPaid),
            remainingBalance: ethers.formatEther(remainingBalance)
          });

          await syncPaymentToDatabase({
            borrower,
            paymentAmount,
            principalPaid,
            interestPaid,
            remainingBalance,
            transactionHash: event.transactionHash
          });
        });

        console.log('🎧 Payment event listener activated for contract:', contractAddress);

      } catch (error) {
        console.error('Failed to setup payment event listener:', error);
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