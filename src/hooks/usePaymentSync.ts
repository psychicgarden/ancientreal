import { useEffect } from 'react';
import { ethers } from 'ethers';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ENHANCED_AVAX_MORTGAGE_CONFIG, convertAVAXToUSD } from '@/lib/enhanced-avax-mortgage-abi';

interface PaymentEventData {
  borrower: string;
  propertyId: bigint;
  paymentAmount: bigint;
  principalPaid: bigint;
  interestPaid: bigint;
  remainingBalance: bigint;
  transactionHash?: string;
}

export const usePaymentSync = (contractAddress: string, account: string) => {
  const { toast } = useToast();

  const syncPaymentToDatabase = async (eventData: PaymentEventData) => {
    // Check for existing payment with same tx hash to prevent duplicates
    if (eventData.transactionHash) {
      const { data: existingPayment } = await supabase
        .from('mortgage_payments_ledger')
        .select('id')
        .eq('tx_hash', eventData.transactionHash)
        .single();

      if (existingPayment) {
        console.log('⏭️ Payment already exists in ledger, skipping:', eventData.transactionHash);
        return;
      }
    }
    try {
      // Convert AVAX to USD using enhanced configuration
      const paymentAmountUSD = convertAVAXToUSD(ethers.formatEther(eventData.paymentAmount));
      const principalPaidUSD = convertAVAXToUSD(ethers.formatEther(eventData.principalPaid));
      const interestPaidUSD = convertAVAXToUSD(ethers.formatEther(eventData.interestPaid));
      const remainingBalanceUSD = convertAVAXToUSD(ethers.formatEther(eventData.remainingBalance));

      // Use property ID from event data
      const propertyId = Number(eventData.propertyId);

      console.log('💰 Enhanced AVAX Mortgage - Converting to USD:', {
        paymentAmountAVAX: ethers.formatEther(eventData.paymentAmount),
        paymentAmountUSD: paymentAmountUSD.toFixed(2),
        principalPaidUSD: principalPaidUSD.toFixed(2),
        interestPaidUSD: interestPaidUSD.toFixed(2),
        propertyId
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
        p_property_id: propertyId,
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
        .eq('property_id', propertyId);

      if (balanceError) {
        console.warn('⚠️ Balance update failed (non-critical):', balanceError.message);
      } else {
        console.log('✅ Updated remaining balance to:', newRemainingBalance);
      }

      console.log('✅ Enhanced AVAX Mortgage payment synced to database:', {
        borrower: eventData.borrower,
        paymentAmount: paymentAmountUSD.toFixed(2),
        remainingBalance: remainingBalanceUSD.toFixed(2),
        transactionHash: eventData.transactionHash
      });

      toast({
        title: "✅ Payment Synced",
        description: `Enhanced AVAX Mortgage payment of $${paymentAmountUSD.toFixed(2)} synced to database`,
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
          'event PaymentMade(address indexed borrower, uint256 indexed propertyId, uint256 paymentAmount, uint256 principalPaid, uint256 interestPaid, uint256 remainingBalance)'
        ];
        
        contract = new ethers.Contract(contractAddress, ABI, provider);
        
        console.log('🔧 Setting up payment listeners for:', {
          contractAddress,
          account: account.toLowerCase(),
          provider: provider.constructor.name
        });

        // Listen for ALL PaymentMade events first to debug
        contract.on('PaymentMade', async (borrower, propertyId, paymentAmount, principalPaid, interestPaid, remainingBalance, event) => {
          console.log('📨 ANY Payment event received:', {
            borrower: borrower.toLowerCase(),
            currentAccount: account.toLowerCase(),
            propertyId: propertyId.toString(),
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
              propertyId,
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