// Hook for syncing contract events with database - Now Active
import { useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { blockchainSync } from '@/lib/blockchain-sync';

export const useContractEventSync = () => {
  const { account } = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    if (!account) return;

    console.log('Contract event sync initialized for account:', account);

    // Initialize blockchain sync event listeners
    const setupEventListeners = async () => {
      try {
        await blockchainSync.startEventListener();
        console.log('✅ Contract event listeners active');
      } catch (error) {
        console.error('Error setting up contract event listeners:', error);
      }
    };

    setupEventListeners();

    // Cleanup function
    return () => {
      blockchainSync.stopEventListener();
      console.log('Cleaning up contract event listeners');
    };
  }, [account]);

  // Function to manually sync recent events (for recovery)
  const syncRecentEvents = async (fromBlock: number = -100) => {
    try {
      console.log('Starting manual event sync from block:', fromBlock);
      
      await blockchainSync.startEventListener();
      
      toast({
        title: "Event Sync Active",
        description: "Contract event synchronization is now running"
      });

    } catch (error) {
      console.error('Error syncing recent events:', error);
      toast({
        title: "Sync Failed",
        description: "Unable to sync recent events. Please try again.",
        variant: "destructive"
      });
    }
  };

  return { syncRecentEvents };
};
