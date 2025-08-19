import { supabase } from '@/integrations/supabase/client';
import { validateWalletAddress, sanitizeString } from './security-utils';

// Simple secure API functions that work with Supabase types
export async function secureGetUserTransactions(walletAddress: string) {
  if (!validateWalletAddress(walletAddress)) {
    throw new Error('Invalid wallet address');
  }

  const { data, error } = await supabase
    .from('user_transactions')
    .select('*')
    .eq('user_wallet_address', walletAddress.toLowerCase());

  if (error) {
    console.error('Failed to fetch user transactions:', error);
    throw new Error('Failed to fetch transactions');
  }

  return data || [];
}

export async function secureGetUserInvestments(walletAddress: string) {
  if (!validateWalletAddress(walletAddress)) {
    throw new Error('Invalid wallet address');
  }

  const { data, error } = await supabase
    .from('fractional_investments')
    .select('*')
    .eq('investor_wallet_address', walletAddress.toLowerCase());

  if (error) {
    console.error('Failed to fetch user investments:', error);
    throw new Error('Failed to fetch investments');
  }

  return data || [];
}

export async function secureCreateTransaction(transactionData: {
  user_wallet_address: string;
  transaction_type: string;
  amount: number;
  metadata?: any;
  transaction_hash?: string;
}) {
  if (!validateWalletAddress(transactionData.user_wallet_address)) {
    throw new Error('Invalid wallet address');
  }

  // Sanitize string fields
  const sanitizedData = {
    ...transactionData,
    user_wallet_address: transactionData.user_wallet_address.toLowerCase(),
    transaction_type: sanitizeString(transactionData.transaction_type),
    transaction_hash: transactionData.transaction_hash ? 
      sanitizeString(transactionData.transaction_hash) : undefined,
  };

  const { data, error } = await supabase
    .from('user_transactions')
    .insert(sanitizedData)
    .select()
    .single();

  if (error) {
    console.error('Failed to create transaction:', error);
    throw new Error('Failed to create transaction');
  }

  return data;
}

export async function secureCreateInvestment(investmentData: {
  investor_wallet_address: string;
  property_id: string;
  investment_amount: number;
  token_amount: number;
  ownership_percentage: number;
  original_property_price: number;
}) {
  if (!validateWalletAddress(investmentData.investor_wallet_address)) {
    throw new Error('Invalid wallet address');
  }

  const sanitizedData = {
    ...investmentData,
    investor_wallet_address: investmentData.investor_wallet_address.toLowerCase(),
  };

  const { data, error } = await supabase
    .from('fractional_investments')
    .insert(sanitizedData)
    .select()
    .single();

  if (error) {
    console.error('Failed to create investment:', error);
    throw new Error('Failed to create investment');
  }

  return data;
}