// Blockchain to Database Sync System - Fixed Version
import { ethers } from 'ethers';
import { supabase } from '@/integrations/supabase/client';
import { CONTRACTS } from '@/config/chain';

export interface MortgageData {
  borrower: string;
  propertyId: number;
  tokenId: number;
  propertyValue: string;
  downPayment: string;
  loanAmount: string;
  monthlyPayment: string;
  termMonths: number;
  interestRate: number;
  transactionHash: string;
  blockNumber: number;
  createdAt: Date;
}

export class BlockchainSync {
  private provider: ethers.JsonRpcProvider;
  private contractAddress: string;

  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc');
    this.contractAddress = CONTRACTS.SIMPLE_MORTGAGE;
  }

  async syncMortgageCreation(mortgageData: MortgageData): Promise<void> {
    try {
      const usdExchangeRate = 100000000;
      const propertyValueUSD = parseFloat(ethers.formatEther(mortgageData.propertyValue)) * usdExchangeRate;
      const downPaymentUSD = parseFloat(ethers.formatEther(mortgageData.downPayment)) * usdExchangeRate;

      // Sync to database
      await supabase.from('user_properties').insert({
        user_wallet_address: mortgageData.borrower.toLowerCase(),
        user_address: mortgageData.borrower.toLowerCase(),
        property_id: mortgageData.propertyId,
        property_name: `Property ${mortgageData.propertyId}`,
        property_location: 'Blockchain Property',
        purchase_price: propertyValueUSD,
        down_payment: downPaymentUSD,
        current_value: propertyValueUSD,
        monthly_payment: parseFloat(ethers.formatEther(mortgageData.monthlyPayment)) * usdExchangeRate,
        remaining_balance: parseFloat(ethers.formatEther(mortgageData.loanAmount)) * usdExchangeRate,
        equity_percentage: (downPaymentUSD / propertyValueUSD) * 100,
        currency: 'AVAX-18',
        mortgage_id: `${mortgageData.transactionHash}-${mortgageData.tokenId}`,
        unique_purchase_key: `${mortgageData.borrower}-${mortgageData.propertyId}-${mortgageData.tokenId}`
      });

      console.log('✅ Mortgage synced to database:', mortgageData.borrower);
    } catch (error) {
      console.error('❌ Failed to sync mortgage:', error);
    }
  }

  async startEventListener(): Promise<void> {
    console.log('🔊 Blockchain event listener ready for enhanced contract deployment');
  }
}

export const blockchainSync = new BlockchainSync();