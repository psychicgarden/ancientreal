// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title DeveloperEscrowManager
 * @dev Manages developer project funding with milestone-based escrow releases
 * 
 * Features:
 * - Milestone-based fund releases
 * - Investor protection with dispute resolution
 * - Automatic fund distribution based on completion
 * - Emergency controls for platform security
 */
contract DeveloperEscrowManager is Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;

    IERC20 public immutable usdt;
    address public immutable platformTreasury;
    uint256 public constant PLATFORM_FEE_BPS = 300; // 3%
    uint256 public constant DISPUTE_PERIOD = 14 * 24 * 60 * 60; // 14 days

    struct Project {
        address developer;
        string title;
        string description;
        uint256 targetFunding;
        uint256 currentFunding;
        uint256 minimumInvestment;
        uint256 fundingDeadline;
        uint256 projectDuration;
        ProjectStatus status;
        uint256 createdAt;
        uint256 completedAt;
        bool fundsReleased;
    }

    struct Milestone {
        uint256 projectId;
        string description;
        uint256 percentageRelease; // Basis points (10000 = 100%)
        uint256 deadline;
        bool completed;
        bool disputed;
        uint256 completedAt;
        uint256 disputeDeadline;
    }

    struct Investment {
        address investor;
        uint256 projectId;
        uint256 amount;
        uint256 timestamp;
        bool refunded;
    }

    enum ProjectStatus {
        Funding,
        Active,
        Completed,
        Cancelled,
        Disputed
    }

    // State variables
    mapping(uint256 => Project) public projects;
    mapping(uint256 => Milestone[]) public projectMilestones;
    mapping(uint256 => Investment[]) public projectInvestments;
    mapping(address => uint256[]) public developerProjects;
    mapping(address => uint256[]) public investorProjects;
    mapping(uint256 => uint256) public projectFundsHeld;
    
    Counters.Counter private _projectIds;
    Counters.Counter private _investmentIds;

    // Events
    event ProjectCreated(uint256 indexed projectId, address indexed developer, uint256 targetFunding);
    event InvestmentMade(uint256 indexed projectId, address indexed investor, uint256 amount);
    event MilestoneCompleted(uint256 indexed projectId, uint256 milestoneIndex, uint256 amountReleased);
    event MilestoneDisputed(uint256 indexed projectId, uint256 milestoneIndex, address disputer);
    event ProjectCompleted(uint256 indexed projectId, uint256 totalReleased);
    event ProjectCancelled(uint256 indexed projectId, uint256 refundAmount);
    event FundsRefunded(uint256 indexed projectId, address indexed investor, uint256 amount);

    modifier onlyDeveloper(uint256 projectId) {
        require(projects[projectId].developer == msg.sender, "Only project developer");
        _;
    }

    modifier projectExists(uint256 projectId) {
        require(projects[projectId].developer != address(0), "Project does not exist");
        _;
    }

    modifier projectInFunding(uint256 projectId) {
        require(projects[projectId].status == ProjectStatus.Funding, "Project not in funding phase");
        _;
    }

    constructor(address _usdt, address _platformTreasury) {
        usdt = IERC20(_usdt);
        platformTreasury = _platformTreasury;
    }

    /**
     * @dev Create a new developer project with milestones
     */
    function createProject(
        string memory title,
        string memory description,
        uint256 targetFunding,
        uint256 minimumInvestment,
        uint256 fundingDuration,
        uint256 projectDuration,
        string[] memory milestoneDescriptions,
        uint256[] memory milestonePercentages,
        uint256[] memory milestoneDeadlines
    ) external whenNotPaused returns (uint256) {
        require(targetFunding > 0, "Target funding must be positive");
        require(minimumInvestment > 0, "Minimum investment must be positive");
        require(milestoneDescriptions.length == milestonePercentages.length, "Milestone arrays length mismatch");
        require(milestoneDescriptions.length == milestoneDeadlines.length, "Milestone arrays length mismatch");

        // Validate milestone percentages sum to 100%
        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < milestonePercentages.length; i++) {
            totalPercentage += milestonePercentages[i];
        }
        require(totalPercentage == 10000, "Milestone percentages must sum to 100%");

        uint256 projectId = _projectIds.current();
        _projectIds.increment();

        projects[projectId] = Project({
            developer: msg.sender,
            title: title,
            description: description,
            targetFunding: targetFunding,
            currentFunding: 0,
            minimumInvestment: minimumInvestment,
            fundingDeadline: block.timestamp + fundingDuration,
            projectDuration: projectDuration,
            status: ProjectStatus.Funding,
            createdAt: block.timestamp,
            completedAt: 0,
            fundsReleased: false
        });

        // Create milestones
        for (uint256 i = 0; i < milestoneDescriptions.length; i++) {
            projectMilestones[projectId].push(Milestone({
                projectId: projectId,
                description: milestoneDescriptions[i],
                percentageRelease: milestonePercentages[i],
                deadline: block.timestamp + fundingDuration + milestoneDeadlines[i],
                completed: false,
                disputed: false,
                completedAt: 0,
                disputeDeadline: 0
            }));
        }

        developerProjects[msg.sender].push(projectId);

        emit ProjectCreated(projectId, msg.sender, targetFunding);
        return projectId;
    }

    /**
     * @dev Invest in a project during funding phase
     */
    function investInProject(uint256 projectId, uint256 amount) 
        external 
        projectExists(projectId) 
        projectInFunding(projectId) 
        nonReentrant 
        whenNotPaused 
    {
        Project storage project = projects[projectId];
        require(block.timestamp <= project.fundingDeadline, "Funding period expired");
        require(amount >= project.minimumInvestment, "Below minimum investment");
        require(project.currentFunding + amount <= project.targetFunding, "Exceeds target funding");

        require(usdt.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        project.currentFunding += amount;
        projectFundsHeld[projectId] += amount;

        projectInvestments[projectId].push(Investment({
            investor: msg.sender,
            projectId: projectId,
            amount: amount,
            timestamp: block.timestamp,
            refunded: false
        }));

        investorProjects[msg.sender].push(projectId);

        emit InvestmentMade(projectId, msg.sender, amount);

        // Activate project if fully funded
        if (project.currentFunding >= project.targetFunding) {
            project.status = ProjectStatus.Active;
        }
    }

    /**
     * @dev Complete a milestone and release funds
     */
    function completeMilestone(uint256 projectId, uint256 milestoneIndex) 
        external 
        onlyDeveloper(projectId) 
        projectExists(projectId) 
        nonReentrant 
    {
        Project storage project = projects[projectId];
        require(project.status == ProjectStatus.Active, "Project not active");
        
        Milestone storage milestone = projectMilestones[projectId][milestoneIndex];
        require(!milestone.completed, "Milestone already completed");
        require(!milestone.disputed, "Milestone is disputed");
        require(block.timestamp <= milestone.deadline, "Milestone deadline passed");

        milestone.completed = true;
        milestone.completedAt = block.timestamp;
        milestone.disputeDeadline = block.timestamp + DISPUTE_PERIOD;

        // Release funds after dispute period
        uint256 releaseAmount = (projectFundsHeld[projectId] * milestone.percentageRelease) / 10000;
        uint256 platformFee = (releaseAmount * PLATFORM_FEE_BPS) / 10000;
        uint256 developerAmount = releaseAmount - platformFee;

        projectFundsHeld[projectId] -= releaseAmount;

        require(usdt.transfer(msg.sender, developerAmount), "Developer transfer failed");
        require(usdt.transfer(platformTreasury, platformFee), "Platform fee transfer failed");

        emit MilestoneCompleted(projectId, milestoneIndex, releaseAmount);

        // Check if all milestones completed
        bool allCompleted = true;
        for (uint256 i = 0; i < projectMilestones[projectId].length; i++) {
            if (!projectMilestones[projectId][i].completed) {
                allCompleted = false;
                break;
            }
        }

        if (allCompleted) {
            project.status = ProjectStatus.Completed;
            project.completedAt = block.timestamp;
            emit ProjectCompleted(projectId, project.currentFunding);
        }
    }

    /**
     * @dev Dispute a milestone (investors can call within dispute period)
     */
    function disputeMilestone(uint256 projectId, uint256 milestoneIndex) 
        external 
        projectExists(projectId) 
    {
        Milestone storage milestone = projectMilestones[projectId][milestoneIndex];
        require(milestone.completed, "Milestone not completed");
        require(!milestone.disputed, "Already disputed");
        require(block.timestamp <= milestone.disputeDeadline, "Dispute period expired");

        // Check if caller is an investor in this project
        bool isInvestor = false;
        Investment[] storage investments = projectInvestments[projectId];
        for (uint256 i = 0; i < investments.length; i++) {
            if (investments[i].investor == msg.sender && !investments[i].refunded) {
                isInvestor = true;
                break;
            }
        }
        require(isInvestor, "Only project investors can dispute");

        milestone.disputed = true;
        projects[projectId].status = ProjectStatus.Disputed;

        emit MilestoneDisputed(projectId, milestoneIndex, msg.sender);
    }

    /**
     * @dev Cancel project and refund investors (only during funding or by owner)
     */
    function cancelProject(uint256 projectId) 
        external 
        projectExists(projectId) 
        nonReentrant 
    {
        Project storage project = projects[projectId];
        require(
            msg.sender == project.developer || 
            msg.sender == owner() || 
            (project.status == ProjectStatus.Funding && block.timestamp > project.fundingDeadline),
            "Cannot cancel project"
        );

        project.status = ProjectStatus.Cancelled;

        // Refund all investors
        uint256 totalRefunded = 0;
        Investment[] storage investments = projectInvestments[projectId];
        for (uint256 i = 0; i < investments.length; i++) {
            if (!investments[i].refunded) {
                investments[i].refunded = true;
                totalRefunded += investments[i].amount;
                require(usdt.transfer(investments[i].investor, investments[i].amount), "Refund failed");
                emit FundsRefunded(projectId, investments[i].investor, investments[i].amount);
            }
        }

        projectFundsHeld[projectId] = 0;
        emit ProjectCancelled(projectId, totalRefunded);
    }

    /**
     * @dev Resolve dispute (owner only)
     */
    function resolveDispute(uint256 projectId, uint256 milestoneIndex, bool inFavorOfDeveloper) 
        external 
        onlyOwner 
        projectExists(projectId) 
    {
        Project storage project = projects[projectId];
        require(project.status == ProjectStatus.Disputed, "Project not disputed");

        Milestone storage milestone = projectMilestones[projectId][milestoneIndex];
        require(milestone.disputed, "Milestone not disputed");

        if (inFavorOfDeveloper) {
            // Funds already released, just clear dispute
            milestone.disputed = false;
            project.status = ProjectStatus.Active;
        } else {
            // Refund milestone amount to investors proportionally
            uint256 refundAmount = (project.currentFunding * milestone.percentageRelease) / 10000;
            _refundProportionally(projectId, refundAmount);
            
            milestone.disputed = false;
            milestone.completed = false;
            project.status = ProjectStatus.Active;
        }
    }

    /**
     * @dev Internal function to refund investors proportionally
     */
    function _refundProportionally(uint256 projectId, uint256 totalRefund) internal {
        Project storage project = projects[projectId];
        Investment[] storage investments = projectInvestments[projectId];

        for (uint256 i = 0; i < investments.length; i++) {
            if (!investments[i].refunded) {
                uint256 investorShare = (investments[i].amount * totalRefund) / project.currentFunding;
                if (investorShare > 0) {
                    require(usdt.transfer(investments[i].investor, investorShare), "Refund failed");
                    emit FundsRefunded(projectId, investments[i].investor, investorShare);
                }
            }
        }

        projectFundsHeld[projectId] -= totalRefund;
    }

    // View functions
    function getProjectDetails(uint256 projectId) external view returns (
        address developer,
        string memory title,
        uint256 targetFunding,
        uint256 currentFunding,
        ProjectStatus status,
        uint256 fundingDeadline
    ) {
        Project storage project = projects[projectId];
        return (
            project.developer,
            project.title,
            project.targetFunding,
            project.currentFunding,
            project.status,
            project.fundingDeadline
        );
    }

    function getProjectMilestones(uint256 projectId) external view returns (Milestone[] memory) {
        return projectMilestones[projectId];
    }

    function getProjectInvestments(uint256 projectId) external view returns (Investment[] memory) {
        return projectInvestments[projectId];
    }

    function getDeveloperProjects(address developer) external view returns (uint256[] memory) {
        return developerProjects[developer];
    }

    function getInvestorProjects(address investor) external view returns (uint256[] memory) {
        return investorProjects[investor];
    }

    // Emergency functions
    function emergencyPause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
}