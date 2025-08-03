// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title MazunteMortgage
 * @dev Smart contract for the Mazunte property mortgage system
 * Property Value: $150,000 USD
 * Monthly Rent: $2,050 USD
 * Legal Owner: Ancient Holdings Ltd (Nevis Corp)
 */
contract MazunteMortgage is ERC721, ERC20, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // Property Details
    uint256 public constant PROPERTY_VALUE = 150000 * 10**6; // $150k in USDC (6 decimals)
    uint256 public constant MONTHLY_RENT = 2050 * 10**6; // $2,050 in USDC
    uint256 public constant MIN_DOWN_PAYMENT = 30000 * 10**6; // $30k minimum
    uint256 public constant MORTGAGE_RATE = 800; // 8% APR (basis points)
    uint256 public constant MORTGAGE_TERM_MONTHS = 120; // 10 years
    
    // Contract state
    Counters.Counter private _tokenIdCounter;
    mapping(address => uint256) public investments;
    mapping(address => uint256) public lastRentalClaim;
    uint256 public totalInvested;
    uint256 public totalRentalIncome;
    uint256 public propertyDeedTokenId;
    bool public propertyFullyOwned;
    
    // Events
    event InvestmentMade(address indexed investor, uint256 amount, uint256 tokens);
    event RentalIncomeDistributed(uint256 amount, uint256 timestamp);
    event MortgagePaymentMade(uint256 amount, uint256 remainingBalance);
    event PropertyDeedMinted(address indexed owner, uint256 tokenId);
    
    constructor() 
        ERC721("Mazunte Property Deed", "MAZUNTE")
        ERC20("Mazunte Investment Token", "MAZIT")
    {
        _mint(address(this), PROPERTY_VALUE); // Mint total property value in tokens
    }
    
    /**
     * @dev Invest in the Mazunte property
     * @param amount Investment amount in USDC (6 decimals)
     */
    function invest(uint256 amount) external payable nonReentrant {
        require(amount >= MIN_DOWN_PAYMENT, "Investment below minimum");
        require(totalInvested + amount <= PROPERTY_VALUE, "Investment exceeds property value");
        
        // Calculate investment tokens (1:1 ratio with USDC)
        uint256 tokens = amount;
        
        // Transfer tokens to investor
        _transfer(address(this), msg.sender, tokens);
        
        // Update investment tracking
        investments[msg.sender] += amount;
        totalInvested += amount;
        lastRentalClaim[msg.sender] = block.timestamp;
        
        // Check if property is fully owned
        if (totalInvested >= PROPERTY_VALUE && !propertyFullyOwned) {
            propertyFullyOwned = true;
            _mintPropertyDeed();
        }
        
        emit InvestmentMade(msg.sender, amount, tokens);
    }
    
    /**
     * @dev Mint property deed NFT when fully owned
     */
    function _mintPropertyDeed() internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(address(this), tokenId); // Mint to contract initially
        propertyDeedTokenId = tokenId;
        emit PropertyDeedMinted(address(this), tokenId);
    }
    
    /**
     * @dev Distribute monthly rental income
     */
    function distributeRentalIncome() external onlyOwner {
        require(totalInvested > 0, "No investments yet");
        
        uint256 managementFee = (MONTHLY_RENT * 10) / 100; // 10% management fee
        uint256 maintenanceReserve = (MONTHLY_RENT * 5) / 100; // 5% maintenance
        uint256 distributableIncome = MONTHLY_RENT - managementFee - maintenanceReserve;
        
        totalRentalIncome += distributableIncome;
        
        emit RentalIncomeDistributed(distributableIncome, block.timestamp);
    }
    
    /**
     * @dev Claim rental income based on ownership percentage
     */
    function claimRentalIncome() external nonReentrant {
        require(investments[msg.sender] > 0, "No investment found");
        require(totalRentalIncome > 0, "No rental income to claim");
        
        uint256 ownershipPercentage = (investments[msg.sender] * 10000) / totalInvested;
        uint256 claimableAmount = (totalRentalIncome * ownershipPercentage) / 10000;
        
        // Reset claimable amount (simplified for demo)
        lastRentalClaim[msg.sender] = block.timestamp;
        
        // In production, would transfer USDC to investor
        // For demo, we emit event
        emit RentalIncomeDistributed(claimableAmount, block.timestamp);
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
     * @dev Get investor details
     */
    function getInvestorDetails(address investor) external view returns (
        uint256 investmentAmount,
        uint256 tokenBalance,
        uint256 ownershipPercentage,
        uint256 claimableRental
    ) {
        investmentAmount = investments[investor];
        tokenBalance = balanceOf(investor);
        ownershipPercentage = totalInvested > 0 ? (investmentAmount * 10000) / totalInvested : 0;
        claimableRental = totalRentalIncome > 0 ? (totalRentalIncome * ownershipPercentage) / 10000 : 0;
    }
    
    /**
     * @dev Get property status
     */
    function getPropertyStatus() external view returns (
        uint256 totalValue,
        uint256 invested,
        uint256 remaining,
        uint256 monthlyRent,
        bool fullyOwned
    ) {
        totalValue = PROPERTY_VALUE;
        invested = totalInvested;
        remaining = PROPERTY_VALUE - totalInvested;
        monthlyRent = MONTHLY_RENT;
        fullyOwned = propertyFullyOwned;
    }
}