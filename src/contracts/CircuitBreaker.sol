// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CircuitBreaker
 * @dev Circuit breaker pattern implementation for DeFi protocols
 * Based on Compound Protocol's approach with enhancements
 */
contract CircuitBreaker is Ownable, Pausable, ReentrancyGuard {
    
    struct WithdrawalLimit {
        uint256 dailyLimit;
        uint256 monthlyLimit;
        uint256 dailyWithdrawn;
        uint256 monthlyWithdrawn;
        uint256 lastDayReset;
        uint256 lastMonthReset;
    }

    struct AnomalyThreshold {
        uint256 volumeThreshold;      // Unusual volume threshold
        uint256 frequencyThreshold;   // Unusual frequency threshold
        uint256 timeWindow;           // Time window for frequency check
        bool enabled;
    }

    // State variables
    mapping(address => WithdrawalLimit) public withdrawalLimits;
    mapping(address => uint256[]) public recentWithdrawals;
    mapping(address => mapping(uint256 => uint256)) public dailyWithdrawals;
    
    AnomalyThreshold public anomalyThreshold;
    uint256 public constant MAX_DAILY_LIMIT = 1000000 * 10**6; // 1M USDT
    uint256 public constant MAX_MONTHLY_LIMIT = 10000000 * 10**6; // 10M USDT
    
    bool public emergencyStop;
    uint256 public lastAnomalyDetected;
    uint256 public autoResumeDelay = 24 hours;

    // Events
    event WithdrawalLimitSet(address indexed user, uint256 dailyLimit, uint256 monthlyLimit);
    event WithdrawalBlocked(address indexed user, uint256 amount, string reason);
    event AnomalyDetected(address indexed user, uint256 amount, string anomalyType);
    event EmergencyStopActivated(string reason);
    event EmergencyStopDeactivated();
    event CircuitBreakerTriggered(string reason, uint256 timestamp);

    modifier notEmergencyStop() {
        require(!emergencyStop, "CircuitBreaker: emergency stop active");
        _;
    }

    modifier validAmount(uint256 amount) {
        require(amount > 0, "CircuitBreaker: invalid amount");
        _;
    }

    constructor() {
        anomalyThreshold = AnomalyThreshold({
            volumeThreshold: 500000 * 10**6, // 500K USDT
            frequencyThreshold: 10, // 10 withdrawals
            timeWindow: 1 hours,
            enabled: true
        });
    }

    /**
     * @dev Set withdrawal limits for a user
     */
    function setWithdrawalLimit(
        address user,
        uint256 dailyLimit,
        uint256 monthlyLimit
    ) external onlyOwner {
        require(dailyLimit <= MAX_DAILY_LIMIT, "CircuitBreaker: daily limit too high");
        require(monthlyLimit <= MAX_MONTHLY_LIMIT, "CircuitBreaker: monthly limit too high");
        require(dailyLimit <= monthlyLimit, "CircuitBreaker: daily > monthly");

        withdrawalLimits[user] = WithdrawalLimit({
            dailyLimit: dailyLimit,
            monthlyLimit: monthlyLimit,
            dailyWithdrawn: 0,
            monthlyWithdrawn: 0,
            lastDayReset: block.timestamp,
            lastMonthReset: block.timestamp
        });

        emit WithdrawalLimitSet(user, dailyLimit, monthlyLimit);
    }

    /**
     * @dev Check if withdrawal is allowed (main circuit breaker logic)
     */
    function checkWithdrawal(address user, uint256 amount) 
        external 
        view 
        returns (bool allowed, string memory reason) 
    {
        // Emergency stop check
        if (emergencyStop) {
            return (false, "Emergency stop active");
        }

        // Paused check
        if (paused()) {
            return (false, "Contract paused");
        }

        // Zero amount check
        if (amount == 0) {
            return (false, "Invalid amount");
        }

        // Get updated limits
        WithdrawalLimit memory limits = _getUpdatedLimits(user);
        
        // Daily limit check
        if (limits.dailyWithdrawn + amount > limits.dailyLimit) {
            return (false, "Daily limit exceeded");
        }

        // Monthly limit check
        if (limits.monthlyWithdrawn + amount > limits.monthlyLimit) {
            return (false, "Monthly limit exceeded");
        }

        // Anomaly detection
        if (_detectAnomaly(user, amount)) {
            return (false, "Anomalous activity detected");
        }

        return (true, "");
    }

    /**
     * @dev Record a withdrawal (update limits and history)
     */
    function recordWithdrawal(address user, uint256 amount) 
        external 
        onlyOwner 
        notEmergencyStop 
        whenNotPaused 
        validAmount(amount) 
    {
        WithdrawalLimit storage limits = withdrawalLimits[user];
        
        // Reset limits if time periods have passed
        _resetLimitsIfNeeded(user);
        
        // Update withdrawal amounts
        limits.dailyWithdrawn += amount;
        limits.monthlyWithdrawn += amount;
        
        // Record withdrawal timestamp for anomaly detection
        recentWithdrawals[user].push(block.timestamp);
        
        // Clean old withdrawal records (keep only last 24 hours)
        _cleanOldWithdrawals(user);
        
        // Check for anomalies after recording
        if (_detectAnomaly(user, amount)) {
            emit AnomalyDetected(user, amount, "Post-withdrawal anomaly");
            _triggerCircuitBreaker("Anomaly detected after withdrawal");
        }
    }

    /**
     * @dev Detect anomalous withdrawal patterns
     */
    function _detectAnomaly(address user, uint256 amount) internal view returns (bool) {
        if (!anomalyThreshold.enabled) {
            return false;
        }

        // Large amount anomaly
        if (amount > anomalyThreshold.volumeThreshold) {
            return true;
        }

        // High frequency anomaly
        uint256 recentCount = 0;
        uint256 timeWindow = anomalyThreshold.timeWindow;
        uint256[] memory withdrawals = recentWithdrawals[user];
        
        for (uint256 i = 0; i < withdrawals.length; i++) {
            if (block.timestamp - withdrawals[i] <= timeWindow) {
                recentCount++;
            }
        }

        if (recentCount >= anomalyThreshold.frequencyThreshold) {
            return true;
        }

        return false;
    }

    /**
     * @dev Get updated withdrawal limits (reset if needed)
     */
    function _getUpdatedLimits(address user) internal view returns (WithdrawalLimit memory) {
        WithdrawalLimit memory limits = withdrawalLimits[user];
        
        // Reset daily limit if a day has passed
        if (block.timestamp >= limits.lastDayReset + 1 days) {
            limits.dailyWithdrawn = 0;
            limits.lastDayReset = block.timestamp;
        }
        
        // Reset monthly limit if a month has passed
        if (block.timestamp >= limits.lastMonthReset + 30 days) {
            limits.monthlyWithdrawn = 0;
            limits.lastMonthReset = block.timestamp;
        }
        
        return limits;
    }

    /**
     * @dev Reset withdrawal limits if time periods have elapsed
     */
    function _resetLimitsIfNeeded(address user) internal {
        WithdrawalLimit storage limits = withdrawalLimits[user];
        
        // Reset daily limit
        if (block.timestamp >= limits.lastDayReset + 1 days) {
            limits.dailyWithdrawn = 0;
            limits.lastDayReset = block.timestamp;
        }
        
        // Reset monthly limit
        if (block.timestamp >= limits.lastMonthReset + 30 days) {
            limits.monthlyWithdrawn = 0;
            limits.lastMonthReset = block.timestamp;
        }
    }

    /**
     * @dev Clean old withdrawal records
     */
    function _cleanOldWithdrawals(address user) internal {
        uint256[] storage withdrawals = recentWithdrawals[user];
        uint256 cutoff = block.timestamp - 24 hours;
        
        // Remove withdrawals older than 24 hours
        for (uint256 i = 0; i < withdrawals.length; i++) {
            if (withdrawals[i] < cutoff) {
                withdrawals[i] = withdrawals[withdrawals.length - 1];
                withdrawals.pop();
                i--; // Adjust index after removal
            }
        }
    }

    /**
     * @dev Trigger circuit breaker
     */
    function _triggerCircuitBreaker(string memory reason) internal {
        emergencyStop = true;
        lastAnomalyDetected = block.timestamp;
        emit CircuitBreakerTriggered(reason, block.timestamp);
        emit EmergencyStopActivated(reason);
    }

    /**
     * @dev Manual emergency stop
     */
    function emergencyStopActivate(string memory reason) external onlyOwner {
        _triggerCircuitBreaker(reason);
    }

    /**
     * @dev Deactivate emergency stop
     */
    function emergencyStopDeactivate() external onlyOwner {
        require(emergencyStop, "CircuitBreaker: not in emergency stop");
        emergencyStop = false;
        emit EmergencyStopDeactivated();
    }

    /**
     * @dev Auto-resume after delay (if conditions are met)
     */
    function autoResume() external {
        require(emergencyStop, "CircuitBreaker: not in emergency stop");
        require(
            block.timestamp >= lastAnomalyDetected + autoResumeDelay,
            "CircuitBreaker: auto resume delay not met"
        );
        
        emergencyStop = false;
        emit EmergencyStopDeactivated();
    }

    /**
     * @dev Update anomaly detection thresholds
     */
    function updateAnomalyThreshold(
        uint256 volumeThreshold,
        uint256 frequencyThreshold,
        uint256 timeWindow,
        bool enabled
    ) external onlyOwner {
        anomalyThreshold = AnomalyThreshold({
            volumeThreshold: volumeThreshold,
            frequencyThreshold: frequencyThreshold,
            timeWindow: timeWindow,
            enabled: enabled
        });
    }

    /**
     * @dev Get user withdrawal status
     */
    function getUserWithdrawalStatus(address user) 
        external 
        view 
        returns (
            uint256 dailyLimit,
            uint256 monthlyLimit,
            uint256 dailyRemaining,
            uint256 monthlyRemaining,
            uint256 recentWithdrawalCount
        ) 
    {
        WithdrawalLimit memory limits = _getUpdatedLimits(user);
        
        return (
            limits.dailyLimit,
            limits.monthlyLimit,
            limits.dailyLimit - limits.dailyWithdrawn,
            limits.monthlyLimit - limits.monthlyWithdrawn,
            recentWithdrawals[user].length
        );
    }

    /**
     * @dev Pause contract (emergency function)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
