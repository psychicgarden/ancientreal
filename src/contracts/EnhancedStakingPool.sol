// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title EnhancedStakingPool
 * @dev Advanced staking pool with multiple tiers, time-locks, and yield optimization
 * 
 * Features:
 * - Multi-tier staking with different APY rates
 * - Time-locked staking for higher yields
 * - Auto-compounding mechanisms
 * - Governance token distribution
 * - Emergency withdrawal with penalties
 */
contract EnhancedStakingPool is Ownable, ReentrancyGuard, Pausable {
    using SafeMath for uint256;

    IERC20 public immutable stakingToken; // MAZUNTE token
    IERC20 public immutable rewardToken;  // USDT rewards
    address public immutable treasury;

    struct StakingTier {
        uint256 minAmount;
        uint256 maxAmount;
        uint256 apyBasisPoints; // Annual percentage yield in basis points
        uint256 lockPeriod;     // Lock period in seconds
        bool isActive;
    }

    struct Stake {
        uint256 amount;
        uint256 tierIndex;
        uint256 startTime;
        uint256 lockEndTime;
        uint256 lastRewardCalculation;
        uint256 accumulatedRewards;
        uint256 pendingRewards;
        bool isActive;
        bool autoCompound;
    }

    struct UserStats {
        uint256 totalStaked;
        uint256 totalRewardsEarned;
        uint256 activeStakes;
        uint256 lastStakeTime;
    }

    // Staking tiers configuration
    StakingTier[] public stakingTiers;
    
    // User staking data
    mapping(address => Stake[]) public userStakes;
    mapping(address => UserStats) public userStats;
    
    // Pool statistics
    uint256 public totalValueLocked;
    uint256 public totalRewardsDistributed;
    uint256 public emergencyWithdrawalFeeRate = 1000; // 10% fee for emergency withdrawals
    uint256 public constant SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
    uint256 public constant BASIS_POINTS = 10000;

    // Auto-compounding settings
    uint256 public autoCompoundThreshold = 10 * 1e6; // 10 USDT minimum for auto-compound
    mapping(address => bool) public autoCompoundEnabled;

    // Events
    event Staked(address indexed user, uint256 amount, uint256 tierIndex, uint256 stakeIndex);
    event Unstaked(address indexed user, uint256 amount, uint256 rewards, uint256 stakeIndex);
    event RewardsClaimed(address indexed user, uint256 amount);
    event RewardsCompounded(address indexed user, uint256 amount);
    event EmergencyWithdrawal(address indexed user, uint256 amount, uint256 fee);
    event TierAdded(uint256 indexed tierIndex, uint256 minAmount, uint256 apyBasisPoints);
    event TierUpdated(uint256 indexed tierIndex, uint256 minAmount, uint256 apyBasisPoints);

    modifier validTier(uint256 tierIndex) {
        require(tierIndex < stakingTiers.length, "Invalid tier");
        require(stakingTiers[tierIndex].isActive, "Tier not active");
        _;
    }

    modifier validStake(address user, uint256 stakeIndex) {
        require(stakeIndex < userStakes[user].length, "Invalid stake index");
        require(userStakes[user][stakeIndex].isActive, "Stake not active");
        _;
    }

    constructor(
        address _stakingToken,
        address _rewardToken,
        address _treasury
    ) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
        treasury = _treasury;

        // Initialize default staking tiers
        _initializeDefaultTiers();
    }

    /**
     * @dev Initialize default staking tiers
     */
    function _initializeDefaultTiers() internal {
        // Tier 0: Basic (7 days lock, 8% APY)
        stakingTiers.push(StakingTier({
            minAmount: 100 * 1e18,     // 100 tokens minimum
            maxAmount: 10000 * 1e18,   // 10,000 tokens maximum
            apyBasisPoints: 800,       // 8% APY
            lockPeriod: 7 * 24 * 60 * 60,  // 7 days
            isActive: true
        }));

        // Tier 1: Premium (30 days lock, 12% APY)
        stakingTiers.push(StakingTier({
            minAmount: 1000 * 1e18,    // 1,000 tokens minimum
            maxAmount: 50000 * 1e18,   // 50,000 tokens maximum
            apyBasisPoints: 1200,      // 12% APY
            lockPeriod: 30 * 24 * 60 * 60, // 30 days
            isActive: true
        }));

        // Tier 2: Elite (90 days lock, 18% APY)
        stakingTiers.push(StakingTier({
            minAmount: 5000 * 1e18,    // 5,000 tokens minimum
            maxAmount: 100000 * 1e18,  // 100,000 tokens maximum
            apyBasisPoints: 1800,      // 18% APY
            lockPeriod: 90 * 24 * 60 * 60, // 90 days
            isActive: true
        }));

        // Tier 3: Legendary (365 days lock, 25% APY)
        stakingTiers.push(StakingTier({
            minAmount: 20000 * 1e18,   // 20,000 tokens minimum
            maxAmount: 500000 * 1e18,  // 500,000 tokens maximum
            apyBasisPoints: 2500,      // 25% APY
            lockPeriod: 365 * 24 * 60 * 60, // 365 days
            isActive: true
        }));
    }

    /**
     * @dev Stake tokens in specified tier
     */
    function stake(uint256 amount, uint256 tierIndex, bool enableAutoCompound) 
        external 
        validTier(tierIndex) 
        nonReentrant 
        whenNotPaused 
    {
        require(amount > 0, "Amount must be positive");
        
        StakingTier storage tier = stakingTiers[tierIndex];
        require(amount >= tier.minAmount, "Below minimum stake amount");
        require(amount <= tier.maxAmount, "Exceeds maximum stake amount");

        require(stakingToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        userStakes[msg.sender].push(Stake({
            amount: amount,
            tierIndex: tierIndex,
            startTime: block.timestamp,
            lockEndTime: block.timestamp + tier.lockPeriod,
            lastRewardCalculation: block.timestamp,
            accumulatedRewards: 0,
            pendingRewards: 0,
            isActive: true,
            autoCompound: enableAutoCompound
        }));

        // Update user stats
        UserStats storage stats = userStats[msg.sender];
        stats.totalStaked = stats.totalStaked.add(amount);
        stats.activeStakes = stats.activeStakes.add(1);
        stats.lastStakeTime = block.timestamp;

        // Update pool stats
        totalValueLocked = totalValueLocked.add(amount);

        // Enable auto-compound if requested
        if (enableAutoCompound) {
            autoCompoundEnabled[msg.sender] = true;
        }

        uint256 stakeIndex = userStakes[msg.sender].length - 1;
        emit Staked(msg.sender, amount, tierIndex, stakeIndex);
    }

    /**
     * @dev Calculate pending rewards for a stake
     */
    function calculatePendingRewards(address user, uint256 stakeIndex) 
        public 
        view 
        validStake(user, stakeIndex) 
        returns (uint256) 
    {
        Stake storage userStake = userStakes[user][stakeIndex];
        StakingTier storage tier = stakingTiers[userStake.tierIndex];

        uint256 timeStaked = block.timestamp.sub(userStake.lastRewardCalculation);
        uint256 yearlyReward = userStake.amount.mul(tier.apyBasisPoints).div(BASIS_POINTS);
        uint256 pendingReward = yearlyReward.mul(timeStaked).div(SECONDS_PER_YEAR);

        return userStake.pendingRewards.add(pendingReward);
    }

    /**
     * @dev Update rewards for a specific stake
     */
    function updateStakeRewards(address user, uint256 stakeIndex) 
        public 
        validStake(user, stakeIndex) 
    {
        Stake storage userStake = userStakes[user][stakeIndex];
        
        uint256 newRewards = calculatePendingRewards(user, stakeIndex).sub(userStake.pendingRewards);
        userStake.pendingRewards = userStake.pendingRewards.add(newRewards);
        userStake.lastRewardCalculation = block.timestamp;

        // Auto-compound if enabled and threshold met
        if (userStake.autoCompound && userStake.pendingRewards >= autoCompoundThreshold) {
            _autoCompound(user, stakeIndex);
        }
    }

    /**
     * @dev Auto-compound rewards into staking amount
     */
    function _autoCompound(address user, uint256 stakeIndex) internal {
        Stake storage userStake = userStakes[user][stakeIndex];
        uint256 compoundAmount = userStake.pendingRewards;

        if (compoundAmount > 0) {
            // Convert USDT rewards to staking tokens (simplified 1:1 for demo)
            userStake.amount = userStake.amount.add(compoundAmount);
            userStake.accumulatedRewards = userStake.accumulatedRewards.add(compoundAmount);
            userStake.pendingRewards = 0;

            totalValueLocked = totalValueLocked.add(compoundAmount);
            userStats[user].totalStaked = userStats[user].totalStaked.add(compoundAmount);

            emit RewardsCompounded(user, compoundAmount);
        }
    }

    /**
     * @dev Claim rewards without unstaking
     */
    function claimRewards(uint256 stakeIndex) 
        external 
        validStake(msg.sender, stakeIndex) 
        nonReentrant 
    {
        updateStakeRewards(msg.sender, stakeIndex);
        
        Stake storage userStake = userStakes[msg.sender][stakeIndex];
        uint256 rewards = userStake.pendingRewards;
        
        require(rewards > 0, "No rewards to claim");

        userStake.pendingRewards = 0;
        userStake.accumulatedRewards = userStake.accumulatedRewards.add(rewards);

        userStats[msg.sender].totalRewardsEarned = userStats[msg.sender].totalRewardsEarned.add(rewards);
        totalRewardsDistributed = totalRewardsDistributed.add(rewards);

        require(rewardToken.transfer(msg.sender, rewards), "Reward transfer failed");

        emit RewardsClaimed(msg.sender, rewards);
    }

    /**
     * @dev Unstake tokens after lock period
     */
    function unstake(uint256 stakeIndex) 
        external 
        validStake(msg.sender, stakeIndex) 
        nonReentrant 
    {
        Stake storage userStake = userStakes[msg.sender][stakeIndex];
        require(block.timestamp >= userStake.lockEndTime, "Stake still locked");

        updateStakeRewards(msg.sender, stakeIndex);

        uint256 stakedAmount = userStake.amount;
        uint256 rewards = userStake.pendingRewards;
        uint256 totalReturn = stakedAmount.add(rewards);

        // Update stake status
        userStake.isActive = false;

        // Update user stats
        UserStats storage stats = userStats[msg.sender];
        stats.totalStaked = stats.totalStaked.sub(stakedAmount);
        stats.activeStakes = stats.activeStakes.sub(1);
        stats.totalRewardsEarned = stats.totalRewardsEarned.add(rewards);

        // Update pool stats
        totalValueLocked = totalValueLocked.sub(stakedAmount);
        totalRewardsDistributed = totalRewardsDistributed.add(rewards);

        // Transfer tokens and rewards
        require(stakingToken.transfer(msg.sender, stakedAmount), "Stake transfer failed");
        if (rewards > 0) {
            require(rewardToken.transfer(msg.sender, rewards), "Reward transfer failed");
        }

        emit Unstaked(msg.sender, stakedAmount, rewards, stakeIndex);
    }

    /**
     * @dev Emergency unstake with penalty (before lock period ends)
     */
    function emergencyUnstake(uint256 stakeIndex) 
        external 
        validStake(msg.sender, stakeIndex) 
        nonReentrant 
    {
        Stake storage userStake = userStakes[msg.sender][stakeIndex];
        require(block.timestamp < userStake.lockEndTime, "Use regular unstake");

        uint256 stakedAmount = userStake.amount;
        uint256 fee = stakedAmount.mul(emergencyWithdrawalFeeRate).div(BASIS_POINTS);
        uint256 returnAmount = stakedAmount.sub(fee);

        // Update stake status
        userStake.isActive = false;

        // Update user stats (no rewards for emergency withdrawal)
        UserStats storage stats = userStats[msg.sender];
        stats.totalStaked = stats.totalStaked.sub(stakedAmount);
        stats.activeStakes = stats.activeStakes.sub(1);

        // Update pool stats
        totalValueLocked = totalValueLocked.sub(stakedAmount);

        // Transfer tokens (minus fee) and send fee to treasury
        require(stakingToken.transfer(msg.sender, returnAmount), "Transfer failed");
        require(stakingToken.transfer(treasury, fee), "Fee transfer failed");

        emit EmergencyWithdrawal(msg.sender, returnAmount, fee);
    }

    /**
     * @dev Batch update rewards for multiple stakes
     */
    function batchUpdateRewards(address user, uint256[] calldata stakeIndices) external {
        for (uint256 i = 0; i < stakeIndices.length; i++) {
            if (stakeIndices[i] < userStakes[user].length && userStakes[user][stakeIndices[i]].isActive) {
                updateStakeRewards(user, stakeIndices[i]);
            }
        }
    }

    /**
     * @dev Get user's active stakes
     */
    function getUserStakes(address user) external view returns (Stake[] memory) {
        return userStakes[user];
    }

    /**
     * @dev Get total pending rewards for user
     */
    function getTotalPendingRewards(address user) external view returns (uint256) {
        uint256 totalPending = 0;
        for (uint256 i = 0; i < userStakes[user].length; i++) {
            if (userStakes[user][i].isActive) {
                totalPending = totalPending.add(calculatePendingRewards(user, i));
            }
        }
        return totalPending;
    }

    /**
     * @dev Get staking tier information
     */
    function getStakingTiers() external view returns (StakingTier[] memory) {
        return stakingTiers;
    }

    // Admin functions
    function addStakingTier(
        uint256 minAmount,
        uint256 maxAmount,
        uint256 apyBasisPoints,
        uint256 lockPeriod
    ) external onlyOwner {
        stakingTiers.push(StakingTier({
            minAmount: minAmount,
            maxAmount: maxAmount,
            apyBasisPoints: apyBasisPoints,
            lockPeriod: lockPeriod,
            isActive: true
        }));

        emit TierAdded(stakingTiers.length - 1, minAmount, apyBasisPoints);
    }

    function updateStakingTier(
        uint256 tierIndex,
        uint256 minAmount,
        uint256 maxAmount,
        uint256 apyBasisPoints,
        uint256 lockPeriod,
        bool isActive
    ) external onlyOwner validTier(tierIndex) {
        StakingTier storage tier = stakingTiers[tierIndex];
        tier.minAmount = minAmount;
        tier.maxAmount = maxAmount;
        tier.apyBasisPoints = apyBasisPoints;
        tier.lockPeriod = lockPeriod;
        tier.isActive = isActive;

        emit TierUpdated(tierIndex, minAmount, apyBasisPoints);
    }

    function setEmergencyWithdrawalFee(uint256 newFeeRate) external onlyOwner {
        require(newFeeRate <= 2000, "Fee too high"); // Max 20%
        emergencyWithdrawalFeeRate = newFeeRate;
    }

    function setAutoCompoundThreshold(uint256 newThreshold) external onlyOwner {
        autoCompoundThreshold = newThreshold;
    }

    // Emergency functions
    function emergencyPause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function emergencyWithdrawRewards(uint256 amount) external onlyOwner {
        require(rewardToken.transfer(owner(), amount), "Emergency withdrawal failed");
    }
}