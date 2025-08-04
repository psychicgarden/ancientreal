// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title YieldFarmingManager
 * @dev Advanced yield farming system for property token holders
 * Implements multiple yield strategies with auto-compounding
 */
contract YieldFarmingManager is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    struct Pool {
        IERC20 stakingToken;
        IERC20 rewardToken;
        uint256 rewardRate;
        uint256 lastUpdateTime;
        uint256 rewardPerTokenStored;
        uint256 totalStaked;
        bool isActive;
        uint256 lockPeriod;
        uint256 earlyWithdrawalFee; // Basis points (100 = 1%)
    }

    struct UserInfo {
        uint256 stakedAmount;
        uint256 userRewardPerTokenPaid;
        uint256 rewards;
        uint256 lastStakeTime;
        bool autoCompounding;
    }

    struct YieldStrategy {
        string name;
        address strategyContract;
        uint256 expectedAPY;
        uint256 riskLevel; // 1-5 scale
        bool isActive;
    }

    // State variables
    mapping(uint256 => Pool) public pools;
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    mapping(uint256 => YieldStrategy) public yieldStrategies;
    mapping(address => uint256[]) public userPools;
    
    uint256 public poolCount;
    uint256 public strategyCount;
    uint256 public constant SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
    uint256 public constant BASIS_POINTS = 10000;

    // Events
    event PoolAdded(uint256 indexed poolId, address stakingToken, address rewardToken, uint256 rewardRate);
    event Staked(address indexed user, uint256 indexed poolId, uint256 amount);
    event Withdrawn(address indexed user, uint256 indexed poolId, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 indexed poolId, uint256 reward);
    event AutoCompoundingToggled(address indexed user, uint256 indexed poolId, bool enabled);
    event StrategyAdded(uint256 indexed strategyId, string name, address strategyContract);
    event EmergencyWithdraw(address indexed user, uint256 indexed poolId, uint256 amount);

    modifier poolExists(uint256 _poolId) {
        require(_poolId < poolCount, "YieldFarm: pool does not exist");
        _;
    }

    modifier poolActive(uint256 _poolId) {
        require(pools[_poolId].isActive, "YieldFarm: pool not active");
        _;
    }

    constructor() {}

    /**
     * @dev Add a new staking pool
     */
    function addPool(
        IERC20 _stakingToken,
        IERC20 _rewardToken,
        uint256 _rewardRate,
        uint256 _lockPeriod,
        uint256 _earlyWithdrawalFee
    ) external onlyOwner {
        require(address(_stakingToken) != address(0), "YieldFarm: invalid staking token");
        require(address(_rewardToken) != address(0), "YieldFarm: invalid reward token");
        require(_earlyWithdrawalFee <= 2000, "YieldFarm: fee too high"); // Max 20%

        pools[poolCount] = Pool({
            stakingToken: _stakingToken,
            rewardToken: _rewardToken,
            rewardRate: _rewardRate,
            lastUpdateTime: block.timestamp,
            rewardPerTokenStored: 0,
            totalStaked: 0,
            isActive: true,
            lockPeriod: _lockPeriod,
            earlyWithdrawalFee: _earlyWithdrawalFee
        });

        emit PoolAdded(poolCount, address(_stakingToken), address(_rewardToken), _rewardRate);
        poolCount++;
    }

    /**
     * @dev Update reward variables for a pool
     */
    function updatePool(uint256 _poolId) public poolExists(_poolId) {
        Pool storage pool = pools[_poolId];
        
        if (block.timestamp <= pool.lastUpdateTime) {
            return;
        }

        if (pool.totalStaked == 0) {
            pool.lastUpdateTime = block.timestamp;
            return;
        }

        uint256 timeElapsed = block.timestamp - pool.lastUpdateTime;
        uint256 rewardAmount = timeElapsed * pool.rewardRate;
        pool.rewardPerTokenStored += (rewardAmount * 1e18) / pool.totalStaked;
        pool.lastUpdateTime = block.timestamp;
    }

    /**
     * @dev Stake tokens in a pool
     */
    function stake(uint256 _poolId, uint256 _amount) 
        external 
        nonReentrant 
        whenNotPaused 
        poolExists(_poolId) 
        poolActive(_poolId) 
    {
        require(_amount > 0, "YieldFarm: amount must be greater than 0");

        updatePool(_poolId);

        Pool storage pool = pools[_poolId];
        UserInfo storage user = userInfo[_poolId][msg.sender];

        // Calculate pending rewards
        if (user.stakedAmount > 0) {
            uint256 pending = _calculatePendingRewards(_poolId, msg.sender);
            if (pending > 0) {
                user.rewards += pending;
            }
        }

        // Transfer tokens
        pool.stakingToken.safeTransferFrom(msg.sender, address(this), _amount);

        // Update user info
        user.stakedAmount += _amount;
        user.userRewardPerTokenPaid = pool.rewardPerTokenStored;
        user.lastStakeTime = block.timestamp;

        // Update pool info
        pool.totalStaked += _amount;

        // Add to user's pool list if first time staking
        if (!_isUserInPool(_poolId, msg.sender)) {
            userPools[msg.sender].push(_poolId);
        }

        emit Staked(msg.sender, _poolId, _amount);
    }

    /**
     * @dev Withdraw staked tokens
     */
    function withdraw(uint256 _poolId, uint256 _amount) 
        external 
        nonReentrant 
        poolExists(_poolId) 
    {
        UserInfo storage user = userInfo[_poolId][msg.sender];
        require(user.stakedAmount >= _amount, "YieldFarm: insufficient staked amount");

        updatePool(_poolId);

        Pool storage pool = pools[_poolId];

        // Calculate and update rewards
        uint256 pending = _calculatePendingRewards(_poolId, msg.sender);
        if (pending > 0) {
            user.rewards += pending;
        }

        // Check if withdrawal is within lock period
        bool isEarlyWithdrawal = block.timestamp < user.lastStakeTime + pool.lockPeriod;
        uint256 withdrawAmount = _amount;

        if (isEarlyWithdrawal && pool.earlyWithdrawalFee > 0) {
            uint256 fee = (_amount * pool.earlyWithdrawalFee) / BASIS_POINTS;
            withdrawAmount = _amount - fee;
            // Fee stays in contract as additional rewards
        }

        // Update user info
        user.stakedAmount -= _amount;
        user.userRewardPerTokenPaid = pool.rewardPerTokenStored;

        // Update pool info
        pool.totalStaked -= _amount;

        // Transfer tokens
        pool.stakingToken.safeTransfer(msg.sender, withdrawAmount);

        emit Withdrawn(msg.sender, _poolId, _amount);
    }

    /**
     * @dev Claim pending rewards
     */
    function claimRewards(uint256 _poolId) 
        external 
        nonReentrant 
        poolExists(_poolId) 
    {
        updatePool(_poolId);

        UserInfo storage user = userInfo[_poolId][msg.sender];
        uint256 pending = _calculatePendingRewards(_poolId, msg.sender);
        uint256 totalReward = user.rewards + pending;

        require(totalReward > 0, "YieldFarm: no rewards to claim");

        // Reset rewards
        user.rewards = 0;
        user.userRewardPerTokenPaid = pools[_poolId].rewardPerTokenStored;

        // Handle auto-compounding
        if (user.autoCompounding && address(pools[_poolId].stakingToken) == address(pools[_poolId].rewardToken)) {
            // Auto-compound: stake the rewards
            user.stakedAmount += totalReward;
            pools[_poolId].totalStaked += totalReward;
            emit Staked(msg.sender, _poolId, totalReward);
        } else {
            // Regular claim: transfer rewards
            pools[_poolId].rewardToken.safeTransfer(msg.sender, totalReward);
        }

        emit RewardsClaimed(msg.sender, _poolId, totalReward);
    }

    /**
     * @dev Emergency withdraw without rewards
     */
    function emergencyWithdraw(uint256 _poolId) 
        external 
        nonReentrant 
        poolExists(_poolId) 
    {
        UserInfo storage user = userInfo[_poolId][msg.sender];
        uint256 amount = user.stakedAmount;
        require(amount > 0, "YieldFarm: no staked amount");

        // Update pool total
        pools[_poolId].totalStaked -= amount;

        // Reset user info
        user.stakedAmount = 0;
        user.rewards = 0;
        user.userRewardPerTokenPaid = 0;

        // Transfer tokens (90% to handle emergency scenarios)
        uint256 withdrawAmount = (amount * 9000) / BASIS_POINTS;
        pools[_poolId].stakingToken.safeTransfer(msg.sender, withdrawAmount);

        emit EmergencyWithdraw(msg.sender, _poolId, amount);
    }

    /**
     * @dev Toggle auto-compounding for a user
     */
    function setAutoCompounding(uint256 _poolId, bool _enabled) 
        external 
        poolExists(_poolId) 
    {
        userInfo[_poolId][msg.sender].autoCompounding = _enabled;
        emit AutoCompoundingToggled(msg.sender, _poolId, _enabled);
    }

    /**
     * @dev Add a yield strategy
     */
    function addYieldStrategy(
        string memory _name,
        address _strategyContract,
        uint256 _expectedAPY,
        uint256 _riskLevel
    ) external onlyOwner {
        require(_strategyContract != address(0), "YieldFarm: invalid strategy contract");
        require(_riskLevel >= 1 && _riskLevel <= 5, "YieldFarm: invalid risk level");

        yieldStrategies[strategyCount] = YieldStrategy({
            name: _name,
            strategyContract: _strategyContract,
            expectedAPY: _expectedAPY,
            riskLevel: _riskLevel,
            isActive: true
        });

        emit StrategyAdded(strategyCount, _name, _strategyContract);
        strategyCount++;
    }

    /**
     * @dev Calculate pending rewards for a user
     */
    function _calculatePendingRewards(uint256 _poolId, address _user) 
        internal 
        view 
        returns (uint256) 
    {
        Pool memory pool = pools[_poolId];
        UserInfo memory user = userInfo[_poolId][_user];

        uint256 rewardPerToken = pool.rewardPerTokenStored;
        
        if (block.timestamp > pool.lastUpdateTime && pool.totalStaked > 0) {
            uint256 timeElapsed = block.timestamp - pool.lastUpdateTime;
            uint256 rewardAmount = timeElapsed * pool.rewardRate;
            rewardPerToken += (rewardAmount * 1e18) / pool.totalStaked;
        }

        return (user.stakedAmount * (rewardPerToken - user.userRewardPerTokenPaid)) / 1e18;
    }

    /**
     * @dev Check if user is in pool
     */
    function _isUserInPool(uint256 _poolId, address _user) internal view returns (bool) {
        uint256[] memory pools = userPools[_user];
        for (uint256 i = 0; i < pools.length; i++) {
            if (pools[i] == _poolId) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Get user's total pending rewards across all pools
     */
    function getTotalPendingRewards(address _user) external view returns (uint256 total) {
        uint256[] memory pools = userPools[_user];
        for (uint256 i = 0; i < pools.length; i++) {
            total += pendingRewards(pools[i], _user);
        }
    }

    /**
     * @dev Get pending rewards for a specific pool
     */
    function pendingRewards(uint256 _poolId, address _user) 
        public 
        view 
        poolExists(_poolId) 
        returns (uint256) 
    {
        UserInfo memory user = userInfo[_poolId][_user];
        return user.rewards + _calculatePendingRewards(_poolId, _user);
    }

    /**
     * @dev Get pool APY
     */
    function getPoolAPY(uint256 _poolId) external view poolExists(_poolId) returns (uint256) {
        Pool memory pool = pools[_poolId];
        if (pool.totalStaked == 0) return 0;
        
        uint256 yearlyRewards = pool.rewardRate * SECONDS_PER_YEAR;
        return (yearlyRewards * 100) / pool.totalStaked;
    }

    /**
     * @dev Get user's pools
     */
    function getUserPools(address _user) external view returns (uint256[] memory) {
        return userPools[_user];
    }

    /**
     * @dev Admin functions
     */
    function updatePoolRewardRate(uint256 _poolId, uint256 _newRate) 
        external 
        onlyOwner 
        poolExists(_poolId) 
    {
        updatePool(_poolId);
        pools[_poolId].rewardRate = _newRate;
    }

    function setPoolActive(uint256 _poolId, bool _isActive) 
        external 
        onlyOwner 
        poolExists(_poolId) 
    {
        pools[_poolId].isActive = _isActive;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency function to recover tokens
     */
    function recoverToken(IERC20 _token, uint256 _amount) external onlyOwner {
        _token.safeTransfer(owner(), _amount);
    }
}