// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title MazunteToken
 * @dev MAZUNTE governance and utility token
 * 
 * Features:
 * - ERC20 standard implementation
 * - Mintable with owner controls
 * - Pausable for emergency situations
 * - Used for staking, governance, and platform utilities
 */
contract MazunteToken is ERC20, Ownable, Pausable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 1e18; // 100M max supply
    uint256 public constant INITIAL_SUPPLY = 10_000_000 * 1e18; // 10M initial supply

    // Distribution allocations
    uint256 public constant TEAM_ALLOCATION = 20_000_000 * 1e18;      // 20%
    uint256 public constant COMMUNITY_ALLOCATION = 30_000_000 * 1e18; // 30%
    uint256 public constant STAKING_REWARDS = 25_000_000 * 1e18;      // 25%
    uint256 public constant LIQUIDITY_ALLOCATION = 15_000_000 * 1e18; // 15%
    uint256 public constant RESERVE_ALLOCATION = 10_000_000 * 1e18;   // 10%

    mapping(address => bool) public minters;
    
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }

    constructor() ERC20("Mazunte Token", "MAZUNTE") {
        // Mint initial supply to deployer
        _mint(msg.sender, INITIAL_SUPPLY);
        
        // Add deployer as initial minter
        minters[msg.sender] = true;
        emit MinterAdded(msg.sender);
    }

    /**
     * @dev Mint new tokens (only minters)
     */
    function mint(address to, uint256 amount) external onlyMinter whenNotPaused {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    /**
     * @dev Add minter role
     */
    function addMinter(address minter) external onlyOwner {
        require(!minters[minter], "Already a minter");
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    /**
     * @dev Remove minter role
     */
    function removeMinter(address minter) external onlyOwner {
        require(minters[minter], "Not a minter");
        minters[minter] = false;
        emit MinterRemoved(minter);
    }

    /**
     * @dev Batch transfer for airdrops
     */
    function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) 
        external 
        whenNotPaused 
    {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            transfer(recipients[i], amounts[i]);
        }
    }

    /**
     * @dev Override transfer to add pause functionality
     */
    function transfer(address to, uint256 amount) 
        public 
        virtual 
        override 
        whenNotPaused 
        returns (bool) 
    {
        return super.transfer(to, amount);
    }

    /**
     * @dev Override transferFrom to add pause functionality
     */
    function transferFrom(address from, address to, uint256 amount) 
        public 
        virtual 
        override 
        whenNotPaused 
        returns (bool) 
    {
        return super.transferFrom(from, to, amount);
    }

    /**
     * @dev Emergency pause
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Get remaining mintable supply
     */
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }

    /**
     * @dev Faucet function for testing (only on testnets)
     */
    function faucet() external {
        require(block.chainid == 43113, "Faucet only available on testnet"); // Fuji testnet
        uint256 faucetAmount = 1000 * 1e18; // 1000 MAZUNTE
        require(totalSupply() + faucetAmount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(msg.sender, faucetAmount);
    }
}