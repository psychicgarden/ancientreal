// Transaction management utilities with proper error handling
import { api, ApiResponse } from './api';
import { logger } from './logger';

export interface TransactionData {
  user_wallet_address: string;
  transaction_type: 'investment' | 'staking' | 'withdrawal' | 'payment' | 'fee';
  amount: number;
  currency: string;
  property_id?: string;
  project_id?: string;
  transaction_hash?: string;
  status: 'pending' | 'completed' | 'failed';
  metadata?: Record<string, any>;
}

export interface TransactionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export class TransactionManager {
  // Create transaction with validation
  static async createTransaction(transaction: TransactionData): Promise<TransactionResult> {
    try {
      // Validate required fields
      const validation = this.validateTransaction(transaction);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      logger.info('Creating transaction', {
        type: transaction.transaction_type,
        amount: transaction.amount,
        user: transaction.user_wallet_address
      }, 'TransactionManager');

      const response = await api.supabase.createTransaction({
        ...transaction,
        created_at: new Date().toISOString()
      });

      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to create transaction'
        };
      }

      logger.info('Transaction created successfully', {
        transactionId: (response.data as any)?.id
      }, 'TransactionManager');

      return {
        success: true,
        transactionId: (response.data as any)?.id
      };

    } catch (error) {
      logger.error('Transaction creation failed', error, 'TransactionManager');
      return {
        success: false,
        error: 'Failed to create transaction'
      };
    }
  }

  // Validate transaction data
  private static validateTransaction(transaction: TransactionData): { isValid: boolean; error?: string } {
    if (!transaction.user_wallet_address) {
      return { isValid: false, error: 'User wallet address is required' };
    }

    if (!transaction.transaction_type) {
      return { isValid: false, error: 'Transaction type is required' };
    }

    if (!transaction.amount || transaction.amount <= 0) {
      return { isValid: false, error: 'Amount must be greater than 0' };
    }

    if (!transaction.currency) {
      return { isValid: false, error: 'Currency is required' };
    }

    const validTypes = ['investment', 'staking', 'withdrawal', 'payment', 'fee'];
    if (!validTypes.includes(transaction.transaction_type)) {
      return { isValid: false, error: 'Invalid transaction type' };
    }

    const validStatuses = ['pending', 'completed', 'failed'];
    if (!validStatuses.includes(transaction.status)) {
      return { isValid: false, error: 'Invalid transaction status' };
    }

    return { isValid: true };
  }

  // Create investment transaction
  static async createInvestmentTransaction(
    userAddress: string,
    amount: number,
    propertyId?: string,
    projectId?: string,
    transactionHash?: string
  ): Promise<TransactionResult> {
    return this.createTransaction({
      user_wallet_address: userAddress,
      transaction_type: 'investment',
      amount,
      currency: 'USDT',
      property_id: propertyId,
      project_id: projectId,
      transaction_hash: transactionHash,
      status: transactionHash ? 'completed' : 'pending',
      metadata: {
        created_via: 'platform',
        blockchain_confirmed: !!transactionHash
      }
    });
  }

  // Create staking transaction
  static async createStakingTransaction(
    userAddress: string,
    amount: number,
    action: 'stake' | 'unstake',
    transactionHash?: string
  ): Promise<TransactionResult> {
    return this.createTransaction({
      user_wallet_address: userAddress,
      transaction_type: 'staking',
      amount,
      currency: 'USDT',
      transaction_hash: transactionHash,
      status: transactionHash ? 'completed' : 'pending',
      metadata: {
        action,
        created_via: 'platform',
        blockchain_confirmed: !!transactionHash
      }
    });
  }

  // Create platform fee transaction
  static async createPlatformFeeTransaction(
    userAddress: string,
    amount: number,
    feeType: string,
    relatedTransactionId?: string
  ): Promise<TransactionResult> {
    return this.createTransaction({
      user_wallet_address: userAddress,
      transaction_type: 'fee',
      amount,
      currency: 'USDT',
      status: 'completed',
      metadata: {
        fee_type: feeType,
        related_transaction: relatedTransactionId,
        created_via: 'platform'
      }
    });
  }

  // Get user transaction history
  static async getUserTransactionHistory(userAddress: string): Promise<ApiResponse> {
    logger.debug('Fetching transaction history', { userAddress }, 'TransactionManager');
    return api.supabase.getUserTransactions(userAddress);
  }
}

export { TransactionManager as transactionManager };