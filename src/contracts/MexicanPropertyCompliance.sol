// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title MexicanPropertyCompliance
 * @dev Ensures compliance with Mexican real estate laws and regulations
 * Integrates with Mexican property registry and validates legal requirements
 */
contract MexicanPropertyCompliance is Ownable, ReentrancyGuard {
    
    // Mexican property compliance constants
    uint256 public constant FOREIGN_INVESTMENT_THRESHOLD = 10000000; // $10M threshold for RNIE registration
    uint256 public constant PROPERTY_TRANSFER_TAX_RATE = 200; // 2% transfer tax rate (basis points)
    uint256 public constant ACQUISITION_TAX_RATE = 200; // 2% acquisition tax rate
    
    // Property status enumeration
    enum PropertyStatus {
        PENDING_REGISTRATION,
        REGISTERED,
        TRANSFER_APPROVED,
        ENCUMBERED,
        DISPUTED,
        FORECLOSED
    }
    
    // Compliance requirement structure
    struct ComplianceRequirement {
        bool rnieRegistration; // Foreign investment registration
        bool propertyRegistryVerified; // Mexican property registry verification
        bool transferTaxPaid; // Transfer tax payment confirmation
        bool acquisitionTaxPaid; // Acquisition tax payment confirmation
        bool notaryApproval; // Mexican notary approval
        bool municipalPermits; // Municipal permits obtained
        bool environmentalClearance; // Environmental clearance if required
    }
    
    // Property information structure
    struct PropertyInfo {
        string registryId; // Mexican property registry ID
        string municipalId; // Municipal property ID
        string notaryId; // Notary public ID
        address currentOwner; // Current legal owner
        uint256 registeredValue; // Officially registered property value
        PropertyStatus status;
        ComplianceRequirement compliance;
        uint256 lastUpdateTimestamp;
        bool isForeignOwned; // Whether property is foreign-owned
    }
    
    // Legal entity information
    struct LegalEntity {
        string name;
        string mexicanTaxId; // RFC (Registro Federal de Contribuyentes)
        string registrationNumber;
        bool isNevisEntity; // Whether entity is registered in Nevis
        bool isMexicanEntity; // Whether entity is registered in Mexico
        bool canOwnProperty; // Whether entity can legally own Mexican property
        uint256 registrationTimestamp;
    }
    
    // Mappings
    mapping(string => PropertyInfo) public properties;
    mapping(address => LegalEntity) public legalEntities;
    mapping(string => address) public propertyToOwner;
    mapping(address => string[]) public ownerToProperties;
    mapping(string => bool) public authorizedNotaries;
    mapping(address => bool) public complianceOfficers;
    
    // Mexican regulatory authorities
    address public rnieAuthority; // RNIE (National Registry of Foreign Investment)
    address public propertyRegistryAuthority; // Mexican Property Registry
    address public taxAuthority; // SAT (Mexican Tax Authority)
    address public municipalAuthority; // Municipal authority
    
    // Events
    event PropertyRegistered(string indexed propertyId, address indexed owner);
    event ComplianceUpdated(string indexed propertyId, string requirement, bool status);
    event TransferApproved(string indexed propertyId, address indexed fromOwner, address indexed toOwner);
    event TaxPaymentVerified(string indexed propertyId, string taxType, uint256 amount);
    event NotaryApprovalGranted(string indexed propertyId, string notaryId);
    event RegulatoryNotification(string indexed propertyId, string authority, string action);
    
    // Modifiers
    modifier onlyComplianceOfficer() {
        require(complianceOfficers[msg.sender] || msg.sender == owner(), "Not authorized compliance officer");
        _;
    }
    
    modifier onlyAuthorizedNotary(string memory notaryId) {
        require(authorizedNotaries[notaryId], "Notary not authorized");
        _;
    }
    
    modifier propertyExists(string memory propertyId) {
        require(bytes(properties[propertyId].registryId).length > 0, "Property not registered");
        _;
    }
    
    constructor(
        address _rnieAuthority,
        address _propertyRegistryAuthority,
        address _taxAuthority,
        address _municipalAuthority
    ) {
        rnieAuthority = _rnieAuthority;
        propertyRegistryAuthority = _propertyRegistryAuthority;
        taxAuthority = _taxAuthority;
        municipalAuthority = _municipalAuthority;
        
        // Set deployer as initial compliance officer
        complianceOfficers[msg.sender] = true;
    }
    
    /**
     * @dev Register a new property in the compliance system
     */
    function registerProperty(
        string memory propertyId,
        string memory registryId,
        string memory municipalId,
        address owner,
        uint256 registeredValue,
        bool isForeignOwned
    ) external onlyComplianceOfficer {
        require(bytes(properties[propertyId].registryId).length == 0, "Property already registered");
        
        properties[propertyId] = PropertyInfo({
            registryId: registryId,
            municipalId: municipalId,
            notaryId: "",
            currentOwner: owner,
            registeredValue: registeredValue,
            status: PropertyStatus.PENDING_REGISTRATION,
            compliance: ComplianceRequirement({
                rnieRegistration: false,
                propertyRegistryVerified: false,
                transferTaxPaid: false,
                acquisitionTaxPaid: false,
                notaryApproval: false,
                municipalPermits: false,
                environmentalClearance: !_requiresEnvironmentalClearance(registeredValue)
            }),
            lastUpdateTimestamp: block.timestamp,
            isForeignOwned: isForeignOwned
        });
        
        propertyToOwner[propertyId] = owner;
        ownerToProperties[owner].push(propertyId);
        
        emit PropertyRegistered(propertyId, owner);
    }
    
    /**
     * @dev Register a legal entity for property ownership
     */
    function registerLegalEntity(
        address entityAddress,
        string memory name,
        string memory mexicanTaxId,
        string memory registrationNumber,
        bool isNevisEntity,
        bool isMexicanEntity
    ) external onlyComplianceOfficer {
        legalEntities[entityAddress] = LegalEntity({
            name: name,
            mexicanTaxId: mexicanTaxId,
            registrationNumber: registrationNumber,
            isNevisEntity: isNevisEntity,
            isMexicanEntity: isMexicanEntity,
            canOwnProperty: _validatePropertyOwnershipEligibility(isNevisEntity, isMexicanEntity),
            registrationTimestamp: block.timestamp
        });
    }
    
    /**
     * @dev Update RNIE registration status
     */
    function updateRNIERegistration(string memory propertyId, bool registered) 
        external 
        onlyComplianceOfficer 
        propertyExists(propertyId) 
    {
        properties[propertyId].compliance.rnieRegistration = registered;
        properties[propertyId].lastUpdateTimestamp = block.timestamp;
        
        emit ComplianceUpdated(propertyId, "RNIE_REGISTRATION", registered);
        emit RegulatoryNotification(propertyId, "RNIE", registered ? "REGISTERED" : "DEREGISTERED");
    }
    
    /**
     * @dev Verify property registry status
     */
    function verifyPropertyRegistry(string memory propertyId, bool verified) 
        external 
        onlyComplianceOfficer 
        propertyExists(propertyId) 
    {
        properties[propertyId].compliance.propertyRegistryVerified = verified;
        properties[propertyId].lastUpdateTimestamp = block.timestamp;
        
        if (verified) {
            properties[propertyId].status = PropertyStatus.REGISTERED;
        }
        
        emit ComplianceUpdated(propertyId, "PROPERTY_REGISTRY", verified);
        emit RegulatoryNotification(propertyId, "PROPERTY_REGISTRY", verified ? "VERIFIED" : "PENDING");
    }
    
    /**
     * @dev Record tax payment verification
     */
    function verifyTaxPayment(
        string memory propertyId, 
        string memory taxType, 
        uint256 amount,
        bool paid
    ) external onlyComplianceOfficer propertyExists(propertyId) {
        if (keccak256(bytes(taxType)) == keccak256(bytes("TRANSFER"))) {
            properties[propertyId].compliance.transferTaxPaid = paid;
        } else if (keccak256(bytes(taxType)) == keccak256(bytes("ACQUISITION"))) {
            properties[propertyId].compliance.acquisitionTaxPaid = paid;
        }
        
        properties[propertyId].lastUpdateTimestamp = block.timestamp;
        
        emit TaxPaymentVerified(propertyId, taxType, amount);
        emit ComplianceUpdated(propertyId, string(abi.encodePacked(taxType, "_TAX")), paid);
    }
    
    /**
     * @dev Grant notary approval
     */
    function grantNotaryApproval(string memory propertyId, string memory notaryId) 
        external 
        onlyAuthorizedNotary(notaryId)
        propertyExists(propertyId) 
    {
        properties[propertyId].notaryId = notaryId;
        properties[propertyId].compliance.notaryApproval = true;
        properties[propertyId].lastUpdateTimestamp = block.timestamp;
        
        emit NotaryApprovalGranted(propertyId, notaryId);
        emit ComplianceUpdated(propertyId, "NOTARY_APPROVAL", true);
    }
    
    /**
     * @dev Update municipal permits status
     */
    function updateMunicipalPermits(string memory propertyId, bool obtained) 
        external 
        onlyComplianceOfficer 
        propertyExists(propertyId) 
    {
        properties[propertyId].compliance.municipalPermits = obtained;
        properties[propertyId].lastUpdateTimestamp = block.timestamp;
        
        emit ComplianceUpdated(propertyId, "MUNICIPAL_PERMITS", obtained);
        emit RegulatoryNotification(propertyId, "MUNICIPAL", obtained ? "PERMITS_GRANTED" : "PERMITS_PENDING");
    }
    
    /**
     * @dev Approve property transfer
     */
    function approvePropertyTransfer(
        string memory propertyId, 
        address newOwner
    ) external onlyComplianceOfficer propertyExists(propertyId) {
        require(_isFullyCompliant(propertyId), "Property not fully compliant");
        require(legalEntities[newOwner].canOwnProperty, "New owner cannot legally own property");
        
        address oldOwner = properties[propertyId].currentOwner;
        
        // Update property ownership
        properties[propertyId].currentOwner = newOwner;
        properties[propertyId].status = PropertyStatus.TRANSFER_APPROVED;
        properties[propertyId].lastUpdateTimestamp = block.timestamp;
        
        // Update mappings
        propertyToOwner[propertyId] = newOwner;
        _removePropertyFromOwner(oldOwner, propertyId);
        ownerToProperties[newOwner].push(propertyId);
        
        emit TransferApproved(propertyId, oldOwner, newOwner);
        emit RegulatoryNotification(propertyId, "TRANSFER", "APPROVED");
    }
    
    /**
     * @dev Check if property is fully compliant
     */
    function isFullyCompliant(string memory propertyId) external view propertyExists(propertyId) returns (bool) {
        return _isFullyCompliant(propertyId);
    }
    
    /**
     * @dev Get property compliance status
     */
    function getComplianceStatus(string memory propertyId) 
        external 
        view 
        propertyExists(propertyId) 
        returns (ComplianceRequirement memory) 
    {
        return properties[propertyId].compliance;
    }
    
    /**
     * @dev Calculate required taxes for property value
     */
    function calculateRequiredTaxes(uint256 propertyValue) external pure returns (uint256 transferTax, uint256 acquisitionTax) {
        transferTax = (propertyValue * PROPERTY_TRANSFER_TAX_RATE) / 10000;
        acquisitionTax = (propertyValue * ACQUISITION_TAX_RATE) / 10000;
    }
    
    /**
     * @dev Check if RNIE registration is required
     */
    function requiresRNIERegistration(uint256 investmentAmount) external pure returns (bool) {
        return investmentAmount >= FOREIGN_INVESTMENT_THRESHOLD;
    }
    
    // Admin functions
    function addComplianceOfficer(address officer) external onlyOwner {
        complianceOfficers[officer] = true;
    }
    
    function removeComplianceOfficer(address officer) external onlyOwner {
        complianceOfficers[officer] = false;
    }
    
    function authorizeNotary(string memory notaryId, bool authorized) external onlyOwner {
        authorizedNotaries[notaryId] = authorized;
    }
    
    function updateRegulatoryAuthority(string memory authorityType, address newAuthority) external onlyOwner {
        bytes32 authType = keccak256(bytes(authorityType));
        
        if (authType == keccak256(bytes("RNIE"))) {
            rnieAuthority = newAuthority;
        } else if (authType == keccak256(bytes("PROPERTY_REGISTRY"))) {
            propertyRegistryAuthority = newAuthority;
        } else if (authType == keccak256(bytes("TAX"))) {
            taxAuthority = newAuthority;
        } else if (authType == keccak256(bytes("MUNICIPAL"))) {
            municipalAuthority = newAuthority;
        }
    }
    
    // Internal functions
    function _isFullyCompliant(string memory propertyId) internal view returns (bool) {
        ComplianceRequirement memory compliance = properties[propertyId].compliance;
        
        return compliance.rnieRegistration &&
               compliance.propertyRegistryVerified &&
               compliance.transferTaxPaid &&
               compliance.acquisitionTaxPaid &&
               compliance.notaryApproval &&
               compliance.municipalPermits &&
               compliance.environmentalClearance;
    }
    
    function _validatePropertyOwnershipEligibility(bool isNevisEntity, bool isMexicanEntity) internal pure returns (bool) {
        // Mexican law allows foreign entities to own property under certain conditions
        // Nevis entities with proper structure can own Mexican real estate
        return isNevisEntity || isMexicanEntity;
    }
    
    function _requiresEnvironmentalClearance(uint256 propertyValue) internal pure returns (bool) {
        // Properties over $5M may require environmental clearance
        return propertyValue >= 5000000 * 1e6; // $5M USDT
    }
    
    function _removePropertyFromOwner(address owner, string memory propertyId) internal {
        string[] storage ownerProperties = ownerToProperties[owner];
        for (uint256 i = 0; i < ownerProperties.length; i++) {
            if (keccak256(bytes(ownerProperties[i])) == keccak256(bytes(propertyId))) {
                ownerProperties[i] = ownerProperties[ownerProperties.length - 1];
                ownerProperties.pop();
                break;
            }
        }
    }
}