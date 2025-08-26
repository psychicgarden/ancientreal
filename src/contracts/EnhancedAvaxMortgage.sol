// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EnhancedAvaxMortgage is Ownable, ReentrancyGuard, ERC721 {
    
    struct Property {
        uint256 propertyId;
        string name;
        string location;
        string imageUrl;
        uint256 totalValue;
        bool isActive;
    }
    
    struct Mortgage {
        uint256 propertyId;
        uint256 propertyValue;
        uint256 downPayment;
        uint256 loanAmount;
        uint256 monthlyPayment;
        uint256 remainingBalance;
        uint256 interestRate; // in basis points (e.g., 800 = 8%)
        uint256 termMonths;
        uint256 monthsPaid;
        uint256 nextPaymentDue;
        uint256 totalPaid;
        bool isActive;
        address borrower;
        uint256 createdAt;
    }
    
    // Storage mappings
    mapping(uint256 => Property) public properties;
    mapping(address => Mortgage) public mortgages;
    mapping(address => bool) public hasMortgage;
    mapping(uint256 => address) public propertyOwners; // NFT tokenId => owner
    
    uint256 public nextPropertyId = 1;
    uint256 public nextTokenId = 1;
    uint256 public constant PAYMENT_INTERVAL = 30 days;
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant PLATFORM_FEE_BPS = 300; // 3% platform fee
    
    event PropertyAdded(
        uint256 indexed propertyId,
        string name,
        string location,
        uint256 totalValue
    );
    
    event MortgageCreated(
        address indexed borrower,
        uint256 indexed propertyId,
        uint256 indexed tokenId,
        uint256 propertyValue,
        uint256 downPayment,
        uint256 loanAmount,
        uint256 monthlyPayment,
        uint256 platformFee
    );
    
    event PlatformFeeCollected(
        address indexed borrower,
        uint256 indexed propertyId,
        uint256 feeAmount
    );
    
    event PaymentMade(
        address indexed borrower,
        uint256 indexed propertyId,
        uint256 paymentAmount,
        uint256 principalPaid,
        uint256 interestPaid,
        uint256 remainingBalance
    );
    
    event MortgageCompleted(
        address indexed borrower,
        uint256 indexed propertyId,
        uint256 totalPaid
    );
    
    constructor() ERC721("Property Ownership", "PROP") {}
    
    // Owner function to add properties to the contract
    function addProperty(
        string memory _name,
        string memory _location,
        string memory _imageUrl,
        uint256 _totalValue
    ) external onlyOwner returns (uint256) {
        uint256 propertyId = nextPropertyId++;
        
        properties[propertyId] = Property({
            propertyId: propertyId,
            name: _name,
            location: _location,
            imageUrl: _imageUrl,
            totalValue: _totalValue,
            isActive: true
        });
        
        emit PropertyAdded(propertyId, _name, _location, _totalValue);
        return propertyId;
    }
    
    function purchaseProperty(
        uint256 _propertyId,
        uint256 _termMonths
    ) external payable nonReentrant {
        require(!hasMortgage[msg.sender], "Already has active mortgage");
        require(properties[_propertyId].isActive, "Property not available");
        
        Property memory property = properties[_propertyId];
        uint256 propertyValue = property.totalValue;
        
        // Calculate required amounts
        uint256 minDownPayment = (propertyValue * 2000) / BASIS_POINTS; // 20%
        uint256 platformFee = (propertyValue * PLATFORM_FEE_BPS) / BASIS_POINTS; // 3%
        uint256 totalRequired = minDownPayment + platformFee;
        
        require(msg.value >= totalRequired, "Insufficient payment: need down payment + platform fee");
        require(_termMonths >= 12 && _termMonths <= 360, "Term must be between 1 and 30 years");
        
        uint256 fixedInterestRate = 800; // Fixed 8% APR in basis points
        uint256 downPayment = msg.value - platformFee; // Actual down payment after platform fee
        uint256 loanAmount = propertyValue - downPayment;
        require(loanAmount > 0, "Invalid loan amount");
        
        // Calculate monthly payment using amortization formula
        uint256 monthlyPayment = calculateMonthlyPayment(loanAmount, fixedInterestRate, _termMonths);
        
        // Mint NFT representing property ownership
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        propertyOwners[tokenId] = msg.sender;
        
        // Create mortgage
        mortgages[msg.sender] = Mortgage({
            propertyId: _propertyId,
            propertyValue: propertyValue,
            downPayment: downPayment,
            loanAmount: loanAmount,
            monthlyPayment: monthlyPayment,
            remainingBalance: loanAmount,
            interestRate: fixedInterestRate,
            termMonths: _termMonths,
            monthsPaid: 0,
            nextPaymentDue: block.timestamp + PAYMENT_INTERVAL,
            totalPaid: downPayment,
            isActive: true,
            borrower: msg.sender,
            createdAt: block.timestamp
        });
        
        hasMortgage[msg.sender] = true;
        
        // Emit platform fee collection event
        emit PlatformFeeCollected(msg.sender, _propertyId, platformFee);
        
        emit MortgageCreated(
            msg.sender, 
            _propertyId, 
            tokenId,
            propertyValue, 
            downPayment, 
            loanAmount, 
            monthlyPayment,
            platformFee
        );
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
        mortgage.totalPaid += paymentAmount;
        
        // Check if mortgage is completed
        if (mortgage.remainingBalance == 0) {
            mortgage.isActive = false;
            emit MortgageCompleted(msg.sender, mortgage.propertyId, mortgage.totalPaid);
        }
        
        emit PaymentMade(
            msg.sender, 
            mortgage.propertyId,
            paymentAmount, 
            principalPayment, 
            interestPayment, 
            mortgage.remainingBalance
        );
    }
    
    function calculateMonthlyPayment(
        uint256 _loanAmount,
        uint256 _interestRate,
        uint256 _termMonths
    ) public pure returns (uint256) {
        if (_loanAmount == 0) return 0;
        
        uint256 monthlyRate = (_interestRate * 1e18) / (12 * BASIS_POINTS); // Scale for precision
        
        if (monthlyRate == 0) {
            return _loanAmount / _termMonths;
        }
        
        // Standard amortization formula: P * [r(1+r)^n] / [(1+r)^n - 1]
        uint256 compound = 1e18; // Start with 1.0 in 18 decimal precision
        
        // Calculate (1 + monthlyRate)^termMonths
        for (uint256 i = 0; i < _termMonths; i++) {
            compound = (compound * (1e18 + monthlyRate)) / 1e18;
        }
        
        uint256 numerator = (_loanAmount * monthlyRate * compound) / 1e18;
        uint256 denominator = compound - 1e18;
        
        return numerator / (denominator / 1e18);
    }
    
    // View functions
    function getProperty(uint256 _propertyId) external view returns (Property memory) {
        require(properties[_propertyId].isActive, "Property not found");
        return properties[_propertyId];
    }
    
    function getMortgageDetails(address _borrower) external view returns (Mortgage memory) {
        require(hasMortgage[_borrower], "No mortgage found");
        return mortgages[_borrower];
    }
    
    function getPropertyByOwner(address _owner) external view returns (Property memory) {
        require(hasMortgage[_owner], "No mortgage found");
        uint256 propertyId = mortgages[_owner].propertyId;
        return properties[propertyId];
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
    
    function updatePropertyStatus(uint256 _propertyId, bool _isActive) external onlyOwner {
        properties[_propertyId].isActive = _isActive;
    }
    
    // Get contract balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Get total active mortgages
    function getTotalProperties() external view returns (uint256) {
        return nextPropertyId - 1;
    }
}