// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title VillageCitizenship
 * @dev NFT contract for Ancient Village citizenship
 * Provides governance rights and access to all Ancient properties
 */
contract VillageCitizenship is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    uint256 public constant CITIZENSHIP_FEE = 0.1 ether; // 0.1 AVAX
    mapping(address => bool) public isCitizen;
    mapping(address => uint256) public citizenshipLevel;
    mapping(uint256 => string) public propertyAccess; // Property access by citizenship level
    
    // Events
    event CitizenshipGranted(address indexed citizen, uint256 tokenId, uint256 level);
    event PropertyAccessGranted(address indexed citizen, string property);
    event VoteCast(address indexed citizen, uint256 proposalId, bool support);
    
    constructor() ERC721("Ancient Village Citizenship", "AVC") {}
    
    /**
     * @dev Purchase village citizenship
     */
    function becomeCitizen() external payable {
        require(msg.value >= CITIZENSHIP_FEE, "Insufficient payment");
        require(!isCitizen[msg.sender], "Already a citizen");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        isCitizen[msg.sender] = true;
        citizenshipLevel[msg.sender] = 1; // Basic citizenship
        
        emit CitizenshipGranted(msg.sender, tokenId, 1);
    }
    
    /**
     * @dev Check if address has citizenship
     */
    function hasCitizenship(address user) external view returns (bool) {
        return isCitizen[user];
    }
    
    /**
     * @dev Upgrade citizenship level based on investment
     */
    function upgradeCitizenship(address citizen, uint256 investmentAmount) external onlyOwner {
        require(isCitizen[citizen], "Not a citizen");
        
        if (investmentAmount >= 100000 * 10**6) { // $100k+
            citizenshipLevel[citizen] = 3; // Premium
        } else if (investmentAmount >= 50000 * 10**6) { // $50k+
            citizenshipLevel[citizen] = 2; // Gold
        }
        // Level 1 remains for smaller investments
    }
    
    /**
     * @dev Grant property access based on citizenship level
     */
    function grantPropertyAccess(address citizen, string memory property) external onlyOwner {
        require(isCitizen[citizen], "Not a citizen");
        emit PropertyAccessGranted(citizen, property);
    }
    
    /**
     * @dev Vote on governance proposals (simplified)
     */
    function vote(uint256 proposalId, bool support) external {
        require(isCitizen[msg.sender], "Not a citizen");
        emit VoteCast(msg.sender, proposalId, support);
    }
    
    /**
     * @dev Get citizen details
     */
    function getCitizenDetails(address citizen) external view returns (
        bool hasAccess,
        uint256 level,
        uint256 tokenId
    ) {
        hasAccess = isCitizen[citizen];
        level = citizenshipLevel[citizen];
        tokenId = hasAccess ? tokenOfOwnerByIndex(citizen, 0) : 0;
    }
}