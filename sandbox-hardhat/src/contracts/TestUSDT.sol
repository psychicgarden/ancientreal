// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TestUSDT - Test Token for Demo Mode
 * @dev Simple ERC20 token with faucet functionality for testing
 */
contract TestUSDT is ERC20, Ownable {
    uint8 private _decimals = 6; // Match USDT decimals
    uint256 public faucetAmount = 1000 * 10**6; // 1,000 test USDT
    mapping(address => uint256) public lastFaucetClaim;
    uint256 public faucetCooldown = 1 hours;

    event FaucetClaimed(address indexed user, uint256 amount);

    constructor() ERC20("Test USDT", "tUSDT") {
        // Mint initial supply to deployer
        _mint(msg.sender, 1000000 * 10**6); // 1M test USDT
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Faucet function to get free test tokens
     */
    function faucet() external {
        require(
            block.timestamp >= lastFaucetClaim[msg.sender] + faucetCooldown,
            "Faucet cooldown active"
        );
        
        lastFaucetClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, faucetAmount);
        
        emit FaucetClaimed(msg.sender, faucetAmount);
    }

    /**
     * @dev Set faucet amount (owner only)
     */
    function setFaucetAmount(uint256 _amount) external onlyOwner {
        faucetAmount = _amount;
    }

    /**
     * @dev Set faucet cooldown (owner only)
     */
    function setFaucetCooldown(uint256 _cooldown) external onlyOwner {
        faucetCooldown = _cooldown;
    }

    /**
     * @dev Emergency mint for testing (owner only)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}