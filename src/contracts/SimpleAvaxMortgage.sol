// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SimpleAvaxMortgage is Ownable, ReentrancyGuard {
    
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
    
    constructor() {}
    
    function purchaseProperty(
        uint256 _propertyValue,
        uint256 _termMonths
    ) external payable nonReentrant {
        require(!hasMortgage[msg.sender], "Already has active mortgage");
        require(msg.value >= (_propertyValue * 2000) / BASIS_POINTS, "Minimum 20% down payment required");
        require(_termMonths >= 12 && _termMonths <= 360, "Term must be between 1 and 30 years");
        
        uint256 fixedInterestRate = 800; // Fixed 8% APR in basis points
        uint256 downPayment = msg.value;
        uint256 loanAmount = _propertyValue - downPayment;
        require(loanAmount > 0, "Invalid loan amount");
        
        // Calculate monthly payment using amortization formula
        uint256 monthlyPayment = calculateMonthlyPayment(loanAmount, fixedInterestRate, _termMonths);
        
        // Create mortgage
        mortgages[msg.sender] = Mortgage({
            propertyValue: _propertyValue,
            downPayment: downPayment,
            loanAmount: loanAmount,
            monthlyPayment: monthlyPayment,
            remainingBalance: loanAmount,
            interestRate: fixedInterestRate,
            termMonths: _termMonths,
            monthsPaid: 0,
            nextPaymentDue: block.timestamp + PAYMENT_INTERVAL,
            isActive: true,
            borrower: msg.sender
        });
        
        hasMortgage[msg.sender] = true;
        
        emit MortgageCreated(msg.sender, _propertyValue, downPayment, loanAmount, monthlyPayment);
    }
    
    function makePayment() external payable nonReentrant {
        require(hasMortgage[msg.sender], "No active mortgage");
        Mortgage storage mortgage = mortgages[msg.sender];
        require(mortgage.isActive, "Mortgage not active");
        
        uint256 paymentAmount = mortgage.monthlyPayment;
        require(msg.value >= paymentAmount, "Insufficient payment amount");
        
        // Calculate interest and principal portions
        uint256 interestPayment = (mortgage.remainingBalance * mortgage.interestRate) / (12 * BASIS_POINTS);
        uint256 principalPayment = paymentAmount - interestPayment;
        
        // Ensure we don't overpay
        if (principalPayment > mortgage.remainingBalance) {
            principalPayment = mortgage.remainingBalance;
            paymentAmount = interestPayment + principalPayment;
        }
        
        // Refund excess payment
        if (msg.value > paymentAmount) {
            payable(msg.sender).transfer(msg.value - paymentAmount);
        }
        
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
        
        uint256 monthlyRate = _interestRate / (12 * BASIS_POINTS);
        
        if (monthlyRate == 0) {
            return _loanAmount / _termMonths;
        }
        
        // Simplified monthly payment calculation
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
        require(address(this).balance >= _amount, "Insufficient contract balance");
        payable(owner()).transfer(_amount);
    }
    
    function emergencyPause(address _borrower) external onlyOwner {
        mortgages[_borrower].isActive = false;
    }
    
    // Get contract balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}