/**
 * TestUSDT Contract ABI
 * ERC20 test token with 6 decimals and faucet functionality
 * Source: ancient-sc submodule
 */

export const TEST_USDT_ABI = [
  // ERC20 Core Functions
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)",
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  
  // Faucet Function (Test Environment)
  "function mint(address to, uint256 amount) external",
  
  // Admin Functions
  "function pause() external",
  "function unpause() external",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
] as const;

export const TEST_USDT_ADDRESS = '0xc29837e2f495d8f04c5e7aca7d378baa8765dd36';
