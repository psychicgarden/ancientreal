// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./MazunteMortgage.sol";

/**
 * @title RentalIncomeDistribution
 * @dev Manages rental income distribution for Ancient properties
 */
contract RentalIncomeDistribution is Ownable, ReentrancyGuard {
    
    struct Property {
        address mortgageContract;
        uint256 monthlyRent;
        uint256 managementFeePercent;
        uint256 maintenanceFeePercent;
        uint256 totalRentalCollected;
        uint256 lastDistribution;
        bool isActive;
    }
    
    mapping(string => Property) public properties;
    mapping(address => mapping(string => uint256)) public investorClaims;
    
    // Events
    event RentalCollected(string indexed propertyId, uint256 amount, uint256 timestamp);
    event IncomeDistributed(string indexed propertyId, address indexed investor, uint256 amount);
    event PropertyAdded(string indexed propertyId, address mortgageContract);
    
    /**
     * @dev Add a property to the system
     */
    function addProperty(
        string memory propertyId,
        address mortgageContract,
        uint256 monthlyRent,
        uint256 managementFeePercent,
        uint256 maintenanceFeePercent
    ) external onlyOwner {
        properties[propertyId] = Property({
            mortgageContract: mortgageContract,
            monthlyRent: monthlyRent,
            managementFeePercent: managementFeePercent,
            maintenanceFeePercent: maintenanceFeePercent,
            totalRentalCollected: 0,
            lastDistribution: block.timestamp,
            isActive: true
        });
        
        emit PropertyAdded(propertyId, mortgageContract);
    }
    
    /**
     * @dev Collect monthly rental income for a property
     */
    function collectRental(string memory propertyId) external onlyOwner nonReentrant {
        Property storage property = properties[propertyId];
        require(property.isActive, "Property not active");
        
        uint256 grossRental = property.monthlyRent;
        uint256 managementFee = (grossRental * property.managementFeePercent) / 100;
        uint256 maintenanceFee = (grossRental * property.maintenanceFeePercent) / 100;
        uint256 netRental = grossRental - managementFee - maintenanceFee;
        
        property.totalRentalCollected += netRental;
        property.lastDistribution = block.timestamp;
        
        // Trigger distribution on the mortgage contract
        MazunteMortgage(property.mortgageContract).distributeRentalIncome();
        
        emit RentalCollected(propertyId, netRental, block.timestamp);
    }
    
    /**
     * @dev Calculate claimable income for an investor
     */
    function calculateClaimableIncome(
        string memory propertyId, 
        address investor
    ) external view returns (uint256) {
        Property memory property = properties[propertyId];
        require(property.isActive, "Property not active");
        
        MazunteMortgage mortgage = MazunteMortgage(property.mortgageContract);
        
        (uint256 investmentAmount, , uint256 ownershipPercentage, ) = 
            mortgage.getInvestorDetails(investor);
            
        if (investmentAmount == 0) return 0;
        
        uint256 totalClaimable = (property.totalRentalCollected * ownershipPercentage) / 10000;
        uint256 alreadyClaimed = investorClaims[investor][propertyId];
        
        return totalClaimable > alreadyClaimed ? totalClaimable - alreadyClaimed : 0;
    }
    
    /**
     * @dev Claim rental income for a specific property
     */
    function claimIncome(string memory propertyId) external nonReentrant {
        uint256 claimableAmount = this.calculateClaimableIncome(propertyId, msg.sender);
        require(claimableAmount > 0, "No income to claim");
        
        investorClaims[msg.sender][propertyId] += claimableAmount;
        
        // In production, transfer USDC to investor
        // For demo, emit event
        emit IncomeDistributed(propertyId, msg.sender, claimableAmount);
    }
    
    /**
     * @dev Get property rental summary
     */
    function getPropertySummary(string memory propertyId) external view returns (
        uint256 monthlyRent,
        uint256 totalCollected,
        uint256 lastDistribution,
        bool isActive
    ) {
        Property memory property = properties[propertyId];
        return (
            property.monthlyRent,
            property.totalRentalCollected,
            property.lastDistribution,
            property.isActive
        );
    }
    
    /**
     * @dev Get investor summary across all properties
     */
    function getInvestorSummary(address investor) external view returns (
        uint256 totalClaimable,
        uint256 totalClaimed
    ) {
        // In a real implementation, iterate through all properties
        // For demo, just return Mazunte data
        totalClaimable = this.calculateClaimableIncome("mazunte", investor);
        totalClaimed = investorClaims[investor]["mazunte"];
    }
}