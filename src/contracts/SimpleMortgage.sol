// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SimpleMortgage is Ownable, ReentrancyGuard {
    IERC20 public immutable USDT;
    
    struct Mortgage {
        uint256 propertyValue;
        uint256 downPayment;
        uint256 loanAmount;
        uint256 monthlyPayment;
        uint256 remainingBalance;
        uint256 interestRate; // in basis points (e.g., 800 = 8%)
        uint256 termMonths;
        uint256 monthsPaid;
        uint256 nextPaymentDue;
        bool isActive;
        address borrower;
    }
    
    mapping(address => Mortgage) public mortgages;
    mapping(address => bool) public hasMortgage;
    
    uint256 public constant PAYMENT_INTERVAL = 30 days;
    uint256 public constant BASIS_POINTS = 10000;
    
    event MortgageCreated(
        address indexed borrower,
        uint256 propertyValue,
        uint256 downPayment,
        uint256 loanAmount,
        uint256 monthlyPayment
    );
    
    event PaymentMade(
        address indexed borrower,
        uint256 paymentAmount,
        uint256 principalPaid,
        uint256 interestPaid,
        uint256 remainingBalance
    );
    
    event MortgageCompleted(address indexed borrower, uint256 totalPaid);
    
    constructor(address _usdtAddress) {
        USDT = IERC20(_usdtAddress);
    }
    
    function purchaseProperty(
        uint256 _propertyValue,
        uint256 _downPayment,
        uint256 _interestRate, // in basis points
        uint256 _termMonths
    ) external nonReentrant {
        require(!hasMortgage[msg.sender], "Already has active mortgage");
        require(_downPayment >= (_propertyValue * 2000) / BASIS_POINTS, "Minimum 20% down payment required");
        require(_interestRate >= 200 && _interestRate <= 3000, "Interest rate must be between 2% and 30%");
        require(_termMonths >= 12 && _termMonths <= 360, "Term must be between 1 and 30 years");
        
        uint256 loanAmount = _propertyValue - _downPayment;
        require(loanAmount > 0, "Invalid loan amount");
        
        // Calculate monthly payment using amortization formula
        uint256 monthlyPayment = calculateMonthlyPayment(loanAmount, _interestRate, _termMonths);
        
        // Transfer down payment from borrower
        require(USDT.transferFrom(msg.sender, address(this), _downPayment), "Down payment transfer failed");
        
        // Create mortgage
        mortgages[msg.sender] = Mortgage({
            propertyValue: _propertyValue,
            downPayment: _downPayment,
            loanAmount: loanAmount,
            monthlyPayment: monthlyPayment,
            remainingBalance: loanAmount,
            interestRate: _interestRate,
            termMonths: _termMonths,
            monthsPaid: 0,
            nextPaymentDue: block.timestamp + PAYMENT_INTERVAL,
            isActive: true,
            borrower: msg.sender
        });
        
        hasMortgage[msg.sender] = true;
        
        emit MortgageCreated(msg.sender, _propertyValue, _downPayment, loanAmount, monthlyPayment);
    }
    
    function makePayment() external nonReentrant {
        require(hasMortgage[msg.sender], "No active mortgage");
        Mortgage storage mortgage = mortgages[msg.sender];
        require(mortgage.isActive, "Mortgage not active");
        
        uint256 paymentAmount = mortgage.monthlyPayment;
        require(USDT.balanceOf(msg.sender) >= paymentAmount, "Insufficient USDT balance");
        
        // Calculate interest and principal portions
        uint256 interestPayment = (mortgage.remainingBalance * mortgage.interestRate) / (12 * BASIS_POINTS);
        uint256 principalPayment = paymentAmount - interestPayment;
        
        // Ensure we don't overpay
        if (principalPayment > mortgage.remainingBalance) {
            principalPayment = mortgage.remainingBalance;
            paymentAmount = interestPayment + principalPayment;
        }
        
        // Transfer payment from borrower
        require(USDT.transferFrom(msg.sender, address(this), paymentAmount), "Payment transfer failed");
        
        // Update mortgage state
        mortgage.remainingBalance -= principalPayment;
        mortgage.monthsPaid += 1;
        mortgage.nextPaymentDue = block.timestamp + PAYMENT_INTERVAL;
        
        // Check if mortgage is completed
        if (mortgage.remainingBalance == 0) {
            mortgage.isActive = false;
            emit MortgageCompleted(msg.sender, mortgage.loanAmount);
        }
        
        emit PaymentMade(msg.sender, paymentAmount, principalPayment, interestPayment, mortgage.remainingBalance);
    }
    
    function calculateMonthlyPayment(
        uint256 _loanAmount,
        uint256 _interestRate,
        uint256 _termMonths
    ) public pure returns (uint256) {
        if (_loanAmount == 0) return 0;
        
        uint256 monthlyRate = (_interestRate * BASIS_POINTS) / (12 * BASIS_POINTS * BASIS_POINTS);
        
        if (monthlyRate == 0) {
            return _loanAmount / _termMonths;
        }
        
        // Simplified monthly payment calculation
        // For production, use more accurate amortization formula
        uint256 basePayment = _loanAmount / _termMonths;
        uint256 interestComponent = (_loanAmount * _interestRate) / (12 * BASIS_POINTS);
        
        return basePayment + (interestComponent * 60 / 100); // Rough approximation
    }
    
    function getMortgageDetails(address _borrower) external view returns (Mortgage memory) {
        require(hasMortgage[_borrower], "No mortgage found");
        return mortgages[_borrower];
    }
    
    function isPaymentOverdue(address _borrower) external view returns (bool) {
        if (!hasMortgage[_borrower]) return false;
        Mortgage storage mortgage = mortgages[_borrower];
        return mortgage.isActive && block.timestamp > mortgage.nextPaymentDue;
    }
    
    // Owner functions
    function withdrawFunds(uint256 _amount) external onlyOwner {
        require(USDT.transfer(owner(), _amount), "Withdraw failed");
    }
    
    function emergencyPause(address _borrower) external onlyOwner {
        mortgages[_borrower].isActive = false;
    }
}