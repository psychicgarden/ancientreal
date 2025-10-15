// Blockchain to Database Sync System - Real Implementation
import { ethers } from 'ethers';
import { supabase } from '@/integrations/supabase/client';
import { CONTRACTS } from '@/lib/contracts';
import { PROPERTIES_CATALOG } from '@/lib/propertiesCatalog';

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
  private contract: ethers.Contract;
  private isListening: boolean = false;
  private isBaseSepolia: boolean = false;

  constructor() {
    // Check if we're on Base Sepolia - if so, disable AVAX sync
    this.checkNetworkAndInitialize();
  }

  private async checkNetworkAndInitialize() {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        
        if (network.chainId === 84532n) {
          // Base Sepolia - disable AVAX sync
          console.log('⚠️ BlockchainSync disabled on Base Sepolia - using ETH contracts instead');
          this.isBaseSepolia = true;
          return;
        }
      }
      
      // Initialize AVAX sync only on Avalanche Fuji
      this.provider = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc');
      this.contract = new ethers.Contract(
        CONTRACTS.SIMPLE_MORTGAGE.address,
        CONTRACTS.SIMPLE_MORTGAGE.abi,
        this.provider
      );
    } catch (error) {
      console.warn('⚠️ Could not initialize BlockchainSync:', error);
    }
  }

  async syncMortgageCreation(mortgageData: MortgageData): Promise<void> {
    if (this.isBaseSepolia) {
      console.log('⚠️ syncMortgageCreation skipped - on Base Sepolia');
      return;
    }
    
    try {
      // Fixed exchange rate: $129,000 = 0.00129 AVAX
      const usdExchangeRate = 100000000; // 1 AVAX = $100M USD for our demo
      const propertyValueUSD = parseFloat(ethers.formatEther(mortgageData.propertyValue)) * usdExchangeRate;
      const downPaymentUSD = parseFloat(ethers.formatEther(mortgageData.downPayment)) * usdExchangeRate;
      const loanAmountUSD = parseFloat(ethers.formatEther(mortgageData.loanAmount)) * usdExchangeRate;
      const monthlyPaymentUSD = parseFloat(ethers.formatEther(mortgageData.monthlyPayment)) * usdExchangeRate;

      // Get property details from catalog (convert propertyId to string for comparison)
      const property = PROPERTIES_CATALOG.find(p => p.id === `property-${mortgageData.propertyId}`) || PROPERTIES_CATALOG[0];

      // Sync to database with proper data
      const { error } = await supabase.from('user_properties').insert({
        user_wallet_address: mortgageData.borrower.toLowerCase(),
        user_address: mortgageData.borrower.toLowerCase(),
        property_id: mortgageData.propertyId,
        property_name: property.name,
        property_location: property.location,
        image_url: property.image,
        purchase_price: propertyValueUSD,
        down_payment: downPaymentUSD,
        current_value: propertyValueUSD,
        monthly_payment: monthlyPaymentUSD,
        remaining_balance: loanAmountUSD,
        equity_percentage: (downPaymentUSD / propertyValueUSD) * 100,
        currency: 'AVAX-18',
        mortgage_id: `${mortgageData.transactionHash}-${mortgageData.tokenId}`,
        unique_purchase_key: `${mortgageData.borrower.toLowerCase()}-${mortgageData.propertyId}-${mortgageData.tokenId}`,
        purchase_price_base: parseInt(mortgageData.propertyValue),
        down_payment_base: parseInt(mortgageData.downPayment),
        loan_amount_base: parseInt(mortgageData.loanAmount),
        apr_bps: mortgageData.interestRate * 100, // Convert percentage to basis points
        term_months: mortgageData.termMonths,
        is_active: true
      });

      if (error) {
        console.error('❌ Database sync error:', error);
        throw error;
      }

      console.log('✅ Mortgage synced to database:', mortgageData.borrower);
    } catch (error) {
      console.error('❌ Failed to sync mortgage:', error);
      throw error;
    }
  }

  async startEventListener(): Promise<void> {
    if (this.isBaseSepolia) {
      console.log('⚠️ startEventListener skipped - on Base Sepolia');
      return;
    }
    
    if (this.isListening) {
      console.log('🔊 Event listener already running');
      return;
    }

    try {
      console.log('🔊 Starting blockchain event listener for Enhanced AVAX Mortgage');
      console.log('📋 Contract address:', CONTRACTS.SIMPLE_MORTGAGE.address);
      
      this.isListening = true;

      // Listen for MortgageCreated events
      this.contract.on('MortgageCreated', async (
        borrower: string,
        propertyId: bigint,
        tokenId: bigint,
        propertyValue: bigint,
        downPayment: bigint,
        loanAmount: bigint,
        monthlyPayment: bigint,
        event: any
      ) => {
        console.log('🏠 MortgageCreated event detected:', {
          borrower,
          propertyId: propertyId.toString(),
          tokenId: tokenId.toString(),
          propertyValue: ethers.formatEther(propertyValue),
          downPayment: ethers.formatEther(downPayment),
          loanAmount: ethers.formatEther(loanAmount),
          monthlyPayment: ethers.formatEther(monthlyPayment)
        });

        try {
          const mortgageData: MortgageData = {
            borrower,
            propertyId: Number(propertyId),
            tokenId: Number(tokenId),
            propertyValue: propertyValue.toString(),
            downPayment: downPayment.toString(),
            loanAmount: loanAmount.toString(),
            monthlyPayment: monthlyPayment.toString(),
            termMonths: 120, // Default 10 years
            interestRate: 8, // 8% APR
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
            createdAt: new Date()
          };

          await this.syncMortgageCreation(mortgageData);
          
          console.log('✅ Event processed and synced to database');
        } catch (syncError) {
          console.error('❌ Failed to sync mortgage from event:', syncError);
        }
      });

      // Listen for PaymentMade events for existing mortgages
      this.contract.on('PaymentMade', async (
        borrower: string,
        propertyId: bigint,
        paymentAmount: bigint,
        principalPaid: bigint,
        interestPaid: bigint,
        remainingBalance: bigint,
        event: any
      ) => {
        console.log('💰 PaymentMade event detected:', {
          borrower,
          propertyId: propertyId.toString(),
          paymentAmount: ethers.formatEther(paymentAmount),
          principalPaid: ethers.formatEther(principalPaid),
          interestPaid: ethers.formatEther(interestPaid),
          remainingBalance: ethers.formatEther(remainingBalance)
        });

        try {
          // Update user_properties with payment info
          const { error } = await supabase
            .from('user_properties')
            .update({
            principal_paid_base: parseInt(principalPaid.toString()),
            interest_paid_base: parseInt(interestPaid.toString()),
              remaining_balance: parseFloat(ethers.formatEther(remainingBalance)) * 100000000,
              updated_at: new Date().toISOString()
            })
            .eq('user_address', borrower.toLowerCase())
            .eq('property_id', Number(propertyId));

          if (error) {
            console.error('❌ Failed to update payment:', error);
          } else {
            console.log('✅ Payment updated in database');
          }
        } catch (error) {
          console.error('❌ Failed to process payment event:', error);
        }
      });

      console.log('✅ Event listeners successfully set up');
    } catch (error) {
      console.error('❌ Failed to start event listener:', error);
      this.isListening = false;
    }
  }

  stopEventListener(): void {
    if (this.isListening) {
      this.contract.removeAllListeners();
      this.isListening = false;
      console.log('🛑 Event listeners stopped');
    }
  }
}

export const blockchainSync = new BlockchainSync();