// Contract Guard - Validates chain vs address compatibility
import { ethers } from 'ethers';
import { ANCIENT_MORTGAGE_ETH_ADDRESS } from '@/lib/abis/ancient-mortgage-eth-abi';

export interface ContractGuardResult {
  isValid: boolean;
  error?: string;
  chainId?: bigint;
  expectedChainId?: bigint;
}

export async function validateContractCall(
  contractAddress: string,
  abiName: string,
  expectedChainId?: bigint
): Promise<ContractGuardResult> {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      return {
        isValid: false,
        error: 'No wallet connection available'
      };
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const chainId = network.chainId;

    // Define known contract addresses and their expected chains
    const contractChains: Record<string, bigint> = {
      [ANCIENT_MORTGAGE_ETH_ADDRESS]: 84532n, // Base Sepolia
      '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318': 43113n, // Avalanche Fuji (SimpleMortgage)
    };

    // Check if this contract address is known
    const expectedChain = contractChains[contractAddress];
    
    if (expectedChain) {
      if (chainId !== expectedChain) {
        return {
          isValid: false,
          error: `Contract ${contractAddress} (${abiName}) expects chain ${expectedChain}, but wallet is on ${chainId}`,
          chainId,
          expectedChainId: expectedChain
        };
      }
    }

    // If we have an expected chain ID parameter, validate against it
    if (expectedChainId && chainId !== expectedChainId) {
      return {
        isValid: false,
        error: `Expected chain ${expectedChainId}, but wallet is on ${chainId}`,
        chainId,
        expectedChainId
      };
    }

    return {
      isValid: true,
      chainId
    };

  } catch (error) {
    return {
      isValid: false,
      error: `Failed to validate contract call: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export function logContractCall(
  contractAddress: string,
  abiName: string,
  chainId: bigint,
  isValid: boolean
): void {
  const status = isValid ? '✅' : '❌';
  console.log(`${status} Contract Call Validation:`);
  console.log(`  ABI: ${abiName}`);
  console.log(`  Address: ${contractAddress}`);
  console.log(`  Chain: ${chainId}`);
  console.log(`  Valid: ${isValid}`);
}

export async function createValidatedContract<T extends ethers.BaseContract>(
  contractAddress: string,
  abi: any,
  signer: ethers.Signer,
  abiName: string = 'Unknown'
): Promise<T> {
  const validation = await validateContractCall(contractAddress, abiName);
  
  logContractCall(contractAddress, abiName, validation.chainId!, validation.isValid);
  
  if (!validation.isValid) {
    throw new Error(`Contract validation failed: ${validation.error}`);
  }

  return new ethers.Contract(contractAddress, abi, signer) as T;
}
