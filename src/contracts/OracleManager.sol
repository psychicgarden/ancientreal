// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title OracleManager
 * @dev Decentralized oracle system for real estate property valuations
 * Implements multiple oracle sources with consensus mechanisms
 */
contract OracleManager is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;

    struct PropertyValuation {
        uint256 currentValue;
        uint256 previousValue;
        uint256 lastUpdated;
        uint256 confidence;
        bool isActive;
    }

    struct OracleData {
        address oracle;
        uint256 reputation;
        uint256 totalSubmissions;
        uint256 accurateSubmissions;
        bool isActive;
        uint256 lastSubmission;
    }

    struct PriceSubmission {
        address oracle;
        uint256 propertyId;
        uint256 value;
        uint256 timestamp;
        string methodology;
        bytes signature;
    }

    // State variables
    mapping(uint256 => PropertyValuation) public propertyValues;
    mapping(address => OracleData) public oracles;
    mapping(uint256 => PriceSubmission[]) public priceSubmissions;
    mapping(uint256 => mapping(address => bool)) public hasSubmitted;
    
    address[] public oracleList;
    uint256 public minOracles = 3;
    uint256 public maxDeviationPercent = 20; // 20% max deviation
    uint256 public consensusThreshold = 66; // 66% consensus required
    uint256 public submissionWindow = 24 hours;
    uint256 public constant REPUTATION_SCALE = 100;

    // Events
    event OracleAdded(address indexed oracle, uint256 initialReputation);
    event OracleRemoved(address indexed oracle);
    event PriceSubmitted(
        address indexed oracle,
        uint256 indexed propertyId,
        uint256 value,
        string methodology
    );
    event PropertyValuationUpdated(
        uint256 indexed propertyId,
        uint256 newValue,
        uint256 previousValue,
        uint256 confidence
    );
    event ReputationUpdated(address indexed oracle, uint256 newReputation);

    modifier onlyActiveOracle() {
        require(oracles[msg.sender].isActive, "Oracle: not active");
        _;
    }

    constructor() {
        // Initialize with default parameters
    }

    /**
     * @dev Add a new oracle
     */
    function addOracle(address _oracle, uint256 _initialReputation) external onlyOwner {
        require(_oracle != address(0), "Oracle: invalid address");
        require(!oracles[_oracle].isActive, "Oracle: already exists");
        require(_initialReputation <= REPUTATION_SCALE, "Oracle: reputation too high");

        oracles[_oracle] = OracleData({
            oracle: _oracle,
            reputation: _initialReputation,
            totalSubmissions: 0,
            accurateSubmissions: 0,
            isActive: true,
            lastSubmission: 0
        });

        oracleList.push(_oracle);
        emit OracleAdded(_oracle, _initialReputation);
    }

    /**
     * @dev Remove an oracle
     */
    function removeOracle(address _oracle) external onlyOwner {
        require(oracles[_oracle].isActive, "Oracle: not active");

        oracles[_oracle].isActive = false;

        // Remove from oracle list
        for (uint256 i = 0; i < oracleList.length; i++) {
            if (oracleList[i] == _oracle) {
                oracleList[i] = oracleList[oracleList.length - 1];
                oracleList.pop();
                break;
            }
        }

        emit OracleRemoved(_oracle);
    }

    /**
     * @dev Submit property valuation
     */
    function submitPropertyValuation(
        uint256 _propertyId,
        uint256 _value,
        string memory _methodology,
        bytes memory _signature
    ) external onlyActiveOracle nonReentrant {
        require(_value > 0, "Oracle: invalid value");
        require(!hasSubmitted[_propertyId][msg.sender], "Oracle: already submitted");

        // Verify signature (optional additional security)
        bytes32 hash = keccak256(abi.encodePacked(_propertyId, _value, _methodology, msg.sender));
        bytes32 ethSignedHash = hash.toEthSignedMessageHash();
        address signer = ethSignedHash.recover(_signature);
        require(signer == msg.sender, "Oracle: invalid signature");

        // Record submission
        priceSubmissions[_propertyId].push(PriceSubmission({
            oracle: msg.sender,
            propertyId: _propertyId,
            value: _value,
            timestamp: block.timestamp,
            methodology: _methodology,
            signature: _signature
        }));

        hasSubmitted[_propertyId][msg.sender] = true;
        oracles[msg.sender].totalSubmissions++;
        oracles[msg.sender].lastSubmission = block.timestamp;

        emit PriceSubmitted(msg.sender, _propertyId, _value, _methodology);

        // Check if we have enough submissions to calculate consensus
        if (priceSubmissions[_propertyId].length >= minOracles) {
            _calculateConsensus(_propertyId);
        }
    }

    /**
     * @dev Calculate consensus valuation
     */
    function _calculateConsensus(uint256 _propertyId) internal {
        PriceSubmission[] memory submissions = priceSubmissions[_propertyId];
        require(submissions.length >= minOracles, "Oracle: insufficient submissions");

        // Filter recent submissions (within submission window)
        uint256[] memory recentValues = new uint256[](submissions.length);
        address[] memory recentOracles = new address[](submissions.length);
        uint256 recentCount = 0;

        for (uint256 i = 0; i < submissions.length; i++) {
            if (block.timestamp - submissions[i].timestamp <= submissionWindow) {
                recentValues[recentCount] = submissions[i].value;
                recentOracles[recentCount] = submissions[i].oracle;
                recentCount++;
            }
        }

        require(recentCount >= minOracles, "Oracle: insufficient recent submissions");

        // Calculate weighted median based on oracle reputation
        uint256 consensusValue = _calculateWeightedMedian(recentValues, recentOracles, recentCount);
        uint256 confidence = _calculateConfidence(recentValues, recentCount, consensusValue);

        // Update property valuation
        PropertyValuation storage valuation = propertyValues[_propertyId];
        valuation.previousValue = valuation.currentValue;
        valuation.currentValue = consensusValue;
        valuation.lastUpdated = block.timestamp;
        valuation.confidence = confidence;
        valuation.isActive = true;

        // Update oracle reputations based on accuracy
        _updateReputations(_propertyId, consensusValue, recentOracles, recentValues, recentCount);

        emit PropertyValuationUpdated(
            _propertyId,
            consensusValue,
            valuation.previousValue,
            confidence
        );

        // Reset submission flags for next round
        _resetSubmissionFlags(_propertyId);
    }

    /**
     * @dev Calculate weighted median value
     */
    function _calculateWeightedMedian(
        uint256[] memory values,
        address[] memory oracles,
        uint256 count
    ) internal view returns (uint256) {
        // Simple median for now - can be enhanced with proper weighted median
        uint256[] memory sortedValues = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            sortedValues[i] = values[i];
        }

        // Bubble sort (simple for small arrays)
        for (uint256 i = 0; i < count - 1; i++) {
            for (uint256 j = 0; j < count - i - 1; j++) {
                if (sortedValues[j] > sortedValues[j + 1]) {
                    uint256 temp = sortedValues[j];
                    sortedValues[j] = sortedValues[j + 1];
                    sortedValues[j + 1] = temp;
                }
            }
        }

        // Return median
        if (count % 2 == 0) {
            return (sortedValues[count / 2 - 1] + sortedValues[count / 2]) / 2;
        } else {
            return sortedValues[count / 2];
        }
    }

    /**
     * @dev Calculate confidence score
     */
    function _calculateConfidence(
        uint256[] memory values,
        uint256 count,
        uint256 consensusValue
    ) internal view returns (uint256) {
        uint256 totalDeviation = 0;
        uint256 validCount = 0;

        for (uint256 i = 0; i < count; i++) {
            uint256 deviation = values[i] > consensusValue 
                ? values[i] - consensusValue 
                : consensusValue - values[i];
            
            uint256 deviationPercent = (deviation * 100) / consensusValue;
            
            if (deviationPercent <= maxDeviationPercent) {
                totalDeviation += deviationPercent;
                validCount++;
            }
        }

        if (validCount == 0) return 0;

        uint256 avgDeviation = totalDeviation / validCount;
        uint256 confidence = avgDeviation < 100 ? 100 - avgDeviation : 0;
        
        // Boost confidence if we have consensus from high-reputation oracles
        uint256 consensusBonus = (validCount * 100) / count;
        confidence = (confidence + consensusBonus) / 2;

        return confidence > 100 ? 100 : confidence;
    }

    /**
     * @dev Update oracle reputations based on accuracy
     */
    function _updateReputations(
        uint256 _propertyId,
        uint256 consensusValue,
        address[] memory oracles,
        uint256[] memory values,
        uint256 count
    ) internal {
        for (uint256 i = 0; i < count; i++) {
            address oracle = oracles[i];
            uint256 value = values[i];
            
            uint256 deviation = value > consensusValue 
                ? value - consensusValue 
                : consensusValue - value;
            
            uint256 deviationPercent = (deviation * 100) / consensusValue;
            
            OracleData storage oracleData = this.oracles[oracle];
            
            if (deviationPercent <= maxDeviationPercent) {
                // Accurate submission - increase reputation
                oracleData.accurateSubmissions++;
                if (oracleData.reputation < REPUTATION_SCALE) {
                    oracleData.reputation += 1;
                }
            } else {
                // Inaccurate submission - decrease reputation
                if (oracleData.reputation > 1) {
                    oracleData.reputation -= 1;
                }
            }

            emit ReputationUpdated(oracle, oracleData.reputation);
        }
    }

    /**
     * @dev Reset submission flags for next round
     */
    function _resetSubmissionFlags(uint256 _propertyId) internal {
        PriceSubmission[] memory submissions = priceSubmissions[_propertyId];
        
        for (uint256 i = 0; i < submissions.length; i++) {
            hasSubmitted[_propertyId][submissions[i].oracle] = false;
        }
        
        // Clear old submissions
        delete priceSubmissions[_propertyId];
    }

    /**
     * @dev Get property valuation
     */
    function getPropertyValuation(uint256 _propertyId) 
        external 
        view 
        returns (
            uint256 currentValue,
            uint256 previousValue,
            uint256 lastUpdated,
            uint256 confidence,
            bool isActive
        ) 
    {
        PropertyValuation memory valuation = propertyValues[_propertyId];
        return (
            valuation.currentValue,
            valuation.previousValue,
            valuation.lastUpdated,
            valuation.confidence,
            valuation.isActive
        );
    }

    /**
     * @dev Get oracle information
     */
    function getOracleInfo(address _oracle) 
        external 
        view 
        returns (
            uint256 reputation,
            uint256 totalSubmissions,
            uint256 accurateSubmissions,
            bool isActive,
            uint256 lastSubmission
        ) 
    {
        OracleData memory oracle = oracles[_oracle];
        return (
            oracle.reputation,
            oracle.totalSubmissions,
            oracle.accurateSubmissions,
            oracle.isActive,
            oracle.lastSubmission
        );
    }

    /**
     * @dev Admin functions
     */
    function updateParameters(
        uint256 _minOracles,
        uint256 _maxDeviationPercent,
        uint256 _consensusThreshold,
        uint256 _submissionWindow
    ) external onlyOwner {
        minOracles = _minOracles;
        maxDeviationPercent = _maxDeviationPercent;
        consensusThreshold = _consensusThreshold;
        submissionWindow = _submissionWindow;
    }

    /**
     * @dev Get all active oracles
     */
    function getActiveOracles() external view returns (address[] memory) {
        address[] memory activeOracles = new address[](oracleList.length);
        uint256 activeCount = 0;

        for (uint256 i = 0; i < oracleList.length; i++) {
            if (oracles[oracleList[i]].isActive) {
                activeOracles[activeCount] = oracleList[i];
                activeCount++;
            }
        }

        // Resize array to actual count
        assembly {
            mstore(activeOracles, activeCount)
        }

        return activeOracles;
    }
}