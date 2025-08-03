import { ethers } from 'ethers';
import { CONTRACTS, NETWORK_CONFIG } from '@/lib/contracts';

export class Web3Integration {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contracts: { [key: string]: ethers.Contract } = {};

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
  }

  async getAccount(): Promise<string> {
    if (!this.signer) throw new Error('Wallet not connected');
    return await this.signer.getAddress();
  }

  async getUSDTBalance(account: string): Promise<string> {
    const balance = await this.contracts.usdt.balanceOf(account);
    return ethers.formatUnits(balance, 6); // USDT has 6 decimals
  }

  async approveUSDT(spender: string, amount: string): Promise<ethers.ContractTransactionResponse> {
    const amountWei = ethers.parseUnits(amount, 6);
    return await this.contracts.usdt.approve(spender, amountWei);
  }

  async checkUSDTAllowance(owner: string, spender: string): Promise<string> {
    const allowance = await this.contracts.usdt.allowance(owner, spender);
    return ethers.formatUnits(allowance, 6);
  }

  async purchaseProperty(downPayment: number): Promise<{
    transaction: ethers.ContractTransactionResponse;
    mortgageId: string;
  }> {
    const account = await this.getAccount();
    const downPaymentUSDT = (downPayment * 1e6).toString(); // Convert to USDT units
    
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
    isActive: boolean;
    isForeclosed: boolean;
    isCompleted: boolean;
    coolingOffActive: boolean;
  }> {
    return await this.contracts.mazunteMortgage.getMortgageDetails(account);
  }

  async getPropertyStatus(): Promise<{
    totalValue: bigint;
    currentValue: bigint;
    totalDownPayments: bigint;
    appreciationValue: bigint;
    fullyOwned: boolean;
  }> {
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
    return await this.contracts.mazunteMortgage.getPaymentSchedule(account);
  }

  async isPaymentOverdue(account: string): Promise<boolean> {
    return await this.contracts.mazunteMortgage.isPaymentOverdue(account);
  }

  async joinVillage(): Promise<ethers.ContractTransactionResponse> {
    const feeInWei = ethers.parseEther("0.1"); // 0.1 AVAX
    return await this.contracts.villageCitizenship.becomeCitizen({ value: feeInWei });
  }

  async checkVillageMembership(account: string): Promise<boolean> {
    return await this.contracts.villageCitizenship.hasCitizenship(account);
  }

  async cancelDuringCoolingOff(): Promise<ethers.ContractTransactionResponse> {
    return await this.contracts.mazunteMortgage.cancelDuringCoolingOff();
  }

  async activateMortgage(): Promise<ethers.ContractTransactionResponse> {
    return await this.contracts.mazunteMortgage.activateMortgage();
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