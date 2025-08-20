
import { ethers } from 'ethers';
import { CONTRACTS, NETWORK_CONFIG, VILLAGE_CITIZENSHIP_FEE } from '@/lib/contracts';
import { NETWORK_CONFIG as CHAIN_CONFIG } from '@/config/chain';
import { fetchRealContractAddresses } from './contract-integration';

export class Web3Integration {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contracts: { [key: string]: ethers.Contract } = {};
  private realAddresses: Record<string, string> = {};
  private readonly ZERO = '0x0000000000000000000000000000000000000000';

  private ensureAddressConfigured(address: string, name: string) {
    if (!address || address.toLowerCase() === this.ZERO) {
      throw new Error(`${name} contract not configured. Please set a deployed address.`);
    }
  }

  async initialize(): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    await this.switchToAvalanche();
    this.signer = await this.provider.getSigner();
    console.log('✅ Wallet connected, contracts will be initialized on-demand');
  }

  private async switchToAvalanche(): Promise<void> {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAIN_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [CHAIN_CONFIG],
        });
      } else {
        throw switchError;
      }
    }
  }

  private async getContract(contractName: keyof typeof CONTRACTS): Promise<ethers.Contract> {
    if (!this.signer) throw new Error('Signer not initialized');

    // Always fetch fresh addresses from database
    const { clearContractCache } = await import('./contract-integration');
    clearContractCache();
    
    console.log(`🔍 Getting fresh contract address for ${contractName}...`);
    const freshAddresses = await fetchRealContractAddresses();
    
    // Get the address key (convert contract name to address key)
    const addressKey = contractName.replace('_', '_').toUpperCase();
    const contractAddress = freshAddresses[addressKey];
    
    // Critical validation - prevent fallback address usage
    if (contractName === 'VILLAGE_CITIZENSHIP') {
      if (!contractAddress || contractAddress === '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0') {
        throw new Error(`CRITICAL: Cannot use fallback address for ${contractName}. Expected database address: 0x8f8d4b2b8d4f4a9b8d4f4a9b8d4f4a9b8d4f4a9b, got: ${contractAddress}`);
      }
    }
    
    this.ensureAddressConfigured(contractAddress, contractName);
    
    console.log(`✅ Creating fresh contract instance for ${contractName} at ${contractAddress}`);
    
    return new ethers.Contract(
      contractAddress,
      CONTRACTS[contractName].abi,
      this.signer
    );
  }

  async getAccount(): Promise<string> {
    if (!this.signer) throw new Error('Wallet not connected');
    return await this.signer.getAddress();
  }

  async getUSDTBalance(account: string): Promise<string> {
    const usdtContract = await this.getContract('USDT');
    const balance = await usdtContract.balanceOf(account);
    return ethers.formatUnits(balance, 6); // USDT has 6 decimals
  }

  async approveUSDT(spender: string, amount: string): Promise<ethers.ContractTransactionResponse> {
    const usdtContract = await this.getContract('USDT');
    const amountWei = ethers.parseUnits(amount, 6);
    return await usdtContract.approve(spender, amountWei);
  }

  async checkUSDTAllowance(owner: string, spender: string): Promise<string> {
    const usdtContract = await this.getContract('USDT');
    const allowance = await usdtContract.allowance(owner, spender);
    return ethers.formatUnits(allowance, 6);
  }

  async purchaseProperty(downPayment: number): Promise<{
    transaction: ethers.ContractTransactionResponse;
    mortgageId: string;
  }> {
    const account = await this.getAccount();
    const downPaymentUSDT = (downPayment * 1e6).toString(); // Convert to USDT units
    
    // Get fresh contract instances
    const mortgageContract = await this.getContract('MAZUNTE_MORTGAGE');
    const mortgageAddress = mortgageContract.target as string;

    // Check USDT balance
    const balance = await this.getUSDTBalance(account);
    if (parseFloat(balance) < downPayment) {
      throw new Error(`Insufficient USDT balance. Required: ${downPayment}, Available: ${balance}`);
    }

    // Check and approve USDT allowance
    const allowance = await this.checkUSDTAllowance(account, mortgageAddress);
    if (parseFloat(allowance) < downPayment) {
      const approveTx = await this.approveUSDT(mortgageAddress, downPaymentUSDT);
      await approveTx.wait();
    }

    // Purchase property
    const tx = await mortgageContract.purchaseProperty(downPaymentUSDT);
    const receipt = await tx.wait();
    
    // Extract mortgage ID from events
    const mortgageCreatedEvent = receipt.logs.find((log: any) => 
      log.fragment?.name === 'MortgageCreated'
    );
    const mortgageId = mortgageCreatedEvent?.args?.[1]?.toString() || '0';

    return { transaction: tx, mortgageId };
  }

  async sendPlatformFee(feeAmount: number): Promise<ethers.ContractTransactionResponse> {
    const account = await this.getAccount();
    const feeAmountUSDT = (feeAmount * 1e6).toString(); // Convert to USDT units
    
    // Get fresh contract instances
    const usdtContract = await this.getContract('USDT');
    
    // Get real contract addresses including platform treasury
    const realContracts = await fetchRealContractAddresses();
    const PLATFORM_TREASURY = realContracts.PLATFORM_TREASURY;

    // Check USDT balance
    const balance = await this.getUSDTBalance(account);
    if (parseFloat(balance) < feeAmount) {
      throw new Error(`Insufficient USDT balance for platform fee. Required: ${feeAmount}, Available: ${balance}`);
    }

    // Transfer platform fee to treasury
    const tx = await usdtContract.transfer(PLATFORM_TREASURY, feeAmountUSDT);
    await tx.wait();
    
    return tx;
  }


  async makePayment(): Promise<ethers.ContractTransactionResponse> {
    const account = await this.getAccount();
    
    // Get mortgage details to determine payment amount
    const mortgageDetails = await this.getMortgageDetails(account);
    const monthlyPayment = parseFloat(ethers.formatUnits(mortgageDetails.monthlyPayment, 6));
    
    // Get fresh contract instances
    const mortgageContract = await this.getContract('MAZUNTE_MORTGAGE');
    const mortgageAddress = mortgageContract.target as string;
    
    // Check USDT balance
    const balance = await this.getUSDTBalance(account);
    if (parseFloat(balance) < monthlyPayment) {
      throw new Error(`Insufficient USDT balance for payment. Required: ${monthlyPayment}, Available: ${balance}`);
    }

    // Check and approve USDT allowance
    const allowance = await this.checkUSDTAllowance(account, mortgageAddress);
    if (parseFloat(allowance) < monthlyPayment) {
      const paymentUSDT = (monthlyPayment * 1e6).toString();
      const approveTx = await this.approveUSDT(mortgageAddress, paymentUSDT);
      await approveTx.wait();
    }

    return await mortgageContract.makePayment();
  }

  async getMortgageDetails(account: string): Promise<{
    downPayment: bigint;
    principalAmount: bigint;
    monthlyPayment: bigint;
    remainingBalance: bigint;
    nextPaymentDue: bigint;
    missedPayments: bigint;
    totalPaid: bigint;
    totalLateFees: bigint;
    mortgageId: bigint;
    isActive: boolean;
    isForeclosed: boolean;
    isCompleted: boolean;
    coolingOffActive: boolean;
  }> {
    const mortgageContract = await this.getContract('MAZUNTE_MORTGAGE');
    return await mortgageContract.getMortgageDetails(account);
  }

  async getPropertyStatus(): Promise<{
    totalValue: bigint;
    currentValue: bigint;
    totalDownPayments: bigint;
    appreciationValue: bigint;
    totalRentalIncomeGenerated: bigint;
    fullyOwned: boolean;
  }> {
    const mortgageContract = await this.getContract('MAZUNTE_MORTGAGE');
    return await mortgageContract.getPropertyStatus();
  }

  async getPaymentSchedule(account: string): Promise<Array<{
    paymentNumber: bigint;
    principalAmount: bigint;
    interestAmount: bigint;
    remainingBalance: bigint;
    dueDate: bigint;
    isPaid: boolean;
  }>> {
    const mortgageContract = await this.getContract('MAZUNTE_MORTGAGE');
    return await mortgageContract.getPaymentSchedule(account);
  }

  async isPaymentOverdue(account: string): Promise<boolean> {
    const mortgageContract = await this.getContract('MAZUNTE_MORTGAGE');
    return await mortgageContract.isPaymentOverdue(account);
  }

  async joinVillage(): Promise<ethers.ContractTransactionResponse> {
    console.log('🏛️ Getting fresh VillageCitizenship contract...');
    
    // Get fresh contract instance with validated address
    const villageContract = await this.getContract('VILLAGE_CITIZENSHIP');
    
    console.log('✅ Using verified contract address:', villageContract.target);
    
    const feeInWei = ethers.parseEther(VILLAGE_CITIZENSHIP_FEE);
    return await villageContract.becomeCitizen({ value: feeInWei });
  }

  async checkVillageMembership(account: string): Promise<boolean> {
    const villageContract = await this.getContract('VILLAGE_CITIZENSHIP');
    return await villageContract.hasCitizenship(account);
  }

  async cancelDuringCoolingOff(): Promise<ethers.ContractTransactionResponse> {
    const mortgageContract = await this.getContract('MAZUNTE_MORTGAGE');
    return await mortgageContract.cancelDuringCoolingOff();
  }

  async activateMortgage(): Promise<ethers.ContractTransactionResponse> {
    const mortgageContract = await this.getContract('MAZUNTE_MORTGAGE');
    return await mortgageContract.confirmMortgageActivation();
  }

  // Secondary Marketplace functions
  async createPool(
    propertyToken: string,
    tokenId: number,
    baseToken: string,
    feeRate: number,
    priceImpactThreshold: number
  ): Promise<ethers.ContractTransactionResponse> {
    const marketplaceContract = await this.getContract('SECONDARY_MARKETPLACE');
    return await marketplaceContract.createPool(
      propertyToken,
      tokenId,
      baseToken,
      feeRate,
      priceImpactThreshold
    );
  }

  async addLiquidity(
    poolId: number,
    propertyAmount: string,
    baseAmount: string
  ): Promise<ethers.ContractTransactionResponse> {
    const marketplaceContract = await this.getContract('SECONDARY_MARKETPLACE');
    return await marketplaceContract.addLiquidity(
      poolId,
      ethers.parseUnits(propertyAmount, 18),
      ethers.parseUnits(baseAmount, 6)
    );
  }

  async swapTokens(
    poolId: number,
    propertyToBase: boolean,
    amountIn: string,
    minAmountOut: string
  ): Promise<ethers.ContractTransactionResponse> {
    const marketplaceContract = await this.getContract('SECONDARY_MARKETPLACE');
    return await marketplaceContract.swapTokens(
      poolId,
      propertyToBase,
      ethers.parseUnits(amountIn, propertyToBase ? 18 : 6),
      ethers.parseUnits(minAmountOut, propertyToBase ? 6 : 18)
    );
  }

  async getCurrentPrice(poolId: number): Promise<string> {
    const marketplaceContract = await this.getContract('SECONDARY_MARKETPLACE');
    const price = await marketplaceContract.getCurrentPrice(poolId);
    return ethers.formatUnits(price, 18);
  }

  async getUserLPTokens(poolId: number, user: string): Promise<string> {
    const marketplaceContract = await this.getContract('SECONDARY_MARKETPLACE');
    const tokens = await marketplaceContract.getUserLPTokens(poolId, user);
    return ethers.formatUnits(tokens, 18);
  }

  // Event listeners - Note: These will create fresh contract instances each time
  async onMortgageCreated(callback: (buyer: string, mortgageId: string, downPayment: bigint, monthlyPayment: bigint) => void): Promise<void> {
    const mortgageContract = await this.getContract('MAZUNTE_MORTGAGE');
    mortgageContract.on('MortgageCreated', callback);
  }

  async onPaymentMade(callback: (buyer: string, amount: bigint, principalPaid: bigint, interestPaid: bigint, remainingBalance: bigint) => void): Promise<void> {
    const mortgageContract = await this.getContract('MAZUNTE_MORTGAGE');
    mortgageContract.on('PaymentMade', callback);
  }

  async onMortgageCompleted(callback: (buyer: string, totalPaid: bigint) => void): Promise<void> {
    const mortgageContract = await this.getContract('MAZUNTE_MORTGAGE');
    mortgageContract.on('MortgageCompleted', callback);
  }

  removeAllListeners(): void {
    // Since we no longer cache contracts, this method is simplified
    // Event listeners would need to be managed differently with lazy loading
    console.log('Event listeners cleared (lazy loading mode)');
  }

  formatUSDT(amount: bigint): string {
    return ethers.formatUnits(amount, 6);
  }

  formatAVAX(amount: bigint): string {
    return ethers.formatEther(amount);
  }

  parseUSDT(amount: string): bigint {
    return ethers.parseUnits(amount, 6);
  }

  parseAVAX(amount: string): bigint {
    return ethers.parseEther(amount);
  }
}

export const web3Integration = new Web3Integration();
