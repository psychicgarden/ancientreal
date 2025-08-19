import { ethers } from 'ethers';
import { validateWalletAddress, validateTransactionHash } from './security-utils';

export class WalletSecurity {
  // Verify wallet signature for authentication
  static async verifyWalletSignature(
    message: string,
    signature: string,
    expectedAddress: string
  ): Promise<boolean> {
    try {
      if (!validateWalletAddress(expectedAddress)) {
        throw new Error('Invalid wallet address format');
      }

      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  // Generate secure message for signing
  static generateAuthMessage(walletAddress: string, timestamp: number): string {
    const nonce = Math.random().toString(36).substring(2, 15);
    return `Authenticate wallet ${walletAddress} at ${timestamp} with nonce ${nonce}`;
  }

  // Validate transaction parameters before sending
  static validateTransaction(transaction: {
    to?: string;
    value?: string;
    data?: string;
    gasLimit?: string;
    gasPrice?: string;
  }): boolean {
    try {
      // Validate recipient address
      if (transaction.to && !validateWalletAddress(transaction.to)) {
        throw new Error('Invalid recipient address');
      }

      // Validate value (must be valid number)
      if (transaction.value && isNaN(Number(transaction.value))) {
        throw new Error('Invalid transaction value');
      }

      // Validate gas parameters
      if (transaction.gasLimit && isNaN(Number(transaction.gasLimit))) {
        throw new Error('Invalid gas limit');
      }

      if (transaction.gasPrice && isNaN(Number(transaction.gasPrice))) {
        throw new Error('Invalid gas price');
      }

      // Basic sanity checks
      const value = Number(transaction.value || 0);
      const gasLimit = Number(transaction.gasLimit || 21000);
      const gasPrice = Number(transaction.gasPrice || 0);

      if (value < 0 || gasLimit < 21000 || gasPrice < 0) {
        throw new Error('Invalid transaction parameters');
      }

      return true;
    } catch (error) {
      console.error('Transaction validation failed:', error);
      return false;
    }
  }

  // Secure transaction hash verification
  static validateTransactionResult(hash: string): boolean {
    return validateTransactionHash(hash);
  }

  // Check if wallet is connected to correct network
  static async validateNetwork(expectedChainId: number): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const currentChainId = parseInt(chainId, 16);
        return currentChainId === expectedChainId;
      }
      return false;
    } catch (error) {
      console.error('Network validation failed:', error);
      return false;
    }
  }

  // Secure contract interaction validation
  static validateContractCall(
    contractAddress: string,
    methodName: string,
    params: any[]
  ): boolean {
    try {
      // Validate contract address
      if (!validateWalletAddress(contractAddress)) {
        throw new Error('Invalid contract address');
      }

      // Validate method name (basic XSS protection)
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(methodName)) {
        throw new Error('Invalid method name');
      }

      // Validate parameters
      if (!Array.isArray(params)) {
        throw new Error('Invalid parameters');
      }

      // Check for potentially dangerous parameters
      params.forEach((param, index) => {
        if (typeof param === 'string' && param.includes('<script')) {
          throw new Error(`Dangerous parameter at index ${index}`);
        }
      });

      return true;
    } catch (error) {
      console.error('Contract call validation failed:', error);
      return false;
    }
  }

  // Secure balance validation
  static validateBalance(balance: string, requiredAmount: string): boolean {
    try {
      const balanceNum = Number(balance);
      const requiredNum = Number(requiredAmount);

      if (isNaN(balanceNum) || isNaN(requiredNum)) {
        return false;
      }

      return balanceNum >= requiredNum;
    } catch (error) {
      console.error('Balance validation failed:', error);
      return false;
    }
  }
}

// Wallet connection security wrapper
export class SecureWalletConnection {
  private static instance: SecureWalletConnection;
  private connectionAttempts = 0;
  private lastAttempt = 0;
  private readonly maxAttempts = 5;
  private readonly cooldownMs = 30000; // 30 seconds

  static getInstance(): SecureWalletConnection {
    if (!SecureWalletConnection.instance) {
      SecureWalletConnection.instance = new SecureWalletConnection();
    }
    return SecureWalletConnection.instance;
  }

  async secureConnect(): Promise<string | null> {
    const now = Date.now();

    // Rate limiting
    if (this.connectionAttempts >= this.maxAttempts) {
      if (now - this.lastAttempt < this.cooldownMs) {
        throw new Error('Too many connection attempts. Please wait before trying again.');
      }
      // Reset after cooldown
      this.connectionAttempts = 0;
    }

    this.connectionAttempts++;
    this.lastAttempt = now;

    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not detected');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      if (!validateWalletAddress(address)) {
        throw new Error('Invalid wallet address returned');
      }

      // Reset attempts on successful connection
      this.connectionAttempts = 0;
      return address;
    } catch (error) {
      console.error('Secure wallet connection failed:', error);
      throw error;
    }
  }

  resetAttempts(): void {
    this.connectionAttempts = 0;
  }
}