// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title MultiSignatureWallet
 * @dev Enhanced multi-signature wallet for admin functions with time locks
 * Implements industry best practices from Gnosis Safe and similar protocols
 */
contract MultiSignatureWallet is ReentrancyGuard {
    using ECDSA for bytes32;

    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 numConfirmations;
        uint256 timestamp;
        uint256 timelock;
    }

    struct Proposal {
        string description;
        address target;
        bytes data;
        uint256 value;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
        mapping(address => bool) hasVoted;
        mapping(address => bool) voteChoice; // true = for, false = against
    }

    // State variables
    address[] public owners;
    mapping(address => bool) public isOwner;
    mapping(uint256 => mapping(address => bool)) public isConfirmed;
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => Proposal) public proposals;
    
    uint256 public numConfirmationsRequired;
    uint256 public transactionCount;
    uint256 public proposalCount;
    uint256 public constant MIN_TIMELOCK = 1 days;
    uint256 public constant MAX_TIMELOCK = 30 days;
    uint256 public constant VOTING_PERIOD = 7 days;

    // Events
    event OwnerAdded(address indexed owner);
    event OwnerRemoved(address indexed owner);
    event RequirementChanged(uint256 required);
    event SubmitTransaction(
        address indexed owner,
        uint256 indexed txIndex,
        address indexed to,
        uint256 value,
        bytes data,
        uint256 timelock
    );
    event ConfirmTransaction(address indexed owner, uint256 indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint256 indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint256 indexed txIndex);
    event ProposalCreated(uint256 indexed proposalId, string description, address indexed proposer);
    event ProposalVoted(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId);

    modifier onlyOwner() {
        require(isOwner[msg.sender], "MultiSig: not owner");
        _;
    }

    modifier txExists(uint256 _txIndex) {
        require(_txIndex < transactionCount, "MultiSig: tx does not exist");
        _;
    }

    modifier notExecuted(uint256 _txIndex) {
        require(!transactions[_txIndex].executed, "MultiSig: tx already executed");
        _;
    }

    modifier notConfirmed(uint256 _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "MultiSig: tx already confirmed");
        _;
    }

    constructor(address[] memory _owners, uint256 _numConfirmationsRequired) {
        require(_owners.length > 0, "MultiSig: owners required");
        require(
            _numConfirmationsRequired > 0 &&
                _numConfirmationsRequired <= _owners.length,
            "MultiSig: invalid number of required confirmations"
        );

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "MultiSig: invalid owner");
            require(!isOwner[owner], "MultiSig: owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
    }

    /**
     * @dev Submit a transaction with timelock for execution
     */
    function submitTransaction(
        address _to,
        uint256 _value,
        bytes memory _data,
        uint256 _timelock
    ) public onlyOwner {
        require(_timelock >= MIN_TIMELOCK && _timelock <= MAX_TIMELOCK, "MultiSig: invalid timelock");
        
        uint256 txIndex = transactionCount;
        transactions[txIndex] = Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false,
            numConfirmations: 0,
            timestamp: block.timestamp,
            timelock: _timelock
        });

        transactionCount++;

        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data, _timelock);
    }

    /**
     * @dev Confirm a transaction
     */
    function confirmTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, _txIndex);
    }

    /**
     * @dev Execute a confirmed transaction after timelock
     */
    function executeTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        nonReentrant
    {
        Transaction storage transaction = transactions[_txIndex];

        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "MultiSig: cannot execute tx"
        );
        require(
            block.timestamp >= transaction.timestamp + transaction.timelock,
            "MultiSig: timelock not expired"
        );

        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        require(success, "MultiSig: tx failed");

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    /**
     * @dev Create a governance proposal
     */
    function createProposal(
        string memory _description,
        address _target,
        bytes memory _data,
        uint256 _value
    ) public onlyOwner {
        uint256 proposalId = proposalCount++;
        
        Proposal storage proposal = proposals[proposalId];
        proposal.description = _description;
        proposal.target = _target;
        proposal.data = _data;
        proposal.value = _value;
        proposal.deadline = block.timestamp + VOTING_PERIOD;
        proposal.executed = false;

        emit ProposalCreated(proposalId, _description, msg.sender);
    }

    /**
     * @dev Vote on a proposal
     */
    function vote(uint256 _proposalId, bool _support) public onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp < proposal.deadline, "MultiSig: voting period ended");
        require(!proposal.hasVoted[msg.sender], "MultiSig: already voted");

        proposal.hasVoted[msg.sender] = true;
        proposal.voteChoice[msg.sender] = _support;

        if (_support) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }

        emit ProposalVoted(_proposalId, msg.sender, _support);
    }

    /**
     * @dev Execute a passed proposal
     */
    function executeProposal(uint256 _proposalId) public onlyOwner nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.deadline, "MultiSig: voting period not ended");
        require(!proposal.executed, "MultiSig: proposal already executed");
        require(proposal.votesFor > proposal.votesAgainst, "MultiSig: proposal rejected");
        require(proposal.votesFor >= numConfirmationsRequired, "MultiSig: insufficient votes");

        proposal.executed = true;

        (bool success, ) = proposal.target.call{value: proposal.value}(proposal.data);
        require(success, "MultiSig: proposal execution failed");

        emit ProposalExecuted(_proposalId);
    }

    /**
     * @dev Add a new owner (requires governance approval)
     */
    function addOwner(address _owner) external {
        require(msg.sender == address(this), "MultiSig: only self");
        require(_owner != address(0), "MultiSig: invalid owner");
        require(!isOwner[_owner], "MultiSig: owner exists");

        isOwner[_owner] = true;
        owners.push(_owner);

        emit OwnerAdded(_owner);
    }

    /**
     * @dev Remove an owner (requires governance approval)
     */
    function removeOwner(address _owner) external {
        require(msg.sender == address(this), "MultiSig: only self");
        require(isOwner[_owner], "MultiSig: not owner");
        require(owners.length > numConfirmationsRequired, "MultiSig: cannot remove owner");

        isOwner[_owner] = false;
        
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == _owner) {
                owners[i] = owners[owners.length - 1];
                owners.pop();
                break;
            }
        }

        emit OwnerRemoved(_owner);
    }

    /**
     * @dev Get all owners
     */
    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    /**
     * @dev Get transaction details
     */
    function getTransaction(uint256 _txIndex)
        public
        view
        returns (
            address to,
            uint256 value,
            bytes memory data,
            bool executed,
            uint256 numConfirmations,
            uint256 timestamp,
            uint256 timelock
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations,
            transaction.timestamp,
            transaction.timelock
        );
    }

    receive() external payable {}
}