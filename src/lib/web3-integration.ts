
import { ethers } from 'ethers';
import { CONTRACTS, NETWORK_CONFIG, VILLAGE_CITIZENSHIP_FEE } from '@/lib/contracts';

export class Web3Integration {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contracts: { [key: string]: ethers.Contract } = {};
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
    this.initializeContracts();
  }

  private async switchToAvalanche(): Promise<void> {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [NETWORK_CONFIG],
        });
      } else {
        throw switchError;
      }
    }
  }

  private initializeContracts(): void {
    if (!this.signer) throw new Error('Signer not initialized');

    this.contracts.mazunteMortgage = new ethers.Contract(
      CONTRACTS.MAZUNTE_MORTGAGE.address,
      CONTRACTS.MAZUNTE_MORTGAGE.abi,
      this.signer
    );

    this.contracts.usdt = new ethers.Contract(
      CONTRACTS.USDT.address,
      CONTRACTS.USDT.abi,
      this.signer
    );

    this.contracts.villageCitizenship = new ethers.Contract(
      CONTRACTS.VILLAGE_CITIZENSHIP.address,
      CONTRACTS.VILLAGE_CITIZENSHIP.abi,
      this.signer
    );

    this.contracts.secondaryMarketplace = new ethers.Contract(
      CONTRACTS.SECONDARY_MARKETPLACE.address,
      CONTRACTS.SECONDARY_MARKETPLACE.abi,
      this.signer
    );
  }

  async getAccount(): Promise<string> {
    if (!this.signer) throw new Error('Wallet not connected');
    return await this.signer.getAddress();
  }

  async getUSDTBalance(account: string): Promise<string> {
    this.ensureAddressConfigured(CONTRACTS.USDT.address, 'USDT');
    const balance = await this.contracts.usdt.balanceOf(account);
    return ethers.formatUnits(balance, 6); // USDT has 6 decimals
  }

  async approveUSDT(spender: string, amount: string): Promise<ethers.ContractTransactionResponse> {
    this.ensureAddressConfigured(CONTRACTS.USDT.address, 'USDT');
    const amountWei = ethers.parseUnits(amount, 6);
    return await this.contracts.usdt.approve(spender, amountWei);
  }

  async checkUSDTAllowance(owner: string, spender: string): Promise<string> {
    this.ensureAddressConfigured(CONTRACTS.USDT.address, 'USDT');
    const allowance = await this.contracts.usdt.allowance(owner, spender);
    return ethers.formatUnits(allowance, 6);
  }

  async purchaseProperty(downPayment: number): Promise<{
    transaction: ethers.ContractTransactionResponse;
    mortgageId: string;
  }> {
    const account = await this.getAccount();
    const downPaymentUSDT = (downPayment * 1e6).toString(); // Convert to USDT units
    // Ensure contracts are configured
    this.ensureAddressConfigured(CONTRACTS.MAZUNTE_MORTGAGE.address, 'MazunteMortgage');
    this.ensureAddressConfigured(CONTRACTS.USDT.address, 'USDT');

    // Check USDT balance
    const balance = await this.getUSDTBalance(account);
    if (parseFloat(balance) < downPayment) {
      throw new Error(`Insufficient USDT balance. Required: ${downPayment}, Available: ${balance}`);
    }

    // Check and approve USDT allowance
    const allowance = await this.checkUSDTAllowance(account, CONTRACTS.MAZUNTE_MORTGAGE.address);
    if (parseFloat(allowance) < downPayment) {
      const approveTx = await this.approveUSDT(CONTRACTS.MAZUNTE_MORTGAGE.address, downPaymentUSDT);
      await approveTx.wait();
    }

    // Purchase property
    const tx = await this.contracts.mazunteMortgage.purchaseProperty(downPaymentUSDT);
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
    
    // Platform treasury address (you should configure this)
    const PLATFORM_TREASURY = "0x742d35Cc6670C068fC0DB3674fE6c61c2B3d2a0B"; // Replace with actual treasury address
    
    // Ensure contracts are configured
    this.ensureAddressConfigured(CONTRACTS.USDT.address, 'USDT');

    // Check USDT balance
    const balance = await this.getUSDTBalance(account);
    if (parseFloat(balance) < feeAmount) {
      throw new Error(`Insufficient USDT balance for platform fee. Required: ${feeAmount}, Available: ${balance}`);
    }

    // Transfer platform fee to treasury
    const tx = await this.contracts.usdt.transfer(PLATFORM_TREASURY, feeAmountUSDT);
    await tx.wait();
    
    return tx;
  }


  async makePayment(): Promise<ethers.ContractTransactionResponse> {
    const account = await this.getAccount();
    
    // Get mortgage details to determine payment amount
    const mortgageDetails = await this.getMortgageDetails(account);
    const monthlyPayment = parseFloat(ethers.formatUnits(mortgageDetails.monthlyPayment, 6));
    
    // Check USDT balance
    const balance = await this.getUSDTBalance(account);
    if (parseFloat(balance) < monthlyPayment) {
      throw new Error(`Insufficient USDT balance for payment. Required: ${monthlyPayment}, Available: ${balance}`);
    }

    // Check and approve USDT allowance
    const allowance = await this.checkUSDTAllowance(account, CONTRACTS.MAZUNTE_MORTGAGE.address);
    if (parseFloat(allowance) < monthlyPayment) {
      const paymentUSDT = (monthlyPayment * 1e6).toString();
      const approveTx = await this.approveUSDT(CONTRACTS.MAZUNTE_MORTGAGE.address, paymentUSDT);
      await approveTx.wait();
    }

    return await this.contracts.mazunteMortgage.makePayment();
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
    this.ensureAddressConfigured(CONTRACTS.MAZUNTE_MORTGAGE.address, 'MazunteMortgage');
    return await this.contracts.mazunteMortgage.getMortgageDetails(account);
  }

  async getPropertyStatus(): Promise<{
    totalValue: bigint;
    currentValue: bigint;
    totalDownPayments: bigint;
    appreciationValue: bigint;
    totalRentalIncomeGenerated: bigint;
    fullyOwned: boolean;
  }> {
    this.ensureAddressConfigured(CONTRACTS.MAZUNTE_MORTGAGE.address, 'MazunteMortgage');
    return await this.contracts.mazunteMortgage.getPropertyStatus();
  }

  async getPaymentSchedule(account: string): Promise<Array<{
    paymentNumber: bigint;
    principalAmount: bigint;
    interestAmount: bigint;
    remainingBalance: bigint;
    dueDate: bigint;
    isPaid: boolean;
  }>> {
    this.ensureAddressConfigured(CONTRACTS.MAZUNTE_MORTGAGE.address, 'MazunteMortgage');
    return await this.contracts.mazunteMortgage.getPaymentSchedule(account);
  }

  async isPaymentOverdue(account: string): Promise<boolean> {
    this.ensureAddressConfigured(CONTRACTS.MAZUNTE_MORTGAGE.address, 'MazunteMortgage');
    return await this.contracts.mazunteMortgage.isPaymentOverdue(account);
  }

  async joinVillage(): Promise<ethers.ContractTransactionResponse> {
    this.ensureAddressConfigured(CONTRACTS.VILLAGE_CITIZENSHIP.address, 'VillageCitizenship');
    const feeInWei = ethers.parseEther(VILLAGE_CITIZENSHIP_FEE);
    return await this.contracts.villageCitizenship.becomeCitizen({ value: feeInWei });
  }

  async checkVillageMembership(account: string): Promise<boolean> {
    this.ensureAddressConfigured(CONTRACTS.VILLAGE_CITIZENSHIP.address, 'VillageCitizenship');
    return await this.contracts.villageCitizenship.hasCitizenship(account);
  }

  async cancelDuringCoolingOff(): Promise<ethers.ContractTransactionResponse> {
    this.ensureAddressConfigured(CONTRACTS.MAZUNTE_MORTGAGE.address, 'MazunteMortgage');
    return await this.contracts.mazunteMortgage.cancelDuringCoolingOff();
  }

  async activateMortgage(): Promise<ethers.ContractTransactionResponse> {
    this.ensureAddressConfigured(CONTRACTS.MAZUNTE_MORTGAGE.address, 'MazunteMortgage');
    return await this.contracts.mazunteMortgage.confirmMortgageActivation();
  }

  // Secondary Marketplace functions
  async createPool(
    propertyToken: string,
    tokenId: number,
    baseToken: string,
    feeRate: number,
    priceImpactThreshold: number
  ): Promise<ethers.ContractTransactionResponse> {
    this.ensureAddressConfigured(CONTRACTS.SECONDARY_MARKETPLACE.address, 'SecondaryMarketplace');
    return await this.contracts.secondaryMarketplace.createPool(
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
    this.ensureAddressConfigured(CONTRACTS.SECONDARY_MARKETPLACE.address, 'SecondaryMarketplace');
    return await this.contracts.secondaryMarketplace.addLiquidity(
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
    this.ensureAddressConfigured(CONTRACTS.SECONDARY_MARKETPLACE.address, 'SecondaryMarketplace');
    return await this.contracts.secondaryMarketplace.swapTokens(
      poolId,
      propertyToBase,
      ethers.parseUnits(amountIn, propertyToBase ? 18 : 6),
      ethers.parseUnits(minAmountOut, propertyToBase ? 6 : 18)
    );
  }

  async getCurrentPrice(poolId: number): Promise<string> {
    const price = await this.contracts.secondaryMarketplace.getCurrentPrice(poolId);
    return ethers.formatUnits(price, 18);
  }

  async getUserLPTokens(poolId: number, user: string): Promise<string> {
    const tokens = await this.contracts.secondaryMarketplace.getUserLPTokens(poolId, user);
    return ethers.formatUnits(tokens, 18);
  }

  // Event listeners
  onMortgageCreated(callback: (buyer: string, mortgageId: string, downPayment: bigint, monthlyPayment: bigint) => void): void {
    this.contracts.mazunteMortgage.on('MortgageCreated', callback);
  }

  onPaymentMade(callback: (buyer: string, amount: bigint, principalPaid: bigint, interestPaid: bigint, remainingBalance: bigint) => void): void {
    this.contracts.mazunteMortgage.on('PaymentMade', callback);
  }

  onMortgageCompleted(callback: (buyer: string, totalPaid: bigint) => void): void {
    this.contracts.mazunteMortgage.on('MortgageCompleted', callback);
  }

  removeAllListeners(): void {
    Object.values(this.contracts).forEach(contract => {
      contract.removeAllListeners();
    });
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
