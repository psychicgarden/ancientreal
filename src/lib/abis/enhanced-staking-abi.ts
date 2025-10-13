/**
 * EnhancedStakingPool Contract ABI
 * ERC4626 staking vault for investor yields from mortgage interest
 * Source: ancient-sc submodule
 */

export const ENHANCED_STAKING_ABI = [
  // ERC4626 Core Functions
  "function deposit(uint256 assets, address receiver) external returns (uint256 shares)",
  "function mint(uint256 shares, address receiver) external returns (uint256 assets)",
  "function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares)",
  "function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets)",
  
  // ERC4626 View Functions
  "function asset() external view returns (address)",
  "function totalAssets() external view returns (uint256)",
  "function convertToShares(uint256 assets) external view returns (uint256)",
  "function convertToAssets(uint256 shares) external view returns (uint256)",
  "function maxDeposit(address receiver) external view returns (uint256)",
  "function maxMint(address receiver) external view returns (uint256)",
  "function maxWithdraw(address owner) external view returns (uint256)",
  "function maxRedeem(address owner) external view returns (uint256)",
  "function previewDeposit(uint256 assets) external view returns (uint256)",
  "function previewMint(uint256 shares) external view returns (uint256)",
  "function previewWithdraw(uint256 assets) external view returns (uint256)",
  "function previewRedeem(uint256 shares) external view returns (uint256)",
  
  // Yield Distribution (Called by AncientMortgage)
  "function receiveMortgageInterest(uint256 interestAmount) external",
  "function receiveAppreciationShare(uint256 appreciationAmount) external",
  
  // Pool Metrics
  "function getCurrentAPY() external view returns (uint256)",
  "function getPoolMetrics() external view returns (tuple(uint256 totalAssets, uint256 totalShares, uint256 totalInterestReceived, uint256 totalAppreciationReceived, uint256 currentAPY, uint256 participantCount))",
  "function getUserYieldEarned(address user) external view returns (uint256)",
  "function getExpectedReturns() external view returns (tuple(uint256 minAPY, uint256 maxAPY, string yieldSource))",
  
  // Admin Functions
  "function setMinimumDeposit(uint256 newMinimum) external",
  "function setManagementFee(uint256 newFeeBps) external",
  "function injectExternalYield(uint256 amount) external",
  "function emergencyPause() external",
  "function unpause() external",
  "function emergencyWithdrawFunds(uint256 amount) external",
  
  // ERC20 Token Functions (Shares)
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)",
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  
  // Events
  "event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)",
  "event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)",
  "event MortgageInterestReceived(uint256 amount)",
  "event AppreciationShareReceived(uint256 amount)",
  "event YieldDistributed(uint256 yieldAmount, uint256 newCumulativeYieldPerShare)",
  "event ManagementFeeCollected(uint256 feeAmount, address treasury)"
] as const;

export const ENHANCED_STAKING_ADDRESS = '0x474ebf5b375ea4dae1b5ae33f86cb0f30e82af27';
