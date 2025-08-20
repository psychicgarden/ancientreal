// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SimpleMortgage - Ultra Simple Mortgage Contract
 * @dev Handles basic property purchase and monthly payments only
 */
contract SimpleMortgage is Ownable, ReentrancyGuard {
    
    // ===== STATE VARIABLES =====
    IERC20 public immutable usdt;
    
    uint256 public constant PROPERTY_VALUE = 129000 * 10**6; // $129,000 USDT (6 decimals)
    uint256 public constant DOWN_PAYMENT = 25800 * 10**6;    // $25,800 USDT (20%)
    uint256 public constant PLATFORM_FEE = 3870 * 10**6;     // $3,870 USDT (3%)
    uint256 public constant MONTHLY_PAYMENT = 1205 * 10**6;  // $1,205 USDT
    uint256 public constant TOTAL_PAYMENTS = 120; // 10 years
    
    address public treasury;
    uint256 public totalMortgages;
    
    struct Mortgage {
        address borrower;
        uint256 paymentsLeft;
        uint256 totalPaid;
        bool isActive;
        uint256 startTime;
    }
    
    mapping(address => Mortgage) public mortgages;
    mapping(address => bool) public kycVerified;
    
    // ===== EVENTS =====
    event PropertyPurchased(address indexed borrower, uint256 downPayment, uint256 platformFee);
    event PaymentMade(address indexed borrower, uint256 amount, uint256 paymentsLeft);
    event MortgageCompleted(address indexed borrower);
    event KYCVerified(address indexed user);
    
    // ===== CONSTRUCTOR =====
    constructor(
        address _usdt,
        address _treasury
    ) {
        usdt = IERC20(_usdt);
        treasury = _treasury;
    }
    
    // ===== MODIFIERS =====
    modifier onlyKYCVerified() {
        require(kycVerified[msg.sender], "KYC verification required");
        _;
    }
    
    modifier hasActiveMortgage() {
        require(mortgages[msg.sender].isActive, "No active mortgage");
        _;
    }
    
    modifier noActiveMortgage() {
        require(!mortgages[msg.sender].isActive, "Already has active mortgage");
        _;
    }
    
    // ===== MAIN FUNCTIONS =====
    
    /**
     * @dev Verify KYC for a user (owner only for simplicity)
     */
    function verifyKYC(address user) external onlyOwner {
        kycVerified[user] = true;
        emit KYCVerified(user);
    }
    
    /**
     * @dev Purchase property with down payment + platform fee
     */
    function purchaseProperty() external onlyKYCVerified noActiveMortgage nonReentrant {
        uint256 totalRequired = DOWN_PAYMENT + PLATFORM_FEE;
        
        // Transfer down payment + platform fee from buyer
        require(
            usdt.transferFrom(msg.sender, address(this), totalRequired),
            "USDT transfer failed"
        );
        
        // Transfer platform fee to treasury
        require(
            usdt.transfer(treasury, PLATFORM_FEE),
            "Platform fee transfer failed"
        );
        
        // Create mortgage record
        mortgages[msg.sender] = Mortgage({
            borrower: msg.sender,
            paymentsLeft: TOTAL_PAYMENTS,
            totalPaid: 0,
            isActive: true,
            startTime: block.timestamp
        });
        
        totalMortgages++;
        
        emit PropertyPurchased(msg.sender, DOWN_PAYMENT, PLATFORM_FEE);
    }
    
    /**
     * @dev Make monthly mortgage payment
     */
    function makePayment() external hasActiveMortgage nonReentrant {
        Mortgage storage mortgage = mortgages[msg.sender];
        
        require(mortgage.paymentsLeft > 0, "Mortgage already completed");
        
        // Transfer payment from borrower
        require(
            usdt.transferFrom(msg.sender, address(this), MONTHLY_PAYMENT),
            "Payment transfer failed"
        );
        
        // Update mortgage state
        mortgage.totalPaid += MONTHLY_PAYMENT;
        mortgage.paymentsLeft--;
        
        emit PaymentMade(msg.sender, MONTHLY_PAYMENT, mortgage.paymentsLeft);
        
        // Complete mortgage if all payments made
        if (mortgage.paymentsLeft == 0) {
            mortgage.isActive = false;
            emit MortgageCompleted(msg.sender);
        }
    }
    
    // ===== VIEW FUNCTIONS =====
    
    /**
     * @dev Get mortgage details for a borrower
     */
    function getMortgageDetails(address borrower) external view returns (
        uint256 paymentsLeft,
        uint256 totalPaid,
        bool isActive,
        uint256 startTime
    ) {
        Mortgage memory mortgage = mortgages[borrower];
        return (
            mortgage.paymentsLeft,
            mortgage.totalPaid,
            mortgage.isActive,
            mortgage.startTime
        );
    }
    
    /**
     * @dev Check if user has KYC verification
     */
    function isKYCVerified(address user) external view returns (bool) {
        return kycVerified[user];
    }
    
    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return usdt.balanceOf(address(this));
    }
    
    // ===== ADMIN FUNCTIONS =====
    
    /**
     * @dev Withdraw contract balance (owner only)
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(
            usdt.transfer(owner(), amount),
            "Withdrawal failed"
        );
    }
    
    /**
     * @dev Update treasury address (owner only)
     */
    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }
}