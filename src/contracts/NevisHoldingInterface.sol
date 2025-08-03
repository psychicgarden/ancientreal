// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title NevisHoldingInterface
 * @dev Interface contract for bridging blockchain operations with Ancient Holdings Ltd. (Nevis)
 * Handles legal compliance and off-chain coordination with the Nevis holding company
 */
contract NevisHoldingInterface is Ownable, ReentrancyGuard {
    
    // Nevis company information
    struct NevisCompanyInfo {
        string companyName;
        string registrationNumber;
        string registeredOffice;
        address[] authorizedSignatories;
        uint256 registrationDate;
        bool isActive;
    }
    
    // Director information
    struct DirectorInfo {
        string name;
        address walletAddress;
        string jurisdiction;
        bool isActive;
        uint256 appointmentDate;
    }
    
    // Corporate action tracking
    struct CorporateAction {
        uint256 actionId;
        string actionType; // "CAPITAL_CALL", "DISTRIBUTION", "MORTGAGE_APPROVAL", etc.
        uint256 amount;
        string description;
        address initiator;
        uint256 timestamp;
        uint256 requiredSignatures;
        uint256 currentSignatures;
        mapping(address => bool) signatures;
        bool executed;
        bool cancelled;
    }
    
    // Financial reporting structure
    struct FinancialReport {
        uint256 totalAssets;
        uint256 totalLiabilities;
        uint256 netWorth;
        uint256 cashOnHand;
        uint256 realEstateValue;
        uint256 lendingPoolValue;
        uint256 reportingPeriod;
        uint256 timestamp;
        string auditorSignature;
    }
    
    // Compliance tracking
    struct ComplianceRecord {
        string complianceType; // "AML", "KYC", "CRS", "FATCA", etc.
        address subject;
        bool status;
        uint256 expiryDate;
        string certificationBody;
        string documentHash;
        uint256 lastUpdated;
    }
    
    // State variables
    NevisCompanyInfo public companyInfo;
    mapping(address => DirectorInfo) public directors;
    mapping(uint256 => CorporateAction) public corporateActions;
    mapping(address => ComplianceRecord[]) public complianceRecords;
    mapping(uint256 => FinancialReport) public financialReports;
    
    address[] public directorsList;
    uint256 public nextActionId;
    uint256 public requiredDirectorSignatures;
    uint256 public currentReportingPeriod;
    
    // External contract addresses
    address public lendingPoolManager;
    address public mortgageContract;
    address public complianceOracle;
    
    // Events
    event CorporateActionInitiated(uint256 indexed actionId, string actionType, uint256 amount);
    event CorporateActionSigned(uint256 indexed actionId, address indexed signer);
    event CorporateActionExecuted(uint256 indexed actionId, string actionType);
    event DirectorAdded(address indexed director, string name);
    event DirectorRemoved(address indexed director);
    event ComplianceUpdated(address indexed subject, string complianceType, bool status);
    event FinancialReportSubmitted(uint256 indexed period, uint256 totalAssets);
    event NevisRegulatoryFiling(string filingType, uint256 amount, uint256 timestamp);
    
    // Modifiers
    modifier onlyDirector() {
        require(directors[msg.sender].isActive, "Not an active director");
        _;
    }
    
    modifier onlyAuthorizedContract() {
        require(
            msg.sender == lendingPoolManager || 
            msg.sender == mortgageContract || 
            msg.sender == owner(),
            "Not authorized contract"
        );
        _;
    }
    
    modifier actionExists(uint256 actionId) {
        require(actionId < nextActionId, "Action does not exist");
        _;
    }
    
    constructor(
        string memory _companyName,
        string memory _registrationNumber,
        string memory _registeredOffice
    ) {
        companyInfo = NevisCompanyInfo({
            companyName: _companyName,
            registrationNumber: _registrationNumber,
            registeredOffice: _registeredOffice,
            authorizedSignatories: new address[](0),
            registrationDate: block.timestamp,
            isActive: true
        });
        
        requiredDirectorSignatures = 2; // Default 2 out of 3 directors
        currentReportingPeriod = 1;
    }
    
    /**
     * @dev Add a new director to the Nevis company
     */
    function addDirector(
        address directorAddress,
        string memory name,
        string memory jurisdiction
    ) external onlyOwner {
        require(!directors[directorAddress].isActive, "Director already exists");
        
        directors[directorAddress] = DirectorInfo({
            name: name,
            walletAddress: directorAddress,
            jurisdiction: jurisdiction,
            isActive: true,
            appointmentDate: block.timestamp
        });
        
        directorsList.push(directorAddress);
        companyInfo.authorizedSignatories.push(directorAddress);
        
        emit DirectorAdded(directorAddress, name);
    }
    
    /**
     * @dev Remove a director from the Nevis company
     */
    function removeDirector(address directorAddress) external onlyOwner {
        require(directors[directorAddress].isActive, "Director not active");
        
        directors[directorAddress].isActive = false;
        
        // Remove from directors list
        for (uint256 i = 0; i < directorsList.length; i++) {
            if (directorsList[i] == directorAddress) {
                directorsList[i] = directorsList[directorsList.length - 1];
                directorsList.pop();
                break;
            }
        }
        
        // Remove from authorized signatories
        for (uint256 i = 0; i < companyInfo.authorizedSignatories.length; i++) {
            if (companyInfo.authorizedSignatories[i] == directorAddress) {
                companyInfo.authorizedSignatories[i] = companyInfo.authorizedSignatories[companyInfo.authorizedSignatories.length - 1];
                companyInfo.authorizedSignatories.pop();
                break;
            }
        }
        
        emit DirectorRemoved(directorAddress);
    }
    
    /**
     * @dev Initiate a corporate action requiring director approval
     */
    function initiateCorporateAction(
        string memory actionType,
        uint256 amount,
        string memory description
    ) external onlyAuthorizedContract returns (uint256) {
        uint256 actionId = nextActionId++;
        
        CorporateAction storage action = corporateActions[actionId];
        action.actionId = actionId;
        action.actionType = actionType;
        action.amount = amount;
        action.description = description;
        action.initiator = msg.sender;
        action.timestamp = block.timestamp;
        action.requiredSignatures = requiredDirectorSignatures;
        action.currentSignatures = 0;
        action.executed = false;
        action.cancelled = false;
        
        emit CorporateActionInitiated(actionId, actionType, amount);
        
        return actionId;
    }
    
    /**
     * @dev Sign a corporate action as a director
     */
    function signCorporateAction(uint256 actionId) 
        external 
        onlyDirector 
        actionExists(actionId) 
    {
        CorporateAction storage action = corporateActions[actionId];
        require(!action.executed, "Action already executed");
        require(!action.cancelled, "Action cancelled");
        require(!action.signatures[msg.sender], "Already signed");
        
        action.signatures[msg.sender] = true;
        action.currentSignatures++;
        
        emit CorporateActionSigned(actionId, msg.sender);
        
        // Auto-execute if enough signatures
        if (action.currentSignatures >= action.requiredSignatures) {
            _executeCorporateAction(actionId);
        }
    }
    
    /**
     * @dev Execute a corporate action (internal)
     */
    function _executeCorporateAction(uint256 actionId) internal {
        CorporateAction storage action = corporateActions[actionId];
        action.executed = true;
        
        // Handle different action types
        bytes32 actionTypeHash = keccak256(bytes(action.actionType));
        
        if (actionTypeHash == keccak256(bytes("CAPITAL_CALL"))) {
            _handleCapitalCall(action.amount);
        } else if (actionTypeHash == keccak256(bytes("DISTRIBUTION"))) {
            _handleDistribution(action.amount);
        } else if (actionTypeHash == keccak256(bytes("MORTGAGE_APPROVAL"))) {
            _handleMortgageApproval(action.amount);
        } else if (actionTypeHash == keccak256(bytes("REGULATORY_FILING"))) {
            _handleRegulatoryFiling(action.actionType, action.amount);
        }
        
        emit CorporateActionExecuted(actionId, action.actionType);
    }
    
    /**
     * @dev Update compliance status for an address
     */
    function updateComplianceStatus(
        address subject,
        string memory complianceType,
        bool status,
        uint256 expiryDate,
        string memory certificationBody,
        string memory documentHash
    ) external {
        require(
            msg.sender == complianceOracle || msg.sender == owner(),
            "Not authorized to update compliance"
        );
        
        ComplianceRecord memory newRecord = ComplianceRecord({
            complianceType: complianceType,
            subject: subject,
            status: status,
            expiryDate: expiryDate,
            certificationBody: certificationBody,
            documentHash: documentHash,
            lastUpdated: block.timestamp
        });
        
        complianceRecords[subject].push(newRecord);
        
        emit ComplianceUpdated(subject, complianceType, status);
    }
    
    /**
     * @dev Submit financial report for the current period
     */
    function submitFinancialReport(
        uint256 totalAssets,
        uint256 totalLiabilities,
        uint256 cashOnHand,
        uint256 realEstateValue,
        uint256 lendingPoolValue,
        string memory auditorSignature
    ) external onlyDirector {
        uint256 netWorth = totalAssets - totalLiabilities;
        
        financialReports[currentReportingPeriod] = FinancialReport({
            totalAssets: totalAssets,
            totalLiabilities: totalLiabilities,
            netWorth: netWorth,
            cashOnHand: cashOnHand,
            realEstateValue: realEstateValue,
            lendingPoolValue: lendingPoolValue,
            reportingPeriod: currentReportingPeriod,
            timestamp: block.timestamp,
            auditorSignature: auditorSignature
        });
        
        emit FinancialReportSubmitted(currentReportingPeriod, totalAssets);
        currentReportingPeriod++;
    }
    
    /**
     * @dev Get compliance status for an address
     */
    function getComplianceStatus(address subject, string memory complianceType) 
        external 
        view 
        returns (bool status, uint256 expiryDate) 
    {
        ComplianceRecord[] memory records = complianceRecords[subject];
        
        for (uint256 i = records.length; i > 0; i--) {
            if (keccak256(bytes(records[i-1].complianceType)) == keccak256(bytes(complianceType))) {
                return (records[i-1].status, records[i-1].expiryDate);
            }
        }
        
        return (false, 0);
    }
    
    /**
     * @dev Get active directors list
     */
    function getActiveDirectors() external view returns (address[] memory) {
        return directorsList;
    }
    
    /**
     * @dev Check if corporate action has enough signatures
     */
    function hasEnoughSignatures(uint256 actionId) 
        external 
        view 
        actionExists(actionId) 
        returns (bool) 
    {
        return corporateActions[actionId].currentSignatures >= corporateActions[actionId].requiredSignatures;
    }
    
    // Internal action handlers
    function _handleCapitalCall(uint256 amount) internal {
        // Notify external systems of capital call
        emit NevisRegulatoryFiling("CAPITAL_CALL", amount, block.timestamp);
    }
    
    function _handleDistribution(uint256 amount) internal {
        // Handle profit distribution to shareholders
        emit NevisRegulatoryFiling("PROFIT_DISTRIBUTION", amount, block.timestamp);
    }
    
    function _handleMortgageApproval(uint256 amount) internal {
        // Approve mortgage lending from pool
        emit NevisRegulatoryFiling("MORTGAGE_APPROVAL", amount, block.timestamp);
    }
    
    function _handleRegulatoryFiling(string memory filingType, uint256 amount) internal {
        // Handle regulatory filings with Nevis authorities
        emit NevisRegulatoryFiling(filingType, amount, block.timestamp);
    }
    
    // Admin functions
    function setLendingPoolManager(address _lendingPoolManager) external onlyOwner {
        lendingPoolManager = _lendingPoolManager;
    }
    
    function setMortgageContract(address _mortgageContract) external onlyOwner {
        mortgageContract = _mortgageContract;
    }
    
    function setComplianceOracle(address _complianceOracle) external onlyOwner {
        complianceOracle = _complianceOracle;
    }
    
    function setRequiredSignatures(uint256 _requiredSignatures) external onlyOwner {
        require(_requiredSignatures > 0, "Must require at least 1 signature");
        require(_requiredSignatures <= directorsList.length, "Cannot require more signatures than directors");
        requiredDirectorSignatures = _requiredSignatures;
    }
}