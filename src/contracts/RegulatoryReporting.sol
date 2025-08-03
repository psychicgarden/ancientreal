// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title RegulatoryReporting
 * @dev Automated compliance and regulatory reporting for both Nevis and Mexican jurisdictions
 * Handles AML/KYC reporting, financial disclosures, and cross-border transaction monitoring
 */
contract RegulatoryReporting is Ownable, ReentrancyGuard {
    
    // Reporting constants
    uint256 public constant LARGE_TRANSACTION_THRESHOLD = 10000 * 1e6; // $10,000 USD
    uint256 public constant SUSPICIOUS_ACTIVITY_THRESHOLD = 50000 * 1e6; // $50,000 USD
    uint256 public constant MONTHLY_REPORT_PERIOD = 30 days;
    uint256 public constant QUARTERLY_REPORT_PERIOD = 90 days;
    uint256 public constant ANNUAL_REPORT_PERIOD = 365 days;
    
    // Jurisdiction enumeration
    enum Jurisdiction {
        NEVIS,
        MEXICO,
        INTERNATIONAL
    }
    
    // Report type enumeration
    enum ReportType {
        TRANSACTION_REPORT,
        SUSPICIOUS_ACTIVITY_REPORT,
        LARGE_CASH_TRANSACTION,
        CROSS_BORDER_TRANSFER,
        MONTHLY_FINANCIAL,
        QUARTERLY_COMPLIANCE,
        ANNUAL_AUDIT,
        KYC_UPDATE,
        AML_COMPLIANCE
    }
    
    // Transaction monitoring structure
    struct TransactionRecord {
        uint256 transactionId;
        address from;
        address to;
        uint256 amount;
        string transactionType; // "DEPOSIT", "WITHDRAWAL", "LOAN", "REPAYMENT"
        uint256 timestamp;
        bool flaggedForReview;
        bool reported;
        string reportingJurisdiction;
    }
    
    // Compliance report structure
    struct ComplianceReport {
        uint256 reportId;
        ReportType reportType;
        Jurisdiction jurisdiction;
        uint256 reportingPeriod;
        uint256 startDate;
        uint256 endDate;
        string reportHash; // IPFS hash or similar
        address submittedBy;
        uint256 submissionTimestamp;
        bool approved;
        string approvalSignature;
    }
    
    // User risk profile
    struct UserRiskProfile {
        address user;
        uint256 riskScore; // 0-100 scale
        uint256 totalTransactionVolume;
        uint256 largeTransactionCount;
        uint256 lastRiskAssessment;
        bool isHighRisk;
        bool requiresEnhancedDueDiligence;
        string[] flaggedActivities;
    }
    
    // Regulatory authority contact
    struct RegulatoryAuthority {
        string name;
        string contactEmail;
        string reportingEndpoint;
        Jurisdiction jurisdiction;
        bool isActive;
    }
    
    // State variables
    mapping(uint256 => TransactionRecord) public transactions;
    mapping(uint256 => ComplianceReport) public complianceReports;
    mapping(address => UserRiskProfile) public userRiskProfiles;
    mapping(Jurisdiction => RegulatoryAuthority) public regulatoryAuthorities;
    mapping(address => bool) public complianceOfficers;
    mapping(uint256 => bool) public reportedTransactions;
    
    uint256 public nextTransactionId;
    uint256 public nextReportId;
    uint256 public lastMonthlyReport;
    uint256 public lastQuarterlyReport;
    uint256 public lastAnnualReport;
    
    // External contract references
    address public lendingPoolManager;
    address public mortgageContract;
    address public nevisHoldingInterface;
    address public mexicanCompliance;
    
    // Events
    event TransactionRecorded(uint256 indexed transactionId, address indexed from, address indexed to, uint256 amount);
    event SuspiciousActivityDetected(uint256 indexed transactionId, address indexed user, string reason);
    event LargeTransactionReported(uint256 indexed transactionId, uint256 amount, Jurisdiction jurisdiction);
    event ComplianceReportSubmitted(uint256 indexed reportId, ReportType reportType, Jurisdiction jurisdiction);
    event RiskProfileUpdated(address indexed user, uint256 newRiskScore, bool isHighRisk);
    event RegulatoryNotification(Jurisdiction jurisdiction, string reportType, string message);
    
    // Modifiers
    modifier onlyComplianceOfficer() {
        require(complianceOfficers[msg.sender] || msg.sender == owner(), "Not authorized compliance officer");
        _;
    }
    
    modifier onlyAuthorizedContract() {
        require(
            msg.sender == lendingPoolManager || 
            msg.sender == mortgageContract ||
            msg.sender == nevisHoldingInterface ||
            msg.sender == mexicanCompliance ||
            msg.sender == owner(),
            "Not authorized contract"
        );
        _;
    }
    
    constructor() {
        // Set deployer as initial compliance officer
        complianceOfficers[msg.sender] = true;
        
        // Initialize reporting periods
        lastMonthlyReport = block.timestamp;
        lastQuarterlyReport = block.timestamp;
        lastAnnualReport = block.timestamp;
        
        // Setup regulatory authorities
        _setupRegulatoryAuthorities();
    }
    
    /**
     * @dev Record a transaction for monitoring and reporting
     */
    function recordTransaction(
        address from,
        address to,
        uint256 amount,
        string memory transactionType
    ) external onlyAuthorizedContract returns (uint256) {
        uint256 transactionId = nextTransactionId++;
        
        transactions[transactionId] = TransactionRecord({
            transactionId: transactionId,
            from: from,
            to: to,
            amount: amount,
            transactionType: transactionType,
            timestamp: block.timestamp,
            flaggedForReview: false,
            reported: false,
            reportingJurisdiction: ""
        });
        
        // Automatic monitoring and flagging
        _monitorTransaction(transactionId);
        
        // Update user risk profiles
        _updateUserRiskProfile(from, amount);
        if (from != to) {
            _updateUserRiskProfile(to, amount);
        }
        
        emit TransactionRecorded(transactionId, from, to, amount);
        
        return transactionId;
    }
    
    /**
     * @dev Submit a compliance report
     */
    function submitComplianceReport(
        ReportType reportType,
        Jurisdiction jurisdiction,
        uint256 reportingPeriod,
        uint256 startDate,
        uint256 endDate,
        string memory reportHash
    ) external onlyComplianceOfficer returns (uint256) {
        uint256 reportId = nextReportId++;
        
        complianceReports[reportId] = ComplianceReport({
            reportId: reportId,
            reportType: reportType,
            jurisdiction: jurisdiction,
            reportingPeriod: reportingPeriod,
            startDate: startDate,
            endDate: endDate,
            reportHash: reportHash,
            submittedBy: msg.sender,
            submissionTimestamp: block.timestamp,
            approved: false,
            approvalSignature: ""
        });
        
        emit ComplianceReportSubmitted(reportId, reportType, jurisdiction);
        
        // Notify regulatory authorities
        _notifyRegulatoryAuthority(jurisdiction, reportType);
        
        return reportId;
    }
    
    /**
     * @dev Flag a transaction as suspicious
     */
    function flagSuspiciousActivity(
        uint256 transactionId,
        string memory reason
    ) external onlyComplianceOfficer {
        require(transactionId < nextTransactionId, "Transaction does not exist");
        
        TransactionRecord storage txn = transactions[transactionId];
        txn.flaggedForReview = true;
        
        // Update user risk profiles
        UserRiskProfile storage profile = userRiskProfiles[txn.from];
        profile.flaggedActivities.push(reason);
        profile.isHighRisk = true;
        profile.requiresEnhancedDueDiligence = true;
        
        emit SuspiciousActivityDetected(transactionId, txn.from, reason);
        
        // Auto-generate SAR if meets criteria
        if (txn.amount >= SUSPICIOUS_ACTIVITY_THRESHOLD) {
            _generateSuspiciousActivityReport(transactionId, reason);
        }
    }
    
    /**
     * @dev Generate periodic compliance reports
     */
    function generatePeriodicReports() external onlyComplianceOfficer {
        uint256 currentTime = block.timestamp;
        
        // Monthly reports
        if (currentTime >= lastMonthlyReport + MONTHLY_REPORT_PERIOD) {
            _generateMonthlyReport();
            lastMonthlyReport = currentTime;
        }
        
        // Quarterly reports
        if (currentTime >= lastQuarterlyReport + QUARTERLY_REPORT_PERIOD) {
            _generateQuarterlyReport();
            lastQuarterlyReport = currentTime;
        }
        
        // Annual reports
        if (currentTime >= lastAnnualReport + ANNUAL_REPORT_PERIOD) {
            _generateAnnualReport();
            lastAnnualReport = currentTime;
        }
    }
    
    /**
     * @dev Update user risk score
     */
    function updateUserRiskScore(address user, uint256 newRiskScore) external onlyComplianceOfficer {
        require(newRiskScore <= 100, "Risk score must be 0-100");
        
        UserRiskProfile storage profile = userRiskProfiles[user];
        profile.riskScore = newRiskScore;
        profile.lastRiskAssessment = block.timestamp;
        profile.isHighRisk = newRiskScore >= 70; // 70+ is considered high risk
        profile.requiresEnhancedDueDiligence = newRiskScore >= 85; // 85+ requires enhanced due diligence
        
        emit RiskProfileUpdated(user, newRiskScore, profile.isHighRisk);
    }
    
    /**
     * @dev Get user risk profile
     */
    function getUserRiskProfile(address user) external view returns (
        uint256 riskScore,
        uint256 totalTransactionVolume,
        uint256 largeTransactionCount,
        bool isHighRisk,
        bool requiresEnhancedDueDiligence
    ) {
        UserRiskProfile memory profile = userRiskProfiles[user];
        return (
            profile.riskScore,
            profile.totalTransactionVolume,
            profile.largeTransactionCount,
            profile.isHighRisk,
            profile.requiresEnhancedDueDiligence
        );
    }
    
    /**
     * @dev Check if transaction requires reporting
     */
    function requiresReporting(uint256 transactionId) external view returns (bool, string memory) {
        require(transactionId < nextTransactionId, "Transaction does not exist");
        
        TransactionRecord memory txn = transactions[transactionId];
        
        if (txn.amount >= LARGE_TRANSACTION_THRESHOLD) {
            return (true, "LARGE_TRANSACTION");
        }
        
        if (txn.flaggedForReview) {
            return (true, "SUSPICIOUS_ACTIVITY");
        }
        
        // Check for pattern-based suspicious activity
        if (_detectSuspiciousPattern(txn.from)) {
            return (true, "SUSPICIOUS_PATTERN");
        }
        
        return (false, "");
    }
    
    /**
     * @dev Get compliance report statistics
     */
    function getComplianceStatistics(uint256 startDate, uint256 endDate) external view returns (
        uint256 totalTransactions,
        uint256 flaggedTransactions,
        uint256 largeTransactions,
        uint256 totalVolume,
        uint256 averageRiskScore
    ) {
        uint256 totalRiskScore = 0;
        uint256 userCount = 0;
        
        for (uint256 i = 0; i < nextTransactionId; i++) {
            TransactionRecord memory txn = transactions[i];
            
            if (txn.timestamp >= startDate && txn.timestamp <= endDate) {
                totalTransactions++;
                totalVolume += txn.amount;
                
                if (txn.flaggedForReview) {
                    flaggedTransactions++;
                }
                
                if (txn.amount >= LARGE_TRANSACTION_THRESHOLD) {
                    largeTransactions++;
                }
            }
        }
        
        // Calculate average risk score (simplified)
        // In production, this would be more sophisticated
        if (userCount > 0) {
            averageRiskScore = totalRiskScore / userCount;
        }
        
        return (totalTransactions, flaggedTransactions, largeTransactions, totalVolume, averageRiskScore);
    }
    
    // Internal functions
    function _monitorTransaction(uint256 transactionId) internal {
        TransactionRecord storage txn = transactions[transactionId];
        
        // Check for large transaction reporting
        if (txn.amount >= LARGE_TRANSACTION_THRESHOLD) {
            _reportLargeTransaction(transactionId);
        }
        
        // Check for suspicious patterns
        if (_detectSuspiciousPattern(txn.from)) {
            txn.flaggedForReview = true;
            emit SuspiciousActivityDetected(transactionId, txn.from, "SUSPICIOUS_PATTERN_DETECTED");
        }
    }
    
    function _updateUserRiskProfile(address user, uint256 transactionAmount) internal {
        UserRiskProfile storage profile = userRiskProfiles[user];
        
        if (profile.user == address(0)) {
            // Initialize new profile
            profile.user = user;
            profile.riskScore = 25; // Default low-medium risk
            profile.lastRiskAssessment = block.timestamp;
        }
        
        profile.totalTransactionVolume += transactionAmount;
        
        if (transactionAmount >= LARGE_TRANSACTION_THRESHOLD) {
            profile.largeTransactionCount++;
        }
        
        // Adjust risk score based on activity
        if (transactionAmount >= SUSPICIOUS_ACTIVITY_THRESHOLD) {
            profile.riskScore = profile.riskScore + 10; // Increase risk
            if (profile.riskScore > 100) profile.riskScore = 100;
        }
    }
    
    function _detectSuspiciousPattern(address user) internal view returns (bool) {
        UserRiskProfile memory profile = userRiskProfiles[user];
        
        // Simple pattern detection (in production, this would be more sophisticated)
        return profile.largeTransactionCount > 10 || 
               profile.totalTransactionVolume > 1000000 * 1e6 || // $1M threshold
               profile.isHighRisk;
    }
    
    function _reportLargeTransaction(uint256 transactionId) internal {
        TransactionRecord storage txn = transactions[transactionId];
        txn.reported = true;
        txn.reportingJurisdiction = "BOTH"; // Report to both Nevis and Mexico
        
        emit LargeTransactionReported(transactionId, txn.amount, Jurisdiction.NEVIS);
        emit LargeTransactionReported(transactionId, txn.amount, Jurisdiction.MEXICO);
    }
    
    function _generateSuspiciousActivityReport(uint256 transactionId, string memory reason) internal {
        // Generate SAR for both jurisdictions
        uint256 reportId = nextReportId++;
        
        complianceReports[reportId] = ComplianceReport({
            reportId: reportId,
            reportType: ReportType.SUSPICIOUS_ACTIVITY_REPORT,
            jurisdiction: Jurisdiction.INTERNATIONAL, // Report to both jurisdictions
            reportingPeriod: block.timestamp,
            startDate: block.timestamp,
            endDate: block.timestamp,
            reportHash: string(abi.encodePacked("SAR_", uint2str(transactionId), "_", reason)),
            submittedBy: address(this),
            submissionTimestamp: block.timestamp,
            approved: false,
            approvalSignature: ""
        });
        
        emit ComplianceReportSubmitted(reportId, ReportType.SUSPICIOUS_ACTIVITY_REPORT, Jurisdiction.INTERNATIONAL);
    }
    
    function _generateMonthlyReport() internal {
        uint256 reportId = nextReportId++;
        uint256 startDate = lastMonthlyReport;
        uint256 endDate = block.timestamp;
        
        complianceReports[reportId] = ComplianceReport({
            reportId: reportId,
            reportType: ReportType.MONTHLY_FINANCIAL,
            jurisdiction: Jurisdiction.NEVIS,
            reportingPeriod: endDate - startDate,
            startDate: startDate,
            endDate: endDate,
            reportHash: string(abi.encodePacked("MONTHLY_", uint2str(block.timestamp))),
            submittedBy: address(this),
            submissionTimestamp: block.timestamp,
            approved: false,
            approvalSignature: ""
        });
        
        emit ComplianceReportSubmitted(reportId, ReportType.MONTHLY_FINANCIAL, Jurisdiction.NEVIS);
    }
    
    function _generateQuarterlyReport() internal {
        uint256 reportId = nextReportId++;
        uint256 startDate = lastQuarterlyReport;
        uint256 endDate = block.timestamp;
        
        complianceReports[reportId] = ComplianceReport({
            reportId: reportId,
            reportType: ReportType.QUARTERLY_COMPLIANCE,
            jurisdiction: Jurisdiction.MEXICO,
            reportingPeriod: endDate - startDate,
            startDate: startDate,
            endDate: endDate,
            reportHash: string(abi.encodePacked("QUARTERLY_", uint2str(block.timestamp))),
            submittedBy: address(this),
            submissionTimestamp: block.timestamp,
            approved: false,
            approvalSignature: ""
        });
        
        emit ComplianceReportSubmitted(reportId, ReportType.QUARTERLY_COMPLIANCE, Jurisdiction.MEXICO);
    }
    
    function _generateAnnualReport() internal {
        uint256 reportId = nextReportId++;
        uint256 startDate = lastAnnualReport;
        uint256 endDate = block.timestamp;
        
        complianceReports[reportId] = ComplianceReport({
            reportId: reportId,
            reportType: ReportType.ANNUAL_AUDIT,
            jurisdiction: Jurisdiction.INTERNATIONAL,
            reportingPeriod: endDate - startDate,
            startDate: startDate,
            endDate: endDate,
            reportHash: string(abi.encodePacked("ANNUAL_", uint2str(block.timestamp))),
            submittedBy: address(this),
            submissionTimestamp: block.timestamp,
            approved: false,
            approvalSignature: ""
        });
        
        emit ComplianceReportSubmitted(reportId, ReportType.ANNUAL_AUDIT, Jurisdiction.INTERNATIONAL);
    }
    
    function _notifyRegulatoryAuthority(Jurisdiction jurisdiction, ReportType reportType) internal {
        RegulatoryAuthority memory authority = regulatoryAuthorities[jurisdiction];
        
        if (authority.isActive) {
            string memory reportTypeStr = _reportTypeToString(reportType);
            emit RegulatoryNotification(jurisdiction, reportTypeStr, "Report submitted");
        }
    }
    
    function _setupRegulatoryAuthorities() internal {
        // Nevis Financial Services Regulatory Commission
        regulatoryAuthorities[Jurisdiction.NEVIS] = RegulatoryAuthority({
            name: "Nevis Financial Services Regulatory Commission",
            contactEmail: "compliance@fsrc.nv",
            reportingEndpoint: "https://api.fsrc.nv/reports",
            jurisdiction: Jurisdiction.NEVIS,
            isActive: true
        });
        
        // Mexican National Banking and Securities Commission (CNBV)
        regulatoryAuthorities[Jurisdiction.MEXICO] = RegulatoryAuthority({
            name: "Comision Nacional Bancaria y de Valores",
            contactEmail: "reportes@cnbv.gob.mx",
            reportingEndpoint: "https://api.cnbv.gob.mx/reportes",
            jurisdiction: Jurisdiction.MEXICO,
            isActive: true
        });
        
        // International (for cross-border reporting)
        regulatoryAuthorities[Jurisdiction.INTERNATIONAL] = RegulatoryAuthority({
            name: "International Compliance Coordination",
            contactEmail: "international@compliance.org",
            reportingEndpoint: "https://api.compliance.org/international",
            jurisdiction: Jurisdiction.INTERNATIONAL,
            isActive: true
        });
    }
    
    function _reportTypeToString(ReportType reportType) internal pure returns (string memory) {
        if (reportType == ReportType.SUSPICIOUS_ACTIVITY_REPORT) return "SAR";
        if (reportType == ReportType.LARGE_CASH_TRANSACTION) return "LCT";
        if (reportType == ReportType.MONTHLY_FINANCIAL) return "MONTHLY";
        if (reportType == ReportType.QUARTERLY_COMPLIANCE) return "QUARTERLY";
        if (reportType == ReportType.ANNUAL_AUDIT) return "ANNUAL";
        return "UNKNOWN";
    }
    
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
    
    // Admin functions
    function addComplianceOfficer(address officer) external onlyOwner {
        complianceOfficers[officer] = true;
    }
    
    function removeComplianceOfficer(address officer) external onlyOwner {
        complianceOfficers[officer] = false;
    }
    
    function setContractAddresses(
        address _lendingPoolManager,
        address _mortgageContract,
        address _nevisHoldingInterface,
        address _mexicanCompliance
    ) external onlyOwner {
        lendingPoolManager = _lendingPoolManager;
        mortgageContract = _mortgageContract;
        nevisHoldingInterface = _nevisHoldingInterface;
        mexicanCompliance = _mexicanCompliance;
    }
}