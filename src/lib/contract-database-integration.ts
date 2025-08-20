import { supabase } from '@/integrations/supabase/client';

export interface ContractAddress {
  contract_name: string;
  address: string;
  network: string;
  deployment_status: string;
}

export class ContractDatabaseIntegration {
  private static contractCache: Record<string, string> = {};
  private static lastCacheUpdate = 0;
  private static CACHE_TTL = 30000; // 30 seconds

  static async getContractAddress(contractName: string, network: string = 'fuji'): Promise<string> {
    const cacheKey = `${contractName}_${network}`;
    const now = Date.now();

    // Return cached address if still valid
    if (this.contractCache[cacheKey] && (now - this.lastCacheUpdate) < this.CACHE_TTL) {
      return this.contractCache[cacheKey];
    }

    try {
      const { data, error } = await supabase
        .from('contract_addresses')
        .select('address')
        .eq('contract_name', contractName)
        .eq('network', network)
        .eq('deployment_status', 'deployed')
        .single();

      if (error) {
        console.error(`Failed to fetch ${contractName} address:`, error);
        return '';
      }

      // Cache the result
      this.contractCache[cacheKey] = data.address;
      this.lastCacheUpdate = now;

      return data.address;
    } catch (error) {
      console.error(`Database error fetching ${contractName}:`, error);
      return '';
    }
  }

  static async getAllContractAddresses(network: string = 'fuji'): Promise<Record<string, string>> {
    try {
      const { data, error } = await supabase
        .from('contract_addresses')
        .select('contract_name, address')
        .eq('network', network)
        .eq('deployment_status', 'deployed');

      if (error) {
        console.error('Failed to fetch contract addresses:', error);
        return {};
      }

      const contracts: Record<string, string> = {};
      data.forEach(contract => {
        contracts[contract.contract_name] = contract.address;
      });

      return contracts;
    } catch (error) {
      console.error('Database error fetching all contracts:', error);
      return {};
    }
  }

  static async updateContractAddress(
    contractName: string, 
    address: string, 
    network: string = 'fuji',
    txHash?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contract_addresses')
        .upsert({
          contract_name: contractName,
          address,
          network,
          deployment_status: 'deployed',
          deployment_tx_hash: txHash,
          deployed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'contract_name,network'
        });

      if (error) {
        console.error(`Failed to update ${contractName} address:`, error);
        return false;
      }

      // Clear cache to force refresh
      this.contractCache = {};
      return true;
    } catch (error) {
      console.error(`Database error updating ${contractName}:`, error);
      return false;
    }
  }

  static clearCache(): void {
    this.contractCache = {};
    this.lastCacheUpdate = 0;
  }
}