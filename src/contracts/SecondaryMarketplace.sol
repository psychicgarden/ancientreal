// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title SecondaryMarketplace
 * @dev Decentralized marketplace for trading property ownership tokens
 * Implements AMM-style liquidity pools for fractional real estate tokens
 */
contract SecondaryMarketplace is Ownable, ReentrancyGuard, Pausable, ERC1155Holder {
    using SafeERC20 for IERC20;

    struct LiquidityPool {
        IERC1155 propertyToken;
        uint256 tokenId;
        IERC20 baseToken; // USDT
        uint256 propertyTokenBalance;
        uint256 baseTokenBalance;
        uint256 totalLPTokens;
        uint256 feeRate; // Basis points (100 = 1%)
        bool isActive;
        uint256 lastPriceUpdate;
        uint256 priceImpactThreshold; // Max price impact allowed
    }

    struct LimitOrder {
        address trader;
        uint256 poolId;
        bool isBuyOrder;
        uint256 amount;
        uint256 price;
        uint256 expiry;
        bool isActive;
        uint256 partiallyFilled;
    }

    struct UserLiquidity {
        uint256 lpTokens;
        uint256 lastAddedTime;
    }

    // State variables
    mapping(uint256 => LiquidityPool) public liquidityPools;
    mapping(uint256 => mapping(address => UserLiquidity)) public userLiquidity;
    mapping(uint256 => LimitOrder) public limitOrders;
    mapping(address => uint256[]) public userOrders;
    mapping(uint256 => uint256[]) public poolOrders;
    
    uint256 public poolCount;
    uint256 public orderCount;
    uint256 public constant PRECISION = 1e18;
    uint256 public constant MAX_FEE_RATE = 500; // 5%
    uint256 public protocolFeeRate = 30; // 0.3%
    address public feeRecipient;

    // Events
    event PoolCreated(
        uint256 indexed poolId,
        address propertyToken,
        uint256 tokenId,
        address baseToken
    );
    event LiquidityAdded(
        address indexed provider,
        uint256 indexed poolId,
        uint256 propertyAmount,
        uint256 baseAmount,
        uint256 lpTokens
    );
    event LiquidityRemoved(
        address indexed provider,
        uint256 indexed poolId,
        uint256 propertyAmount,
        uint256 baseAmount,
        uint256 lpTokens
    );
    event TokensSwapped(
        address indexed trader,
        uint256 indexed poolId,
        bool propertyToBase,
        uint256 amountIn,
        uint256 amountOut
    );
    event LimitOrderCreated(
        uint256 indexed orderId,
        address indexed trader,
        uint256 indexed poolId,
        bool isBuyOrder,
        uint256 amount,
        uint256 price
    );
    event LimitOrderFilled(
        uint256 indexed orderId,
        address indexed trader,
        uint256 filledAmount,
        uint256 remainingAmount
    );

    modifier poolExists(uint256 _poolId) {
        require(_poolId < poolCount, "Marketplace: pool does not exist");
        _;
    }

    modifier poolActive(uint256 _poolId) {
        require(liquidityPools[_poolId].isActive, "Marketplace: pool not active");
        _;
    }

    constructor(address _feeRecipient) {
        feeRecipient = _feeRecipient;
    }

    /**
     * @dev Create a new liquidity pool
     */
    function createPool(
        IERC1155 _propertyToken,
        uint256 _tokenId,
        IERC20 _baseToken,
        uint256 _feeRate,
        uint256 _priceImpactThreshold
    ) external onlyOwner {
        require(address(_propertyToken) != address(0), "Marketplace: invalid property token");
        require(address(_baseToken) != address(0), "Marketplace: invalid base token");
        require(_feeRate <= MAX_FEE_RATE, "Marketplace: fee rate too high");

        liquidityPools[poolCount] = LiquidityPool({
            propertyToken: _propertyToken,
            tokenId: _tokenId,
            baseToken: _baseToken,
            propertyTokenBalance: 0,
            baseTokenBalance: 0,
            totalLPTokens: 0,
            feeRate: _feeRate,
            isActive: true,
            lastPriceUpdate: block.timestamp,
            priceImpactThreshold: _priceImpactThreshold
        });

        emit PoolCreated(poolCount, address(_propertyToken), _tokenId, address(_baseToken));
        poolCount++;
    }

    /**
     * @dev Add liquidity to a pool
     */
    function addLiquidity(
        uint256 _poolId,
        uint256 _propertyAmount,
        uint256 _baseAmount
    ) external nonReentrant whenNotPaused poolExists(_poolId) poolActive(_poolId) {
        require(_propertyAmount > 0 && _baseAmount > 0, "Marketplace: invalid amounts");

        LiquidityPool storage pool = liquidityPools[_poolId];
        uint256 lpTokensToMint;

        if (pool.totalLPTokens == 0) {
            // First liquidity provider
            lpTokensToMint = _sqrt(_propertyAmount * _baseAmount);
        } else {
            // Calculate LP tokens based on existing ratio
            uint256 propertyRatio = (_propertyAmount * PRECISION) / pool.propertyTokenBalance;
            uint256 baseRatio = (_baseAmount * PRECISION) / pool.baseTokenBalance;
            
            // Use the smaller ratio to maintain pool balance
            uint256 ratio = propertyRatio < baseRatio ? propertyRatio : baseRatio;
            lpTokensToMint = (pool.totalLPTokens * ratio) / PRECISION;
        }

        require(lpTokensToMint > 0, "Marketplace: insufficient liquidity");

        // Transfer tokens to contract
        pool.propertyToken.safeTransferFrom(msg.sender, address(this), pool.tokenId, _propertyAmount, "");
        pool.baseToken.safeTransferFrom(msg.sender, address(this), _baseAmount);

        // Update pool state
        pool.propertyTokenBalance += _propertyAmount;
        pool.baseTokenBalance += _baseAmount;
        pool.totalLPTokens += lpTokensToMint;

        // Update user liquidity
        UserLiquidity storage userLiq = userLiquidity[_poolId][msg.sender];
        userLiq.lpTokens += lpTokensToMint;
        userLiq.lastAddedTime = block.timestamp;

        emit LiquidityAdded(msg.sender, _poolId, _propertyAmount, _baseAmount, lpTokensToMint);
    }

    /**
     * @dev Remove liquidity from a pool
     */
    function removeLiquidity(
        uint256 _poolId,
        uint256 _lpTokens
    ) external nonReentrant poolExists(_poolId) {
        UserLiquidity storage userLiq = userLiquidity[_poolId][msg.sender];
        require(userLiq.lpTokens >= _lpTokens, "Marketplace: insufficient LP tokens");

        LiquidityPool storage pool = liquidityPools[_poolId];
        
        // Calculate token amounts to return
        uint256 propertyAmount = (_lpTokens * pool.propertyTokenBalance) / pool.totalLPTokens;
        uint256 baseAmount = (_lpTokens * pool.baseTokenBalance) / pool.totalLPTokens;

        // Update pool state
        pool.propertyTokenBalance -= propertyAmount;
        pool.baseTokenBalance -= baseAmount;
        pool.totalLPTokens -= _lpTokens;

        // Update user liquidity
        userLiq.lpTokens -= _lpTokens;

        // Transfer tokens back to user
        pool.propertyToken.safeTransferFrom(address(this), msg.sender, pool.tokenId, propertyAmount, "");
        pool.baseToken.safeTransfer(msg.sender, baseAmount);

        emit LiquidityRemoved(msg.sender, _poolId, propertyAmount, baseAmount, _lpTokens);
    }

    /**
     * @dev Swap tokens (AMM-style)
     */
    function swapTokens(
        uint256 _poolId,
        bool _propertyToBase,
        uint256 _amountIn,
        uint256 _minAmountOut
    ) external nonReentrant whenNotPaused poolExists(_poolId) poolActive(_poolId) {
        require(_amountIn > 0, "Marketplace: invalid input amount");

        LiquidityPool storage pool = liquidityPools[_poolId];
        
        uint256 amountOut;
        if (_propertyToBase) {
            amountOut = _getAmountOut(_amountIn, pool.propertyTokenBalance, pool.baseTokenBalance, pool.feeRate);
            require(amountOut >= _minAmountOut, "Marketplace: insufficient output amount");
            
            // Check price impact
            uint256 priceImpact = (_amountIn * 100) / pool.propertyTokenBalance;
            require(priceImpact <= pool.priceImpactThreshold, "Marketplace: price impact too high");

            // Transfer tokens
            pool.propertyToken.safeTransferFrom(msg.sender, address(this), pool.tokenId, _amountIn, "");
            pool.baseToken.safeTransfer(msg.sender, amountOut);

            // Update pool balances
            pool.propertyTokenBalance += _amountIn;
            pool.baseTokenBalance -= amountOut;
        } else {
            amountOut = _getAmountOut(_amountIn, pool.baseTokenBalance, pool.propertyTokenBalance, pool.feeRate);
            require(amountOut >= _minAmountOut, "Marketplace: insufficient output amount");

            // Check price impact
            uint256 priceImpact = (_amountIn * 100) / pool.baseTokenBalance;
            require(priceImpact <= pool.priceImpactThreshold, "Marketplace: price impact too high");

            // Transfer tokens
            pool.baseToken.safeTransferFrom(msg.sender, address(this), _amountIn);
            pool.propertyToken.safeTransferFrom(address(this), msg.sender, pool.tokenId, amountOut, "");

            // Update pool balances
            pool.baseTokenBalance += _amountIn;
            pool.propertyTokenBalance -= amountOut;
        }

        // Collect protocol fee
        uint256 protocolFee = (_amountIn * protocolFeeRate) / 10000;
        if (protocolFee > 0 && feeRecipient != address(0)) {
            if (_propertyToBase) {
                pool.baseToken.safeTransfer(feeRecipient, protocolFee);
            } else {
                pool.baseToken.safeTransfer(feeRecipient, protocolFee);
            }
        }

        pool.lastPriceUpdate = block.timestamp;

        emit TokensSwapped(msg.sender, _poolId, _propertyToBase, _amountIn, amountOut);
    }

    /**
     * @dev Create a limit order
     */
    function createLimitOrder(
        uint256 _poolId,
        bool _isBuyOrder,
        uint256 _amount,
        uint256 _price,
        uint256 _expiry
    ) external nonReentrant whenNotPaused poolExists(_poolId) poolActive(_poolId) {
        require(_amount > 0, "Marketplace: invalid amount");
        require(_price > 0, "Marketplace: invalid price");
        require(_expiry > block.timestamp, "Marketplace: invalid expiry");

        LiquidityPool storage pool = liquidityPools[_poolId];
        
        // Calculate required collateral
        uint256 collateralAmount = _isBuyOrder ? (_amount * _price) / PRECISION : _amount;
        
        // Transfer collateral
        if (_isBuyOrder) {
            pool.baseToken.safeTransferFrom(msg.sender, address(this), collateralAmount);
        } else {
            pool.propertyToken.safeTransferFrom(msg.sender, address(this), pool.tokenId, collateralAmount, "");
        }

        // Create order
        limitOrders[orderCount] = LimitOrder({
            trader: msg.sender,
            poolId: _poolId,
            isBuyOrder: _isBuyOrder,
            amount: _amount,
            price: _price,
            expiry: _expiry,
            isActive: true,
            partiallyFilled: 0
        });

        // Add to user and pool order lists
        userOrders[msg.sender].push(orderCount);
        poolOrders[_poolId].push(orderCount);

        emit LimitOrderCreated(orderCount, msg.sender, _poolId, _isBuyOrder, _amount, _price);
        orderCount++;
    }

    /**
     * @dev Fill a limit order (can be called by anyone)
     */
    function fillLimitOrder(uint256 _orderId, uint256 _fillAmount) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        require(_orderId < orderCount, "Marketplace: order does not exist");
        LimitOrder storage order = limitOrders[_orderId];
        require(order.isActive, "Marketplace: order not active");
        require(block.timestamp <= order.expiry, "Marketplace: order expired");
        require(_fillAmount > 0, "Marketplace: invalid fill amount");

        uint256 remainingAmount = order.amount - order.partiallyFilled;
        require(_fillAmount <= remainingAmount, "Marketplace: fill amount too large");

        LiquidityPool storage pool = liquidityPools[order.poolId];
        uint256 totalCost = (_fillAmount * order.price) / PRECISION;

        if (order.isBuyOrder) {
            // Sell property tokens to buy order
            pool.propertyToken.safeTransferFrom(msg.sender, order.trader, pool.tokenId, _fillAmount, "");
            pool.baseToken.safeTransfer(msg.sender, totalCost);
        } else {
            // Buy property tokens from sell order
            pool.baseToken.safeTransferFrom(msg.sender, order.trader, totalCost);
            pool.propertyToken.safeTransferFrom(address(this), msg.sender, pool.tokenId, _fillAmount, "");
        }

        // Update order
        order.partiallyFilled += _fillAmount;
        if (order.partiallyFilled >= order.amount) {
            order.isActive = false;
        }

        emit LimitOrderFilled(_orderId, order.trader, _fillAmount, remainingAmount - _fillAmount);
    }

    /**
     * @dev Calculate output amount for AMM swap
     */
    function _getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut,
        uint256 feeRate
    ) internal pure returns (uint256) {
        require(amountIn > 0, "Marketplace: insufficient input amount");
        require(reserveIn > 0 && reserveOut > 0, "Marketplace: insufficient liquidity");

        uint256 amountInWithFee = amountIn * (10000 - feeRate);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * 10000) + amountInWithFee;
        
        return numerator / denominator;
    }

    /**
     * @dev Square root function for LP token calculation
     */
    function _sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    /**
     * @dev Get current price of property token in base token
     */
    function getCurrentPrice(uint256 _poolId) external view poolExists(_poolId) returns (uint256) {
        LiquidityPool memory pool = liquidityPools[_poolId];
        if (pool.propertyTokenBalance == 0) return 0;
        return (pool.baseTokenBalance * PRECISION) / pool.propertyTokenBalance;
    }

    /**
     * @dev Get user's LP tokens for a pool
     */
    function getUserLPTokens(uint256 _poolId, address _user) external view returns (uint256) {
        return userLiquidity[_poolId][_user].lpTokens;
    }

    /**
     * @dev Get user's orders
     */
    function getUserOrders(address _user) external view returns (uint256[] memory) {
        return userOrders[_user];
    }

    /**
     * @dev Cancel an active limit order
     */
    function cancelLimitOrder(uint256 _orderId) external nonReentrant {
        require(_orderId < orderCount, "Marketplace: order does not exist");
        LimitOrder storage order = limitOrders[_orderId];
        require(order.trader == msg.sender, "Marketplace: not order owner");
        require(order.isActive, "Marketplace: order not active");

        LiquidityPool storage pool = liquidityPools[order.poolId];
        uint256 remainingAmount = order.amount - order.partiallyFilled;
        uint256 refundAmount = order.isBuyOrder ? 
            (remainingAmount * order.price) / PRECISION : remainingAmount;

        // Refund collateral
        if (order.isBuyOrder) {
            pool.baseToken.safeTransfer(msg.sender, refundAmount);
        } else {
            pool.propertyToken.safeTransferFrom(address(this), msg.sender, pool.tokenId, refundAmount, "");
        }

        order.isActive = false;
    }

    /**
     * @dev Admin functions
     */
    function setPoolActive(uint256 _poolId, bool _isActive) external onlyOwner poolExists(_poolId) {
        liquidityPools[_poolId].isActive = _isActive;
    }

    function updateProtocolFeeRate(uint256 _newRate) external onlyOwner {
        require(_newRate <= 100, "Marketplace: fee rate too high"); // Max 1%
        protocolFeeRate = _newRate;
    }

    function updateFeeRecipient(address _newRecipient) external onlyOwner {
        feeRecipient = _newRecipient;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}