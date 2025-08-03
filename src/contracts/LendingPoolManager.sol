// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title LendingPoolManager
 * @dev Master contract for managing the Ancient Holdings Ltd. lending pool
 * Integrates with Nevis holding company structure and Mexican real estate compliance
 * Provides ultra-liquid pool management for rent-to-own mortgages
 */
contract LendingPoolManager is ERC20, Ownable, ReentrancyGuard, Pausable {
    using SafeMath for uint256;
    
    // Constants
    uint256 public constant PRECISION = 1e18;
    uint256 public constant MIN_DEPOSIT = 1000 * 1e6; // $1,000 USDT minimum
    uint256 public constant MAX_UTILIZATION = 90; // 90% max utilization
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    
    // Core contracts and addresses
    IERC20 public immutable USDT;
    address public nevisHoldingCompany;
    address public mexicanComplianceOracle;
    address public mortgageContract;
    address public regulatoryReporting;
    
    // Pool state
    uint256 public totalDeposits;
    uint256 public totalLoaned;
    uint256 public totalInterestEarned;
    uint256 public baseAPY; // Base APY in basis points (e.g., 750 = 7.5%)
    uint256 public utilizationAPYBonus; // Additional APY based on utilization
    
    // Lending pool accounting
    struct PoolStats {
        uint256 totalLiquidity;
        uint256 availableLiquidity;
        uint256 utilizationRate;
        uint256 currentAPY;
        uint256 lastUpdateTimestamp;
    }
    
    struct LenderInfo {
        uint256 depositTimestamp;
        uint256 lastClaimTimestamp;
        uint256 accumulatedInterest;
        bool isAccredited;
        bool kycVerified;
    }
    
    struct LoanInfo {
        address borrower;
        uint256 amount;
        uint256 interestRate;
        uint256 startTimestamp;
        uint256 term; // in months
        bool active;
        string propertyId;
    }
    
    // Mappings
    mapping(address => LenderInfo) public lenders;
    mapping(uint256 => LoanInfo) public loans;
    mapping(address => bool) public authorizedBorrowers;
    mapping(string => bool) public approvedProperties;
    
    // State variables
    PoolStats public poolStats;
    uint256 public nextLoanId;
    uint256 public emergencyWithdrawalFee; // Fee for emergency withdrawals (basis points)
    
    // Events
    event Deposit(address indexed lender, uint256 amount, uint256 lpTokens);
    event Withdrawal(address indexed lender, uint256 amount, uint256 lpTokens);
    event LoanIssued(uint256 indexed loanId, address indexed borrower, uint256 amount, string propertyId);
    event LoanRepayment(uint256 indexed loanId, uint256 amount, uint256 interest);
    event APYUpdated(uint256 newAPY);
    event NevisEntityNotified(uint256 amount, string action);
    event ComplianceVerified(address indexed user, string jurisdiction);
    
    // Modifiers
    modifier onlyAccredited() {
        require(lenders[msg.sender].isAccredited, "Must be accredited investor");
        _;
    }
    
    modifier onlyKYCVerified() {
        require(lenders[msg.sender].kycVerified, "KYC verification required");
        _;
    }
    
    modifier onlyAuthorizedBorrower() {
        require(authorizedBorrowers[msg.sender], "Not authorized to borrow");
        _;
    }
    
    constructor(
        address _usdtAddress,
        address _nevisHoldingCompany,
        address _mexicanComplianceOracle,
        uint256 _baseAPY
    ) ERC20("Ancient Lending Pool Token", "ALPT") {
        USDT = IERC20(_usdtAddress);
        nevisHoldingCompany = _nevisHoldingCompany;
        mexicanComplianceOracle = _mexicanComplianceOracle;
        baseAPY = _baseAPY;
        utilizationAPYBonus = 200; // 2% bonus at 100% utilization
        emergencyWithdrawalFee = 100; // 1% emergency withdrawal fee
        
        poolStats = PoolStats({
            totalLiquidity: 0,
            availableLiquidity: 0,
            utilizationRate: 0,
            currentAPY: _baseAPY,
            lastUpdateTimestamp: block.timestamp
        });
    }
    
    /**
     * @dev Deposit USDT into the lending pool and receive LP tokens
     * @param amount Amount of USDT to deposit
     */
    function deposit(uint256 amount) external nonReentrant whenNotPaused onlyKYCVerified onlyAccredited {
        require(amount >= MIN_DEPOSIT, "Below minimum deposit");
        require(USDT.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        _updatePoolStats();
        
        // Calculate LP tokens to mint (1:1 ratio initially, adjusted for pool performance)
        uint256 lpTokens = _calculateLPTokens(amount);
        
        // Update lender info
        LenderInfo storage lender = lenders[msg.sender];
        lender.depositTimestamp = block.timestamp;
        lender.lastClaimTimestamp = block.timestamp;
        
        // Update pool state
        totalDeposits = totalDeposits.add(amount);
        poolStats.totalLiquidity = poolStats.totalLiquidity.add(amount);
        poolStats.availableLiquidity = poolStats.availableLiquidity.add(amount);
        
        // Mint LP tokens
        _mint(msg.sender, lpTokens);
        
        // Notify Nevis holding company
        emit NevisEntityNotified(amount, "DEPOSIT");
        emit Deposit(msg.sender, amount, lpTokens);
        
        _updateAPY();
    }
    
    /**
     * @dev Withdraw USDT from the lending pool by burning LP tokens
     * @param lpTokenAmount Amount of LP tokens to burn
     */
    function withdraw(uint256 lpTokenAmount) external nonReentrant whenNotPaused {
        require(balanceOf(msg.sender) >= lpTokenAmount, "Insufficient LP tokens");
        
        _updatePoolStats();
        
        // Calculate USDT amount to withdraw
        uint256 usdtAmount = _calculateUSDTFromLP(lpTokenAmount);
        require(poolStats.availableLiquidity >= usdtAmount, "Insufficient liquidity");
        
        // Update pool state
        poolStats.availableLiquidity = poolStats.availableLiquidity.sub(usdtAmount);
        poolStats.totalLiquidity = poolStats.totalLiquidity.sub(usdtAmount);
        totalDeposits = totalDeposits.sub(usdtAmount);
        
        // Burn LP tokens
        _burn(msg.sender, lpTokenAmount);
        
        // Transfer USDT
        require(USDT.transfer(msg.sender, usdtAmount), "Transfer failed");
        
        // Notify Nevis holding company
        emit NevisEntityNotified(usdtAmount, "WITHDRAWAL");
        emit Withdrawal(msg.sender, usdtAmount, lpTokenAmount);
        
        _updateAPY();
    }
    
    /**
     * @dev Issue a loan to an authorized borrower
     * @param borrower Address of the borrower
     * @param amount Loan amount in USDT
     * @param interestRate Annual interest rate in basis points
     * @param term Loan term in months
     * @param propertyId Mexican property identifier
     */
    function issueLoan(
        address borrower,
        uint256 amount,
        uint256 interestRate,
        uint256 term,
        string memory propertyId
    ) external onlyOwner nonReentrant whenNotPaused {
        require(authorizedBorrowers[borrower], "Borrower not authorized");
        require(approvedProperties[propertyId], "Property not approved");
        require(poolStats.availableLiquidity >= amount, "Insufficient pool liquidity");
        
        // Check utilization limit
        uint256 newUtilization = totalLoaned.add(amount).mul(100).div(poolStats.totalLiquidity);
        require(newUtilization <= MAX_UTILIZATION, "Exceeds max utilization");
        
        // Create loan record
        uint256 loanId = nextLoanId++;
        loans[loanId] = LoanInfo({
            borrower: borrower,
            amount: amount,
            interestRate: interestRate,
            startTimestamp: block.timestamp,
            term: term,
            active: true,
            propertyId: propertyId
        });
        
        // Update pool state
        totalLoaned = totalLoaned.add(amount);
        poolStats.availableLiquidity = poolStats.availableLiquidity.sub(amount);
        poolStats.utilizationRate = totalLoaned.mul(100).div(poolStats.totalLiquidity);
        
        // Transfer loan amount to borrower
        require(USDT.transfer(borrower, amount), "Transfer failed");
        
        emit LoanIssued(loanId, borrower, amount, propertyId);
        emit NevisEntityNotified(amount, "LOAN_ISSUED");
        
        _updateAPY();
    }
    
    /**
     * @dev Repay a loan with interest
     * @param loanId ID of the loan to repay
     * @param principalAmount Principal amount being repaid
     * @param interestAmount Interest amount being paid
     */
    function repayLoan(
        uint256 loanId,
        uint256 principalAmount,
        uint256 interestAmount
    ) external nonReentrant whenNotPaused {
        LoanInfo storage loan = loans[loanId];
        require(loan.active, "Loan not active");
        require(msg.sender == loan.borrower || msg.sender == mortgageContract, "Unauthorized repayment");
        
        uint256 totalPayment = principalAmount.add(interestAmount);
        require(USDT.transferFrom(msg.sender, address(this), totalPayment), "Transfer failed");
        
        // Update pool state
        totalLoaned = totalLoaned.sub(principalAmount);
        totalInterestEarned = totalInterestEarned.add(interestAmount);
        poolStats.availableLiquidity = poolStats.availableLiquidity.add(totalPayment);
        poolStats.utilizationRate = totalLoaned.mul(100).div(poolStats.totalLiquidity);
        
        // If fully repaid, mark loan as inactive
        if (principalAmount == loan.amount) {
            loan.active = false;
        }
        
        emit LoanRepayment(loanId, principalAmount, interestAmount);
        emit NevisEntityNotified(totalPayment, "LOAN_REPAYMENT");
        
        _updateAPY();
    }
    
    /**
     * @dev Set KYC verification status for a user
     */
    function setKYCStatus(address user, bool verified) external {
        require(msg.sender == mexicanComplianceOracle || msg.sender == owner(), "Unauthorized");
        lenders[user].kycVerified = verified;
        emit ComplianceVerified(user, "KYC");
    }
    
    /**
     * @dev Set accredited investor status for a user
     */
    function setAccreditedStatus(address user, bool accredited) external {
        require(msg.sender == mexicanComplianceOracle || msg.sender == owner(), "Unauthorized");
        lenders[user].isAccredited = accredited;
        emit ComplianceVerified(user, "ACCREDITED");
    }
    
    /**
     * @dev Authorize a borrower to take loans
     */
    function authorizeBorrower(address borrower, bool authorized) external onlyOwner {
        authorizedBorrowers[borrower] = authorized;
    }
    
    /**
     * @dev Approve a property for lending
     */
    function approveProperty(string memory propertyId, bool approved) external onlyOwner {
        approvedProperties[propertyId] = approved;
    }
    
    /**
     * @dev Calculate current claimable interest for a lender
     */
    function getClaimableInterest(address lender) external view returns (uint256) {
        LenderInfo memory lenderInfo = lenders[lender];
        uint256 lpBalance = balanceOf(lender);
        
        if (lpBalance == 0 || totalSupply() == 0) return 0;
        
        uint256 timeElapsed = block.timestamp.sub(lenderInfo.lastClaimTimestamp);
        uint256 annualInterest = lpBalance.mul(poolStats.currentAPY).div(10000);
        uint256 interest = annualInterest.mul(timeElapsed).div(SECONDS_PER_YEAR);
        
        return interest;
    }
    
    /**
     * @dev Get current pool statistics
     */
    function getPoolStats() external view returns (PoolStats memory) {
        return poolStats;
    }
    
    /**
     * @dev Emergency pause function
     */
    function emergencyPause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Internal functions
    function _calculateLPTokens(uint256 usdtAmount) internal view returns (uint256) {
        if (totalSupply() == 0) {
            return usdtAmount; // 1:1 ratio for first deposit
        }
        return usdtAmount.mul(totalSupply()).div(poolStats.totalLiquidity);
    }
    
    function _calculateUSDTFromLP(uint256 lpTokens) internal view returns (uint256) {
        if (totalSupply() == 0) return 0;
        return lpTokens.mul(poolStats.totalLiquidity).div(totalSupply());
    }
    
    function _updatePoolStats() internal {
        poolStats.lastUpdateTimestamp = block.timestamp;
        if (poolStats.totalLiquidity > 0) {
            poolStats.utilizationRate = totalLoaned.mul(100).div(poolStats.totalLiquidity);
        }
    }
    
    function _updateAPY() internal {
        // Dynamic APY based on utilization
        uint256 utilizationBonus = poolStats.utilizationRate.mul(utilizationAPYBonus).div(100);
        uint256 newAPY = baseAPY.add(utilizationBonus);
        
        poolStats.currentAPY = newAPY;
        emit APYUpdated(newAPY);
    }
    
    // Admin functions
    function setMortgageContract(address _mortgageContract) external onlyOwner {
        mortgageContract = _mortgageContract;
    }
    
    function setRegulatoryReporting(address _regulatoryReporting) external onlyOwner {
        regulatoryReporting = _regulatoryReporting;
    }
    
    function setBaseAPY(uint256 _baseAPY) external onlyOwner {
        baseAPY = _baseAPY;
        _updateAPY();
    }
}