// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title MazunteMortgage
 * @dev Enhanced smart contract for the Mazunte property rent-to-own system
 * Property Value: $150,000 USD
 * Down Payment: 20% ($30,000)
 * Mortgage Term: 10 years @ 8% APR
 * Default Trigger: 4 missed payments
 * Appreciation Split: Buyer 50%, Ancient 40%, Lenders 10% (full 181% appreciation)
 * Legal Owner: Ancient Holdings Ltd (Nevis Corp)
 */
contract MazunteMortgage is ERC721, ERC20, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // USDT Contract (Fuji Testnet)
    IERC20 public constant USDT = IERC20(0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7); // Fuji USDT
    
    // Property Constants
    uint256 public constant PROPERTY_VALUE = 150000 * 10**6; // $150k USDT (6 decimals)
    uint256 public constant DOWN_PAYMENT_PERCENT = 20; // 20%
    uint256 public constant MIN_DOWN_PAYMENT = (PROPERTY_VALUE * DOWN_PAYMENT_PERCENT) / 100; // $30k
    uint256 public constant MORTGAGE_RATE = 800; // 8% APR (basis points)
    uint256 public constant MORTGAGE_TERM_MONTHS = 120; // 10 years
    uint256 public constant MAX_MISSED_PAYMENTS = 4; // Foreclosure trigger
    // Removed appreciation cap - full 181% appreciation model
    
    // Appreciation Split (percentages)
    uint256 public constant BUYER_SPLIT = 50; // 50%
    uint256 public constant ANCIENT_SPLIT = 40; // 40%
    uint256 public constant LENDER_SPLIT = 10; // 10%
    
    // Mortgage Structure
    struct Mortgage {
        address buyer;
        uint256 downPayment;
        uint256 principalAmount;
        uint256 monthlyPayment;
        uint256 remainingBalance;
        uint256 startDate;
        uint256 nextPaymentDue;
        uint256 missedPayments;
        bool isActive;
        bool isForeclosed;
        bool isCompleted;
    }
    
    // Contract State
    Counters.Counter private _tokenIdCounter;
    mapping(address => Mortgage) public mortgages;
    mapping(address => uint256) public lastRentalClaim;
    address[] public mortgageHolders;
    uint256 public totalDownPayments;
    uint256 public totalRentalIncome;
    uint256 public propertyDeedTokenId;
    uint256 public propertyAppreciationValue;
    bool public propertyFullyOwned;
    
    // Events
    event MortgageCreated(address indexed buyer, uint256 downPayment, uint256 monthlyPayment);
    event MortgagePaymentMade(address indexed buyer, uint256 amount, uint256 remainingBalance);
    event MortgageCompleted(address indexed buyer, uint256 totalPaid);
    event MortgageForeclosed(address indexed buyer, uint256 missedPayments);
    event PropertyDeedMinted(address indexed owner, uint256 tokenId);
    event AppreciationDistributed(uint256 totalAppreciation, uint256 buyerShare, uint256 ancientShare, uint256 lenderShare);
    event RentalIncomeDistributed(uint256 amount, uint256 timestamp);
    
    constructor() 
        ERC721("Mazunte Property Deed", "MAZUNTE")
        ERC20("Mazunte Investment Token", "MAZIT")
    {
        // No initial token minting - tokens created per mortgage
    }
    
    /**
     * @dev Purchase property with mortgage (20% down payment)
     * @param downPayment Down payment amount in USDT (must be >= 20% of property value)
     */
    function purchaseProperty(uint256 downPayment) external nonReentrant {
        require(downPayment >= MIN_DOWN_PAYMENT, "Down payment below minimum 20%");
        require(mortgages[msg.sender].buyer == address(0), "Mortgage already exists");
        require(!propertyFullyOwned, "Property already sold");
        
        // Transfer USDT from buyer to contract
        require(USDT.transferFrom(msg.sender, address(this), downPayment), "USDT transfer failed");
        
        // Calculate mortgage details
        uint256 principalAmount = PROPERTY_VALUE - downPayment;
        uint256 monthlyPayment = calculateMonthlyPayment(principalAmount);
        
        // Create mortgage
        mortgages[msg.sender] = Mortgage({
            buyer: msg.sender,
            downPayment: downPayment,
            principalAmount: principalAmount,
            monthlyPayment: monthlyPayment,
            remainingBalance: principalAmount,
            startDate: block.timestamp,
            nextPaymentDue: block.timestamp + 30 days,
            missedPayments: 0,
            isActive: true,
            isForeclosed: false,
            isCompleted: false
        });
        
        mortgageHolders.push(msg.sender);
        totalDownPayments += downPayment;
        
        // Mint property tokens to buyer (represents ownership stake)
        uint256 ownershipTokens = (downPayment * PROPERTY_VALUE) / PROPERTY_VALUE;
        _mint(msg.sender, ownershipTokens);
        
        emit MortgageCreated(msg.sender, downPayment, monthlyPayment);
    }
    
    /**
     * @dev Make monthly mortgage payment
     */
    function makePayment() external nonReentrant {
        Mortgage storage mortgage = mortgages[msg.sender];
        require(mortgage.isActive, "No active mortgage");
        require(!mortgage.isForeclosed, "Mortgage foreclosed");
        require(!mortgage.isCompleted, "Mortgage already completed");
        
        uint256 paymentAmount = mortgage.monthlyPayment;
        
        // Transfer USDT payment
        require(USDT.transferFrom(msg.sender, address(this), paymentAmount), "Payment failed");
        
        // Update mortgage balance
        mortgage.remainingBalance -= paymentAmount;
        mortgage.nextPaymentDue = block.timestamp + 30 days;
        mortgage.missedPayments = 0; // Reset missed payments
        
        // Check if mortgage is fully paid
        if (mortgage.remainingBalance == 0) {
            mortgage.isCompleted = true;
            mortgage.isActive = false;
            propertyFullyOwned = true;
            _mintPropertyDeed(msg.sender);
            emit MortgageCompleted(msg.sender, mortgage.downPayment + (mortgage.principalAmount));
        }
        
        emit MortgagePaymentMade(msg.sender, paymentAmount, mortgage.remainingBalance);
    }
    
    /**
     * @dev Check for overdue payments and handle defaults
     */
    function checkPaymentStatus(address buyer) external {
        Mortgage storage mortgage = mortgages[buyer];
        require(mortgage.isActive, "No active mortgage");
        require(!mortgage.isForeclosed, "Already foreclosed");
        
        if (block.timestamp > mortgage.nextPaymentDue) {
            mortgage.missedPayments++;
            mortgage.nextPaymentDue = block.timestamp + 30 days;
            
            // Trigger foreclosure after 4 missed payments
            if (mortgage.missedPayments >= MAX_MISSED_PAYMENTS) {
                mortgage.isForeclosed = true;
                mortgage.isActive = false;
                
                // Burn buyer's tokens (they lose ownership)
                uint256 buyerTokens = balanceOf(buyer);
                if (buyerTokens > 0) {
                    _burn(buyer, buyerTokens);
                }
                
                emit MortgageForeclosed(buyer, mortgage.missedPayments);
            }
        }
    }
    
    /**
     * @dev Set property appreciation value (owner only)
     * @param newValue New property value in USDT
     */
    function setPropertyAppreciation(uint256 newValue) external onlyOwner {
        require(newValue >= PROPERTY_VALUE, "Value cannot decrease");
        
        // Allow full appreciation - no cap (181% model)
        
        propertyAppreciationValue = newValue;
    }
    
    /**
     * @dev Distribute appreciation after 10 years (or when property is sold)
     */
    function distributeAppreciation() external onlyOwner {
        require(propertyAppreciationValue > PROPERTY_VALUE, "No appreciation to distribute");
        require(block.timestamp >= mortgages[msg.sender].startDate + (10 * 365 days), "10 year term not reached");
        
        uint256 totalAppreciation = propertyAppreciationValue - PROPERTY_VALUE;
        
        // Calculate splits
        uint256 buyerShare = (totalAppreciation * BUYER_SPLIT) / 100;
        uint256 ancientShare = (totalAppreciation * ANCIENT_SPLIT) / 100;
        uint256 lenderShare = (totalAppreciation * LENDER_SPLIT) / 100;
        
        // Transfer appreciation shares (simplified - would use actual USDT transfers)
        emit AppreciationDistributed(totalAppreciation, buyerShare, ancientShare, lenderShare);
    }
    
    /**
     * @dev Mint property deed NFT when mortgage is completed
     */
    function _mintPropertyDeed(address owner) internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(owner, tokenId);
        propertyDeedTokenId = tokenId;
        emit PropertyDeedMinted(owner, tokenId);
    }
    
    /**
     * @dev Calculate monthly mortgage payment
     */
    function calculateMonthlyPayment(uint256 principal) public pure returns (uint256) {
        uint256 monthlyRate = MORTGAGE_RATE / 12 / 10000; // Monthly rate in basis points
        uint256 payment = (principal * monthlyRate * (10**(MORTGAGE_TERM_MONTHS))) / 
                         ((10**(MORTGAGE_TERM_MONTHS)) - 1);
        return payment;
    }
    
    /**
     * @dev Get mortgage details for a buyer
     */
    function getMortgageDetails(address buyer) external view returns (
        uint256 downPayment,
        uint256 principalAmount,
        uint256 monthlyPayment,
        uint256 remainingBalance,
        uint256 nextPaymentDue,
        uint256 missedPayments,
        bool isActive,
        bool isForeclosed,
        bool isCompleted
    ) {
        Mortgage memory mortgage = mortgages[buyer];
        return (
            mortgage.downPayment,
            mortgage.principalAmount,
            mortgage.monthlyPayment,
            mortgage.remainingBalance,
            mortgage.nextPaymentDue,
            mortgage.missedPayments,
            mortgage.isActive,
            mortgage.isForeclosed,
            mortgage.isCompleted
        );
    }
    
    /**
     * @dev Get property status
     */
    function getPropertyStatus() external view returns (
        uint256 totalValue,
        uint256 currentValue,
        uint256 totalDownPayments,
        uint256 appreciationValue,
        bool fullyOwned
    ) {
        return (
            PROPERTY_VALUE,
            propertyAppreciationValue > 0 ? propertyAppreciationValue : PROPERTY_VALUE,
            totalDownPayments,
            propertyAppreciationValue,
            propertyFullyOwned
        );
    }
    
    /**
     * @dev Get all mortgage holders
     */
    function getMortgageHolders() external view returns (address[] memory) {
        return mortgageHolders;
    }
    
    /**
     * @dev Check if payment is overdue
     */
    function isPaymentOverdue(address buyer) external view returns (bool) {
        Mortgage memory mortgage = mortgages[buyer];
        return mortgage.isActive && block.timestamp > mortgage.nextPaymentDue;
    }
}