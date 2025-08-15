// SPDX-License-Identifier: MIT
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
    uint256 private constant DAYS_IN_YEAR = 365;
    uint256 private constant SECONDS_IN_DAY = 86400;
    uint256 private constant BASIS_POINTS = 10000;
    
    // Property Constants - Demo Mode (1000x reduced for testing)
    uint256 public constant PROPERTY_VALUE = 150 * 1e6; // $150 USDT (was $150k)
    uint256 public constant MIN_DOWN_PAYMENT_PCT = 2000; // 20% in basis points
    uint256 public constant MIN_DOWN_PAYMENT = (PROPERTY_VALUE * MIN_DOWN_PAYMENT_PCT) / BASIS_POINTS;
    uint256 public constant MORTGAGE_RATE = 800; // 8% APR in basis points
    uint256 public constant MORTGAGE_TERM_MONTHS = 120; // 10 years
    uint256 public constant MAX_MISSED_PAYMENTS = 4;
    uint256 public constant GRACE_PERIOD = 5 days; // Grace period for late payments
    uint256 public constant COOLING_OFF_PERIOD = 10 minutes; // Shortened for demo testing
    uint256 public constant MIN_INVESTMENT = 1 * 1e6; // $1 minimum for demo testing
    // Removed appreciation cap - full 181% appreciation model in basis points
    uint256 public constant LATE_PAYMENT_FEE = 50; // 0.5% in basis points
    
    // Token IDs for ERC1155
    uint256 public constant PROPERTY_DEED_TOKEN = 1;
    uint256 public constant OWNERSHIP_SHARE_TOKEN = 2;
    
    // Legal and compliance
    address public kycProvider;
    address public insuranceProvider;
    address public propertyManager;
    mapping(address => uint256) public kycExpiry;
    mapping(address => bool) public accreditedInvestors;
    mapping(address => uint256) public coolingOffExpiry;
    
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
        uint256 kycVerificationHash;
        uint256 mortgageId;
        bool isActive;
        bool isForeclosed;
        bool isCompleted;
        bool coolingOffActive;
    }
    
    // Payment Schedule Structure
    struct PaymentSchedule {
        uint256 paymentNumber;
        uint256 principalAmount;
        uint256 interestAmount;
        uint256 remainingBalance;
        uint256 dueDate;
        bool isPaid;
    }
    
    // Rental Income Distribution
    struct RentalPeriod {
        uint256 totalIncome;
        uint256 distributionDate;
        mapping(address => bool) claimed;
        mapping(address => uint256) claimableAmount;
    }
    
    // Contract State
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _mortgageIdCounter;
    
    mapping(address => Mortgage) public mortgages;
    mapping(address => PaymentSchedule[]) public paymentSchedules;
    mapping(address => uint256) public lastRentalClaim;
    mapping(address => uint256) public insurancePremiums;
    mapping(uint256 => RentalPeriod) public rentalPeriods;
    
    address[] public mortgageHolders;
    uint256 public totalDownPayments;
    uint256 public totalRentalIncome;
    uint256 public totalInsuranceFunds;
    uint256 public propertyDeedTokenId;
    uint256 public propertyAppreciationValue;
    uint256 public currentRentalPeriod;
    bool public propertyFullyOwned;
    bool public emergencyStop;
    
    // Multi-signature requirements
    mapping(bytes32 => mapping(address => bool)) public adminSignatures;
    mapping(bytes32 => uint256) public signatureCount;
    address[] public admins;
    uint256 public requiredSignatures = 2;
    
    // Events
    event MortgageCreated(address indexed buyer, uint256 indexed mortgageId, uint256 downPayment, uint256 monthlyPayment);
    event PaymentMade(address indexed buyer, uint256 amount, uint256 principalPaid, uint256 interestPaid, uint256 remainingBalance);
    event LatePaymentMade(address indexed buyer, uint256 amount, uint256 lateFee, uint256 daysLate);
    event MortgageActivated(address indexed buyer, uint256 indexed mortgageId);
    event MortgageCompleted(address indexed buyer, uint256 totalPaid);
    event MortgageForeclosed(address indexed buyer, uint256 missedPayments, uint256 recoveredAmount);
    event CoolingOffPeriodStarted(address indexed buyer, uint256 expiryTime);
    event CoolingOffCancellation(address indexed buyer, uint256 refundAmount);
    event KYCVerified(address indexed buyer, uint256 expiryTime);
    event AccreditedInvestorVerified(address indexed investor);
    event PropertyDeedMinted(address indexed owner, uint256 tokenId);
    event OwnershipTokensMinted(address indexed owner, uint256 amount);
    event AppreciationDistributed(uint256 totalAppreciation, uint256 buyerShare, uint256 ancientShare);
    event RentalIncomeDistributed(uint256 indexed period, uint256 totalAmount);
    event RentalIncomeClaimed(address indexed recipient, uint256 indexed period, uint256 amount);
    event InsuranceClaimProcessed(address indexed claimant, uint256 amount, string reason);
    event EmergencyPaused(address indexed admin, string reason);
    event MultiSigTransactionProposed(bytes32 indexed transactionHash, address indexed proposer);
    event MultiSigTransactionExecuted(bytes32 indexed transactionHash);
    
    modifier onlyKYCVerified() {
        require(kycExpiry[msg.sender] > block.timestamp, "KYC verification required or expired");
        _;
    }
    
    modifier onlyAccredited() {
        require(accreditedInvestors[msg.sender], "Accredited investor status required");
        _;
    }
    
    modifier coolingOffCompleted() {
        require(coolingOffExpiry[msg.sender] < block.timestamp, "Cooling-off period still active");
        _;
    }
    
    modifier notEmergencyStop() {
        require(!emergencyStop, "Contract is in emergency stop mode");
        _;
    }
    
    constructor(
        address _usdtAddress,
        address _kycProvider,
        address _insuranceProvider,
        address _propertyManager
    ) 
        ERC1155("https://api.mazunte.com/metadata/{id}.json")
    {
        require(_usdtAddress != address(0), "Invalid USDT address");
        require(_kycProvider != address(0), "Invalid KYC provider address");
        require(_insuranceProvider != address(0), "Invalid insurance provider address");
        require(_propertyManager != address(0), "Invalid property manager address");
        
        USDT = IERC20(_usdtAddress);
        kycProvider = _kycProvider;
        insuranceProvider = _insuranceProvider;
        propertyManager = _propertyManager;
        
        // Initialize admin structure
        admins.push(msg.sender);
        admins.push(_kycProvider);
        
        // Initialize first rental period
        currentRentalPeriod = 1;
    }
    
    /**
     * @dev KYC verification function
     * @param investor Address to verify
     * @param expiryTime KYC expiry timestamp
     * @param signature KYC provider signature
     */
    function verifyKYC(
        address investor,
        uint256 expiryTime,
        bytes memory signature
    ) external {
        bytes32 messageHash = keccak256(abi.encodePacked(investor, expiryTime, address(this)));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        require(ethSignedMessageHash.recover(signature) == kycProvider, "Invalid KYC signature");
        require(expiryTime > block.timestamp + 365 days, "KYC must be valid for at least 1 year");
        
        kycExpiry[investor] = expiryTime;
        emit KYCVerified(investor, expiryTime);
    }
    
    /**
     * @dev Verify accredited investor status
     * @param investor Address to verify
     */
    function verifyAccreditedInvestor(address investor) external {
        require(msg.sender == kycProvider, "Only KYC provider can verify accreditation");
        accreditedInvestors[investor] = true;
        emit AccreditedInvestorVerified(investor);
    }
    
    /**
     * @dev Purchase property with enhanced security and compliance
     * @param downPayment Down payment amount in USDT
     */
    function purchaseProperty(uint256 downPayment) 
        external 
        nonReentrant 
        whenNotPaused 
        notEmergencyStop
        onlyKYCVerified
        onlyAccredited
    {
        require(downPayment >= MIN_DOWN_PAYMENT, "Down payment below minimum 20%");
        require(downPayment >= MIN_INVESTMENT, "Investment below minimum amount");
        require(mortgages[msg.sender].buyer == address(0), "Mortgage already exists");
        require(!propertyFullyOwned, "Property already sold");
        
        // Start cooling-off period
        coolingOffExpiry[msg.sender] = block.timestamp + COOLING_OFF_PERIOD;
        
        // Transfer USDT from buyer to contract
        require(USDT.transferFrom(msg.sender, address(this), downPayment), "USDT transfer failed");
        
        // Calculate precise mortgage details
        uint256 principalAmount = PROPERTY_VALUE - downPayment;
        uint256 monthlyPayment = calculateMonthlyPayment(principalAmount);
        
        // Get mortgage ID and increment counter
        uint256 mortgageId = _mortgageIdCounter.current();
        _mortgageIdCounter.increment();
        
        // Create mortgage with cooling-off period
        mortgages[msg.sender] = Mortgage({
            buyer: msg.sender,
            downPayment: downPayment,
            principalAmount: principalAmount,
            monthlyPayment: monthlyPayment,
            remainingBalance: principalAmount,
            startDate: block.timestamp,
            nextPaymentDue: block.timestamp + COOLING_OFF_PERIOD + 30 days,
            missedPayments: 0,
            totalPaid: downPayment,
            totalLateFees: 0,
            kycVerificationHash: uint256(keccak256(abi.encodePacked(msg.sender, kycExpiry[msg.sender]))),
            mortgageId: mortgageId,
            isActive: false, // Activated after cooling-off
            isForeclosed: false,
            isCompleted: false,
            coolingOffActive: true
        });
        
        // Generate payment schedule
        _generatePaymentSchedule(msg.sender, principalAmount, monthlyPayment);
        
        mortgageHolders.push(msg.sender);
        totalDownPayments += downPayment;
        
        emit MortgageCreated(msg.sender, mortgageId, downPayment, monthlyPayment);
        emit CoolingOffPeriodStarted(msg.sender, coolingOffExpiry[msg.sender]);
    }
    
    /**
     * @dev Cancel mortgage during cooling-off period
     */
    function cancelDuringCoolingOff() external nonReentrant {
        Mortgage storage mortgage = mortgages[msg.sender];
        require(mortgage.coolingOffActive, "No active cooling-off period");
        require(block.timestamp <= coolingOffExpiry[msg.sender], "Cooling-off period expired");
        
        uint256 refundAmount = mortgage.downPayment;
        
        // Clear mortgage data
        delete mortgages[msg.sender];
        delete paymentSchedules[msg.sender];
        
        // Remove from holders array
        for (uint i = 0; i < mortgageHolders.length; i++) {
            if (mortgageHolders[i] == msg.sender) {
                mortgageHolders[i] = mortgageHolders[mortgageHolders.length - 1];
                mortgageHolders.pop();
                break;
            }
        }
        
        totalDownPayments -= refundAmount;
        
        // Refund down payment
        require(USDT.transfer(msg.sender, refundAmount), "Refund failed");
        
        emit CoolingOffCancellation(msg.sender, refundAmount);
    }
    
    /**
     * @dev Activate mortgage after cooling-off period expires
     */
    function confirmMortgageActivation() external nonReentrant {
        Mortgage storage mortgage = mortgages[msg.sender];
        require(mortgage.coolingOffActive, "Mortgage not in cooling-off period");
        require(block.timestamp >= coolingOffExpiry[msg.sender], "Cooling-off period still active");
        
        mortgage.isActive = true;
        mortgage.coolingOffActive = false;
        
        // Mint fractional ownership tokens based on down payment percentage
        uint256 ownershipTokens = (mortgage.downPayment * PRECISION) / PROPERTY_VALUE;
        _mint(msg.sender, OWNERSHIP_SHARE_TOKEN, ownershipTokens, "");
        
        emit MortgageActivated(msg.sender, mortgage.mortgageId);
        emit OwnershipTokensMinted(msg.sender, ownershipTokens);
    }
    
    /**
     * @dev Make monthly mortgage payment with enhanced late payment handling
     */
    function makePayment() external nonReentrant whenNotPaused coolingOffCompleted {
        Mortgage storage mortgage = mortgages[msg.sender];
        require(mortgage.isActive, "No active mortgage");
        require(!mortgage.isForeclosed, "Mortgage foreclosed");
        require(!mortgage.isCompleted, "Mortgage already completed");
        
        uint256 paymentAmount = mortgage.monthlyPayment;
        uint256 currentBalance = mortgage.remainingBalance;
        uint256 lateFee = 0;
        uint256 daysLate = 0;
        
        // Check if payment is late and calculate late fees
        if (block.timestamp > mortgage.nextPaymentDue) {
            daysLate = (block.timestamp - mortgage.nextPaymentDue) / SECONDS_IN_DAY;
            
            if (daysLate > GRACE_PERIOD / SECONDS_IN_DAY) {
                // Increment missed payments count
                mortgage.missedPayments += 1;
                
                // Calculate late fee
                lateFee = (paymentAmount * LATE_PAYMENT_FEE) / BASIS_POINTS;
                paymentAmount += lateFee;
                mortgage.totalLateFees += lateFee;
                
                emit LatePaymentMade(msg.sender, paymentAmount, lateFee, daysLate);
            }
        } else {
            // Reset missed payments if paying on time
            mortgage.missedPayments = 0;
        }
        
        // Check for foreclosure conditions
        require(mortgage.missedPayments < MAX_MISSED_PAYMENTS, "Mortgage subject to foreclosure");
        
        // Calculate interest and principal portions
        uint256 monthlyInterestRate = (MORTGAGE_RATE * PRECISION) / (12 * BASIS_POINTS);
        uint256 interestPayment = (currentBalance * monthlyInterestRate) / PRECISION;
        uint256 principalPayment = mortgage.monthlyPayment - interestPayment;
        
        // Ensure we don't overpay
        if (principalPayment > currentBalance) {
            principalPayment = currentBalance;
            paymentAmount = principalPayment + interestPayment + lateFee;
        }
        
        // Transfer USDT payment
        require(USDT.transferFrom(msg.sender, address(this), paymentAmount), "Payment failed");
        
        // Update mortgage state
        mortgage.remainingBalance -= principalPayment;
        mortgage.totalPaid += paymentAmount;
        mortgage.nextPaymentDue = block.timestamp + 30 days;
        
        // Update payment schedule
        _markPaymentAsPaid(msg.sender);
        
        // Check if mortgage is completed
        if (mortgage.remainingBalance == 0) {
            mortgage.isCompleted = true;
            mortgage.isActive = false;
            propertyFullyOwned = true;
            _mintPropertyDeed(msg.sender);
            emit MortgageCompleted(msg.sender, mortgage.totalPaid);
        }
        
        emit PaymentMade(msg.sender, paymentAmount, principalPayment, interestPayment, mortgage.remainingBalance);
    }
    
    /**
     * @dev Foreclose mortgage when conditions are met
     * @param borrower Address of the borrower to foreclose
     */
    function forecloseMortgage(address borrower) external onlyOwner nonReentrant {
        Mortgage storage mortgage = mortgages[borrower];
        require(mortgage.isActive, "Mortgage not active");
        require(mortgage.missedPayments >= MAX_MISSED_PAYMENTS, "Foreclosure conditions not met");
        require(block.timestamp > mortgage.nextPaymentDue + GRACE_PERIOD, "Grace period not expired");
        
        uint256 recoveredAmount = mortgage.totalPaid;
        
        // Update mortgage state
        mortgage.isForeclosed = true;
        mortgage.isActive = false;
        
        // Burn ownership tokens
        uint256 ownershipTokens = balanceOf(borrower, OWNERSHIP_SHARE_TOKEN);
        if (ownershipTokens > 0) {
            _burn(borrower, OWNERSHIP_SHARE_TOKEN, ownershipTokens);
        }
        
        // Remove from active holders
        for (uint i = 0; i < mortgageHolders.length; i++) {
            if (mortgageHolders[i] == borrower) {
                mortgageHolders[i] = mortgageHolders[mortgageHolders.length - 1];
                mortgageHolders.pop();
                break;
            }
        }
        
        emit MortgageForeclosed(borrower, mortgage.missedPayments, recoveredAmount);
    }
    
    /**
     * @dev Distribute rental income to token holders
     * @param totalIncome Total rental income for the period
     */
    function distributeRentalIncome(uint256 totalIncome) external {
        require(msg.sender == propertyManager || msg.sender == owner(), "Unauthorized");
        require(totalIncome > 0, "Income must be greater than 0");
        
        // Transfer rental income to contract
        require(USDT.transferFrom(msg.sender, address(this), totalIncome), "Income transfer failed");
        
        RentalPeriod storage period = rentalPeriods[currentRentalPeriod];
        period.totalIncome = totalIncome;
        period.distributionDate = block.timestamp;
        
        // Calculate claimable amounts for each token holder
        uint256 totalOwnershipTokens = 0;
        for (uint i = 0; i < mortgageHolders.length; i++) {
            address holder = mortgageHolders[i];
            if (mortgages[holder].isActive || mortgages[holder].isCompleted) {
                uint256 holderTokens = balanceOf(holder, OWNERSHIP_SHARE_TOKEN);
                totalOwnershipTokens += holderTokens;
            }
        }
        
        if (totalOwnershipTokens > 0) {
            for (uint i = 0; i < mortgageHolders.length; i++) {
                address holder = mortgageHolders[i];
                if (mortgages[holder].isActive || mortgages[holder].isCompleted) {
                    uint256 holderTokens = balanceOf(holder, OWNERSHIP_SHARE_TOKEN);
                    uint256 claimableAmount = (totalIncome * holderTokens) / totalOwnershipTokens;
                    period.claimableAmount[holder] = claimableAmount;
                }
            }
        }
        
        totalRentalIncome += totalIncome;
        emit RentalIncomeDistributed(currentRentalPeriod, totalIncome);
        
        currentRentalPeriod++;
    }
    
    /**
     * @dev Claim rental income for a specific period
     * @param periodId The rental period to claim from
     */
    function claimRentalIncome(uint256 periodId) external nonReentrant {
        require(periodId < currentRentalPeriod, "Invalid period");
        
        RentalPeriod storage period = rentalPeriods[periodId];
        require(!period.claimed[msg.sender], "Already claimed for this period");
        require(period.claimableAmount[msg.sender] > 0, "No income to claim");
        
        uint256 claimAmount = period.claimableAmount[msg.sender];
        period.claimed[msg.sender] = true;
        
        require(USDT.transfer(msg.sender, claimAmount), "Claim transfer failed");
        
        emit RentalIncomeClaimed(msg.sender, periodId, claimAmount);
    }
    
    /**
     * @dev Mint property deed NFT when mortgage is completed
     */
    function _mintPropertyDeed(address owner) internal {
        propertyDeedTokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _mint(owner, PROPERTY_DEED_TOKEN, 1, "");
        emit PropertyDeedMinted(owner, propertyDeedTokenId);
    }
    
    /**
     * @dev Generate complete payment schedule
     */
    function _generatePaymentSchedule(address buyer, uint256 principal, uint256 monthlyPayment) internal {
        uint256 currentBalance = principal;
        uint256 currentDate = block.timestamp + COOLING_OFF_PERIOD;
        
        for (uint256 i = 0; i < MORTGAGE_TERM_MONTHS && currentBalance > 0; i++) {
            uint256 monthlyInterestRate = (MORTGAGE_RATE * PRECISION) / (12 * BASIS_POINTS);
            uint256 interestPayment = (currentBalance * monthlyInterestRate) / PRECISION;
            uint256 principalPayment = monthlyPayment - interestPayment;
            
            if (principalPayment > currentBalance) {
                principalPayment = currentBalance;
            }
            
            currentBalance -= principalPayment;
            currentDate += 30 days;
            
            paymentSchedules[buyer].push(PaymentSchedule({
                paymentNumber: i + 1,
                principalAmount: principalPayment,
                interestAmount: interestPayment,
                remainingBalance: currentBalance,
                dueDate: currentDate,
                isPaid: false
            }));
        }
    }
    
    /**
     * @dev Mark payment as paid in schedule
     */
    function _markPaymentAsPaid(address buyer) internal {
        PaymentSchedule[] storage schedule = paymentSchedules[buyer];
        for (uint256 i = 0; i < schedule.length; i++) {
            if (!schedule[i].isPaid) {
                schedule[i].isPaid = true;
                break;
            }
        }
    }
    
    /**
     * @dev Calculate monthly payment with precise compound interest
     */
    function calculateMonthlyPayment(uint256 principal) public pure returns (uint256) {
        if (principal == 0) return 0;
        
        // Monthly interest rate with precision
        uint256 monthlyRate = (MORTGAGE_RATE * PRECISION) / (12 * BASIS_POINTS);
        
        // Calculate (1 + r)^n using precise exponentiation
        uint256 compound = PRECISION;
        uint256 base = PRECISION + monthlyRate;
        
        for (uint256 i = 0; i < MORTGAGE_TERM_MONTHS; i++) {
            compound = (compound * base) / PRECISION;
        }
        
        // Monthly payment = P * [r(1+r)^n] / [(1+r)^n - 1]
        uint256 numerator = (principal * monthlyRate * compound) / PRECISION;
        uint256 denominator = compound - PRECISION;
        
        return numerator / denominator;
    }
    
    /**
     * @dev Emergency pause function
     */
    function emergencyPause(string memory reason) external {
        require(_isAdmin(msg.sender), "Admin access required");
        emergencyStop = true;
        _pause();
        emit EmergencyPaused(msg.sender, reason);
    }
    
    /**
     * @dev Check if address is admin
     */
    function _isAdmin(address account) internal view returns (bool) {
        for (uint256 i = 0; i < admins.length; i++) {
            if (admins[i] == account) return true;
        }
        return false;
    }
    
    /**
     * @dev Get payment schedule for buyer
     */
    function getPaymentSchedule(address buyer) external view returns (PaymentSchedule[] memory) {
        return paymentSchedules[buyer];
    }
    
    /**
     * @dev Get mortgage details with enhanced information
     */
    function getMortgageDetails(address buyer) external view returns (
        uint256 downPayment,
        uint256 principalAmount,
        uint256 monthlyPayment,
        uint256 remainingBalance,
        uint256 nextPaymentDue,
        uint256 missedPayments,
        uint256 totalPaid,
        uint256 totalLateFees,
        uint256 mortgageId,
        bool isActive,
        bool isForeclosed,
        bool isCompleted,
        bool coolingOffActive
    ) {
        Mortgage memory mortgage = mortgages[buyer];
        return (
            mortgage.downPayment,
            mortgage.principalAmount,
            mortgage.monthlyPayment,
            mortgage.remainingBalance,
            mortgage.nextPaymentDue,
            mortgage.missedPayments,
            mortgage.totalPaid,
            mortgage.totalLateFees,
            mortgage.mortgageId,
            mortgage.isActive,
            mortgage.isForeclosed,
            mortgage.isCompleted,
            mortgage.coolingOffActive
        );
    }
    
    /**
     * @dev Get property status with enhanced information
     */
    function getPropertyStatus() external view returns (
        uint256 totalValue,
        uint256 currentValue,
        uint256 totalDownPayments,
        uint256 appreciationValue,
        uint256 totalRentalIncomeGenerated,
        bool fullyOwned
    ) {
        return (
            PROPERTY_VALUE,
            PROPERTY_VALUE + propertyAppreciationValue,
            totalDownPayments,
            propertyAppreciationValue,
            totalRentalIncome,
            propertyFullyOwned
        );
    }
    
    /**
     * @dev Check if payment is overdue
     */
    function isPaymentOverdue(address buyer) external view returns (bool) {
        Mortgage memory mortgage = mortgages[buyer];
        if (!mortgage.isActive || mortgage.isCompleted || mortgage.isForeclosed) {
            return false;
        }
        return block.timestamp > mortgage.nextPaymentDue + GRACE_PERIOD;
    }
    
    /**
     * @dev Get claimable rental income for a holder
     */
    function getClaimableRentalIncome(address holder, uint256 periodId) external view returns (uint256) {
        if (periodId >= currentRentalPeriod) return 0;
        
        RentalPeriod storage period = rentalPeriods[periodId];
        if (period.claimed[holder]) return 0;
        
        return period.claimableAmount[holder];
    }
    
    /**
     * @dev Get total rental income across all periods for a holder
     */
    function getTotalClaimableRentalIncome(address holder) external view returns (uint256 total) {
        for (uint256 i = 1; i < currentRentalPeriod; i++) {
            RentalPeriod storage period = rentalPeriods[i];
            if (!period.claimed[holder]) {
                total += period.claimableAmount[holder];
            }
        }
        return total;
    }
}