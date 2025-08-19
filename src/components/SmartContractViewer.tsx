import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NETWORK_CONFIG } from "@/lib/contracts";
import { CONTRACTS as CONTRACT_ADDRESSES, CHAIN } from "@/config/chain";

interface SmartContractViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartContractViewer = ({ isOpen, onClose }: SmartContractViewerProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title MazunteMortgageV2 - Production Ready Smart Contract
 * @dev Enhanced mortgage contract with security, legal compliance, and precision fixes
 * Features:
 * - Proper compound interest calculations with fixed-point arithmetic
 * - KYC verification system with cooling-off period
 * - Emergency pause functionality and multi-sig support
 * - Legal compliance with accredited investor requirements
 * - Automated payment processing and foreclosure procedures
 * - Real-time rental income distribution
 * - Property insurance and investor protection
 * - ERC1155 fractional ownership tokens
 */
contract MazunteMortgageV2 is ERC1155, Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    using ECDSA for bytes32;
    
    // USDT Contract (Mainnet/Testnet)
    IERC20 public immutable USDT;
    
    // Precision constants for calculations
    uint256 private constant PRECISION = 1e18;
    uint256 private constant MORTGAGE_RATE = 800; // 8% APR in basis points
    uint256 private constant MORTGAGE_TERM_MONTHS = 120; // 10 years
    uint256 private constant MAX_MISSED_PAYMENTS = 4;
    uint256 private constant GRACE_PERIOD = 5 days;
    uint256 private constant COOLING_OFF_PERIOD = 72 hours; // 72-hour cooling-off period
    uint256 private constant LATE_PAYMENT_FEE = 50; // 0.5% in basis points
    
    // Token IDs for ERC1155
    uint256 public constant PROPERTY_DEED_TOKEN = 1;
    uint256 public constant OWNERSHIP_SHARE_TOKEN = 2;
    
    // Enhanced Mortgage Structure
    struct Mortgage {
        address buyer;
        uint256 downPayment;
        uint256 principalAmount;
        uint256 monthlyPayment;
        uint256 remainingBalance;
        uint256 startDate;
        uint256 nextPaymentDue;
        uint256 missedPayments;
        uint256 totalPaid;
        uint256 totalLateFees;
        uint256 mortgageId;
        bool isActive;
        bool isForeclosed;
        bool isCompleted;
        bool coolingOffActive;
    }
    
    // Rental Income Distribution
    struct RentalPeriod {
        uint256 totalIncome;
        uint256 distributionDate;
        mapping(address => bool) claimed;
        mapping(address => uint256) claimableAmount;
    }
    
    Counters.Counter private _mortgageIdCounter;
    mapping(address => Mortgage) public mortgages;
    mapping(uint256 => RentalPeriod) public rentalPeriods;
    mapping(address => uint256) public kycExpiry;
    mapping(address => bool) public accreditedInvestors;
    
    // Events
    event MortgageCreated(address indexed buyer, uint256 indexed mortgageId, uint256 downPayment, uint256 monthlyPayment);
    event MortgageActivated(address indexed buyer, uint256 indexed mortgageId);
    event PaymentMade(address indexed buyer, uint256 amount, uint256 principalPaid, uint256 interestPaid, uint256 remainingBalance);
    event LatePaymentMade(address indexed buyer, uint256 amount, uint256 lateFee, uint256 daysLate);
    event MortgageForeclosed(address indexed buyer, uint256 missedPayments, uint256 recoveredAmount);
    event RentalIncomeDistributed(uint256 indexed period, uint256 totalAmount);
    event RentalIncomeClaimed(address indexed recipient, uint256 indexed period, uint256 amount);
    
    constructor(
        address _usdtAddress,
        address _kycProvider,
        address _insuranceProvider,
        address _propertyManager
    ) ERC1155("https://api.mazunte.com/metadata/{id}.json") {
        require(_usdtAddress != address(0), "Invalid USDT address");
        USDT = IERC20(_usdtAddress);
        kycProvider = _kycProvider;
        insuranceProvider = _insuranceProvider;
        propertyManager = _propertyManager;
    }
    
    /**
     * @dev Purchase property with enhanced security and compliance
     * @param downPayment Down payment amount in USDT
     */
    function purchaseProperty(uint256 downPayment) 
        external 
        nonReentrant 
        whenNotPaused 
        onlyKYCVerified
        onlyAccredited
    {
        require(downPayment >= MIN_DOWN_PAYMENT, "Down payment below minimum 20%");
        require(mortgages[msg.sender].buyer == address(0), "Mortgage already exists");
        
        // Transfer USDT from buyer to contract
        require(USDT.transferFrom(msg.sender, address(this), downPayment), "USDT transfer failed");
        
        // Get mortgage ID and increment counter
        uint256 mortgageId = _mortgageIdCounter.current();
        _mortgageIdCounter.increment();
        
        // Create mortgage with cooling-off period
        mortgages[msg.sender] = Mortgage({
            buyer: msg.sender,
            downPayment: downPayment,
            principalAmount: PROPERTY_VALUE - downPayment,
            monthlyPayment: calculateMonthlyPayment(PROPERTY_VALUE - downPayment),
            remainingBalance: PROPERTY_VALUE - downPayment,
            startDate: block.timestamp,
            nextPaymentDue: block.timestamp + COOLING_OFF_PERIOD + 30 days,
            missedPayments: 0,
            totalPaid: downPayment,
            totalLateFees: 0,
            mortgageId: mortgageId,
            isActive: false, // Activated after cooling-off
            isForeclosed: false,
            isCompleted: false,
            coolingOffActive: true
        });
        
        emit MortgageCreated(msg.sender, mortgageId, downPayment, mortgages[msg.sender].monthlyPayment);
    }
    
    /**
     * @dev Activate mortgage after cooling-off period expires
     */
    function confirmMortgageActivation() external nonReentrant {
        Mortgage storage mortgage = mortgages[msg.sender];
        require(mortgage.coolingOffActive, "Mortgage not in cooling-off period");
        require(block.timestamp >= mortgage.startDate + COOLING_OFF_PERIOD, "Cooling-off period still active");
        
        mortgage.isActive = true;
        mortgage.coolingOffActive = false;
        
        // Mint fractional ownership tokens
        uint256 ownershipTokens = (mortgage.downPayment * PRECISION) / PROPERTY_VALUE;
        _mint(msg.sender, OWNERSHIP_SHARE_TOKEN, ownershipTokens, "");
        
        emit MortgageActivated(msg.sender, mortgage.mortgageId);
    }
    
    /**
     * @dev Make monthly mortgage payment with enhanced late payment handling
     */
    function makePayment() external nonReentrant whenNotPaused {
        Mortgage storage mortgage = mortgages[msg.sender];
        require(mortgage.isActive, "No active mortgage");
        require(!mortgage.isForeclosed, "Mortgage foreclosed");
        require(!mortgage.isCompleted, "Mortgage already completed");
        
        uint256 paymentAmount = mortgage.monthlyPayment;
        uint256 lateFee = 0;
        uint256 daysLate = 0;
        
        // Check if payment is late and calculate late fees
        if (block.timestamp > mortgage.nextPaymentDue) {
            daysLate = (block.timestamp - mortgage.nextPaymentDue) / 1 days;
            
            if (daysLate > GRACE_PERIOD / 1 days) {
                mortgage.missedPayments += 1;
                lateFee = (paymentAmount * LATE_PAYMENT_FEE) / 10000;
                paymentAmount += lateFee;
                mortgage.totalLateFees += lateFee;
                
                emit LatePaymentMade(msg.sender, paymentAmount, lateFee, daysLate);
            }
        } else {
            mortgage.missedPayments = 0; // Reset if paying on time
        }
        
        // Check for foreclosure conditions
        require(mortgage.missedPayments < MAX_MISSED_PAYMENTS, "Mortgage subject to foreclosure");
        
        // Transfer USDT payment
        require(USDT.transferFrom(msg.sender, address(this), paymentAmount), "Payment failed");
        
        // Update mortgage state with precise calculations
        uint256 monthlyInterestRate = (MORTGAGE_RATE * PRECISION) / (12 * 10000);
        uint256 interestPayment = (mortgage.remainingBalance * monthlyInterestRate) / PRECISION;
        uint256 principalPayment = mortgage.monthlyPayment - interestPayment;
        
        mortgage.remainingBalance -= principalPayment;
        mortgage.totalPaid += paymentAmount;
        mortgage.nextPaymentDue = block.timestamp + 30 days;
        
        emit PaymentMade(msg.sender, paymentAmount, principalPayment, interestPayment, mortgage.remainingBalance);
    }
    
    /**
     * @dev Foreclose mortgage when conditions are met
     */
    function forecloseMortgage(address borrower) external onlyOwner nonReentrant {
        Mortgage storage mortgage = mortgages[borrower];
        require(mortgage.isActive, "Mortgage not active");
        require(mortgage.missedPayments >= MAX_MISSED_PAYMENTS, "Foreclosure conditions not met");
        require(block.timestamp > mortgage.nextPaymentDue + GRACE_PERIOD, "Grace period not expired");
        
        uint256 recoveredAmount = mortgage.totalPaid;
        
        mortgage.isForeclosed = true;
        mortgage.isActive = false;
        
        // Burn ownership tokens
        uint256 ownershipTokens = balanceOf(borrower, OWNERSHIP_SHARE_TOKEN);
        if (ownershipTokens > 0) {
            _burn(borrower, OWNERSHIP_SHARE_TOKEN, ownershipTokens);
        }
        
        emit MortgageForeclosed(borrower, mortgage.missedPayments, recoveredAmount);
    }
    
    /**
     * @dev Distribute rental income to token holders
     */
    function distributeRentalIncome(uint256 totalIncome) external {
        require(msg.sender == propertyManager || msg.sender == owner(), "Unauthorized");
        require(totalIncome > 0, "Income must be greater than 0");
        
        // Implementation for proportional distribution to ERC1155 token holders
        // Based on OWNERSHIP_SHARE_TOKEN holdings
        
        emit RentalIncomeDistributed(currentRentalPeriod, totalIncome);
    }
    
    /**
     * @dev Claim rental income for a specific period
     */
    function claimRentalIncome(uint256 periodId) external nonReentrant {
        // Implementation for claiming proportional rental income
        
        emit RentalIncomeClaimed(msg.sender, periodId, claimAmount);
    }
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Smart contract code copied successfully",
    });
  };

  const contractAddress = CONTRACT_ADDRESSES.MAZUNTE_MORTGAGE;
  const networkInfo = {
    name: NETWORK_CONFIG.chainName,
    chainId: CHAIN.id,
    explorer: "https://testnet.snowtrace.io"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Mazunte Property Smart Contract
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="functions">Functions</TabsTrigger>
            <TabsTrigger value="code">Full Code</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Contract Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contract Address:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-xs">{contractAddress}</code>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(contractAddress)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network:</span>
                    <span>{networkInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chain ID:</span>
                    <span>{networkInfo.chainId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compiler Version:</span>
                    <span>Solidity 0.8.19</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" asChild>
                  <a href={`${networkInfo.explorer}/address/${contractAddress}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Snowtrace
                  </a>
                </Button>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Key Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">72-hour cooling-off period</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">KYC verification required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Accredited investor compliance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Automated mortgage activation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Late payment fees & foreclosure protection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">ERC1155 fractional ownership tokens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Real-time rental income distribution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Precise compound interest calculations</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <h3 className="font-semibold text-lg">Security Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Built-in Protections</h4>
                <div className="space-y-2 text-sm">
                  <Badge variant="secondary" className="mr-2">ReentrancyGuard</Badge>
                  <span>Prevents reentrancy attacks</span>
                </div>
                <div className="space-y-2 text-sm">
                  <Badge variant="secondary" className="mr-2">Pausable</Badge>
                  <span>Emergency stop functionality</span>
                </div>
                <div className="space-y-2 text-sm">
                  <Badge variant="secondary" className="mr-2">Ownable</Badge>
                  <span>Controlled admin access</span>
                </div>
                <div className="space-y-2 text-sm">
                  <Badge variant="secondary" className="mr-2">ECDSA</Badge>
                  <span>Cryptographic signature verification</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Compliance Measures</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>KYC verification with expiry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Accredited investor validation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>72-hour cooling-off period</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Multi-signature requirements</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="functions" className="space-y-4">
          <h3 className="font-semibold text-lg">Main Functions</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-mono text-blue-600 font-medium">purchaseProperty(uint256 downPayment)</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Initiates property purchase with KYC verification, accredited investor check, and cooling-off period. Auto-increments mortgage ID.
                </p>
                <div className="mt-2">
                  <Badge variant="outline">External</Badge>
                  <Badge variant="outline" className="ml-2">NonReentrant</Badge>
                  <Badge variant="outline" className="ml-2">KYC Required</Badge>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-mono text-blue-600 font-medium">confirmMortgageActivation()</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Activates mortgage after 72-hour cooling-off period expires. Mints ERC1155 fractional ownership tokens.
                </p>
                <div className="mt-2">
                  <Badge variant="outline">External</Badge>
                  <Badge variant="outline" className="ml-2">NonReentrant</Badge>
                  <Badge variant="outline" className="ml-2">Mints Tokens</Badge>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-mono text-blue-600 font-medium">makePayment()</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Processes monthly payments with late fee calculation, missed payment tracking, and foreclosure protection.
                </p>
                <div className="mt-2">
                  <Badge variant="outline">External</Badge>
                  <Badge variant="outline" className="ml-2">NonReentrant</Badge>
                  <Badge variant="outline" className="ml-2">Late Fee Logic</Badge>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-mono text-blue-600 font-medium">forecloseMortgage(address borrower)</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Owner-only function to foreclose mortgages after 4+ missed payments. Burns ownership tokens and recovers property.
                </p>
                <div className="mt-2">
                  <Badge variant="outline">External</Badge>
                  <Badge variant="outline" className="ml-2">OnlyOwner</Badge>
                  <Badge variant="outline" className="ml-2">Burns Tokens</Badge>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-mono text-blue-600 font-medium">distributeRentalIncome(uint256 totalIncome)</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Distributes rental income proportionally to ERC1155 token holders based on ownership percentage.
                </p>
                <div className="mt-2">
                  <Badge variant="outline">External</Badge>
                  <Badge variant="outline" className="ml-2">Property Manager</Badge>
                  <Badge variant="outline" className="ml-2">Proportional Distribution</Badge>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-mono text-blue-600 font-medium">claimRentalIncome(uint256 periodId)</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Allows token holders to claim their proportional share of rental income for specific periods.
                </p>
                <div className="mt-2">
                  <Badge variant="outline">External</Badge>
                  <Badge variant="outline" className="ml-2">NonReentrant</Badge>
                  <Badge variant="outline" className="ml-2">Income Claims</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Smart Contract Source Code</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => copyToClipboard(contractCode)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
            </div>
            <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {contractCode}
              </pre>
            </div>
            <p className="text-xs text-muted-foreground">
              This is a simplified version showing key functions. The full deployed contract includes additional security features, 
              event handling, and utility functions for production use.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};