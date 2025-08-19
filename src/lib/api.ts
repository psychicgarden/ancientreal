// Centralized API layer with typed helpers and error handling
import { supabase } from '@/integrations/supabase/client';
import { logger } from './logger';

// Simple API Response types
export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Supabase query helpers
export class SupabaseApi {
  // Properties API
  static async getUserProperties(userId: string): Promise<ApiResponse> {
    try {
      logger.debug('Getting user properties', { userId }, 'SupabaseApi');
      
      const { data, error } = await supabase
        .from('user_properties')
        .select('*')
        .eq('user_wallet_address', userId);
      
      if (error) {
        logger.error('Failed to get user properties', error, 'SupabaseApi');
        return { data: null, error: error.message, success: false };
      }
      
      return { data, error: null, success: true };
    } catch (error: any) {
      logger.error('Exception in getUserProperties', error, 'SupabaseApi');
      return { data: null, error: error.message || 'Unknown error', success: false };
    }
  }

  static async getFractionalInvestments(userId: string): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('fractional_investments')
        .select('*')
        .eq('investor_wallet_address', userId);
      
      if (error) {
        return { data: null, error: error.message, success: false };
      }
      
      return { data, error: null, success: true };
    } catch (error: any) {
      return { data: null, error: error.message || 'Unknown error', success: false };
    }
  }

  static async createFractionalInvestment(investment: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('fractional_investments')
        .insert(investment)
        .select()
        .single();
      
      if (error) {
        return { data: null, error: error.message, success: false };
      }
      
      return { data, error: null, success: true };
    } catch (error: any) {
      return { data: null, error: error.message || 'Unknown error', success: false };
    }
  }

  // Staking API
  static async getUserStaking(userId: string): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('user_staking')
        .select('*')
        .eq('user_wallet_address', userId);
      
      if (error) {
        return { data: null, error: error.message, success: false };
      }
      
      return { data, error: null, success: true };
    } catch (error: any) {
      return { data: null, error: error.message || 'Unknown error', success: false };
    }
  }

  static async createStakingTransaction(transaction: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('staking_transactions')
        .insert(transaction)
        .select()
        .single();
      
      if (error) {
        return { data: null, error: error.message, success: false };
      }
      
      return { data, error: null, success: true };
    } catch (error: any) {
      return { data: null, error: error.message || 'Unknown error', success: false };
    }
  }

  // Projects API
  static async getDeveloperProjects(): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('developer_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        return { data: null, error: error.message, success: false };
      }
      
      return { data, error: null, success: true };
    } catch (error: any) {
      return { data: null, error: error.message || 'Unknown error', success: false };
    }
  }

  static async createDeveloperInvestment(investment: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('developer_investments')
        .insert(investment)
        .select()
        .single();
      
      if (error) {
        return { data: null, error: error.message, success: false };
      }
      
      return { data, error: null, success: true };
    } catch (error: any) {
      return { data: null, error: error.message || 'Unknown error', success: false };
    }
  }

  // Transactions API
  static async createTransaction(transaction: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('user_transactions')
        .insert(transaction)
        .select()
        .single();
      
      if (error) {
        return { data: null, error: error.message, success: false };
      }
      
      return { data, error: null, success: true };
    } catch (error: any) {
      return { data: null, error: error.message || 'Unknown error', success: false };
    }
  }

  static async getUserTransactions(userId: string): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('user_transactions')
        .select('*')
        .eq('user_wallet_address', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        return { data: null, error: error.message, success: false };
      }
      
      return { data, error: null, success: true };
    } catch (error: any) {
      return { data: null, error: error.message || 'Unknown error', success: false };
    }
  }
}

// Edge Functions API
export class EdgeFunctionsApi {
  static async invokeChatbot(prompt: string, context?: any): Promise<ApiResponse> {
    try {
      logger.debug('Invoking chatbot function', { prompt, context }, 'EdgeFunctions');
      
      const { data, error } = await supabase.functions.invoke('chatbot-assistant', {
        body: { prompt, context }
      });
      
      if (error) {
        return { data: null, error: error.message, success: false };
      }
      
      return { data, error: null, success: true };
    } catch (error: any) {
      return { data: null, error: error.message || 'Unknown error', success: false };
    }
  }
}

// Storage API
export class StorageApi {
  static async uploadFile(bucket: string, path: string, file: File): Promise<ApiResponse> {
    try {
      logger.debug('Uploading file', { bucket, path, fileName: file.name }, 'Storage');
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);
      
      if (error) {
        return { data: null, error: error.message, success: false };
      }
      
      return { data, error: null, success: true };
    } catch (error: any) {
      return { data: null, error: error.message || 'Unknown error', success: false };
    }
  }
}

// Export all APIs
export const api = {
  supabase: SupabaseApi,
  functions: EdgeFunctionsApi,
  storage: StorageApi
};