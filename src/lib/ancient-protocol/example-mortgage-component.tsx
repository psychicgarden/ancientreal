/**
 * Example React Component for Ancient Mortgage Integration
 * 
 * This component demonstrates the complete flow for purchasing a property
 * and making payments using the AncientMortgage contract.
 */

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { AncientMortgageABI, MockUSDTABI } from './abis';
import { 
  parseUSDT, 
  formatUSDT, 
  calculatePurchaseBreakdown,
  Mortgage 
} from './types';

const CONTRACTS = {
  AncientMortgage: "0xb48a5f86ffe36d3249acf6d97b14c2eac0dea6b5",
  MockUSDT: "0x82895d380f6df68d50e34d2ccc94bad1415a2b46",
};

const BASE_SEPOLIA_CHAIN_ID = 84532;

export function MortgagePurchaseComponent() {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [propertyPrice, setPropertyPrice] = useState<string>('250000.00');
  const [userTokenId, setUserTokenId] = useState<bigint | null>(null);
  const [mortgageData, setMortgageData] = useState<Mortgage | null>(null);
  const [usdtBalance, setUsdtBalance] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Web3
  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setProvider(provider);
        setSigner(signer);

        // Check network
        const network = await provider.getNetwork();
        if (Number(network.chainId) !== BASE_SEPOLIA_CHAIN_ID) {
          setError('Please switch to Base Sepolia network');
        }
      }
    };
    init();
  }, []);

  // Load USDT balance
  useEffect(() => {
    const loadBalance = async () => {
      if (!signer) return;

      const usdt = new ethers.Contract(
        CONTRACTS.MockUSDT,
        MockUSDTABI,
        signer
      );

      const address = await signer.getAddress();
      const balance = await usdt.balanceOf(address);
      setUsdtBalance(formatUSDT(balance));
    };

    loadBalance();
  }, [signer]);

  // Load mortgage data if user has one
  useEffect(() => {
    const loadMortgage = async () => {
      if (!provider || !userTokenId) return;

      const mortgage = new ethers.Contract(
        CONTRACTS.AncientMortgage,
        AncientMortgageABI,
        provider
      );

      try {
        const data = await mortgage.getMortgage(userTokenId);
        setMortgageData({
          propertyOwner: data.propertyOwner,
          propertyPrice: data.propertyPrice,
          downPayment: data.downPayment,
          loanAmount: data.loanAmount,
          monthlyPayment: data.monthlyPayment,
          remainingBalance: data.remainingBalance,
          startTime: data.startTime,
          termMonths: data.termMonths,
          paymentsMade: data.paymentsMade,
          isActive: data.isActive,
        });
      } catch (err) {
        console.error('Error loading mortgage:', err);
      }
    };

    loadMortgage();
  }, [provider, userTokenId]);

  // Purchase Property
  const handlePurchase = async () => {
    if (!signer) {
      setError('Wallet not connected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const mortgage = new ethers.Contract(
        CONTRACTS.AncientMortgage,
        AncientMortgageABI,
        signer
      );

      const usdt = new ethers.Contract(
        CONTRACTS.MockUSDT,
        MockUSDTABI,
        signer
      );

      // 1. Calculate amounts
      const propertyPriceBN = parseUSDT(propertyPrice);
      const breakdown = calculatePurchaseBreakdown(propertyPrice);
      const totalApproval = parseUSDT(breakdown.totalNeededForPurchase);

      console.log('Purchase breakdown:', breakdown);

      // 2. Check balance
      const address = await signer.getAddress();
      const balance = await usdt.balanceOf(address);
      
      if (balance < totalApproval) {
        throw new Error(
          `Insufficient USDT. Need ${breakdown.totalNeededForPurchase} USDT, ` +
          `but you have ${formatUSDT(balance)} USDT`
        );
      }

      // 3. Approve USDT
      console.log('Approving USDT...');
      const approveTx = await usdt.approve(
        CONTRACTS.AncientMortgage,
        totalApproval
      );
      await approveTx.wait();
      console.log('USDT approved');

      // 4. Purchase property
      console.log('Purchasing property for', propertyPriceBN.toString());
      const purchaseTx = await mortgage.purchaseProperty(propertyPriceBN);
      const receipt = await purchaseTx.wait();

      // 5. Extract tokenId from event
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = mortgage.interface.parseLog(log);
          return parsed?.name === 'MortgageCreated';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsedEvent = mortgage.interface.parseLog(event);
        const tokenId = parsedEvent!.args.tokenId;
        setUserTokenId(tokenId);
        
        // TODO: Save tokenId to your database
        // await saveToDatabase({ tokenId, propertyPrice, userAddress: address });
        
        alert(`Success! Your mortgage NFT token ID is: ${tokenId}`);
      }

    } catch (err: any) {
      console.error('Purchase error:', err);
      setError(err.message || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  // Make Payment
  const handleMakePayment = async () => {
    if (!signer || !userTokenId) {
      setError('No active mortgage found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const mortgage = new ethers.Contract(
        CONTRACTS.AncientMortgage,
        AncientMortgageABI,
        signer
      );

      const usdt = new ethers.Contract(
        CONTRACTS.MockUSDT,
        MockUSDTABI,
        signer
      );

      // 1. Get payment amount from mortgage data
      if (!mortgageData) {
        throw new Error('Mortgage data not loaded');
      }

      const monthlyPayment = mortgageData.monthlyPayment;

      // 2. Check balance
      const address = await signer.getAddress();
      const balance = await usdt.balanceOf(address);
      
      if (balance < monthlyPayment) {
        throw new Error(
          `Insufficient USDT. Need ${formatUSDT(monthlyPayment)} USDT, ` +
          `but you have ${formatUSDT(balance)} USDT`
        );
      }

      // 3. Approve USDT
      const allowance = await usdt.allowance(address, CONTRACTS.AncientMortgage);
      if (allowance < monthlyPayment) {
        console.log('Approving USDT for payment...');
        const approveTx = await usdt.approve(
          CONTRACTS.AncientMortgage,
          monthlyPayment
        );
        await approveTx.wait();
      }

      // 4. Make payment
      console.log('Making payment for tokenId', userTokenId.toString());
      const paymentTx = await mortgage.makePayment(userTokenId);
      await paymentTx.wait();

      alert('Payment successful!');
      
      // Reload mortgage data
      const data = await mortgage.getMortgage(userTokenId);
      setMortgageData({
        propertyOwner: data.propertyOwner,
        propertyPrice: data.propertyPrice,
        downPayment: data.downPayment,
        loanAmount: data.loanAmount,
        monthlyPayment: data.monthlyPayment,
        remainingBalance: data.remainingBalance,
        startTime: data.startTime,
        termMonths: data.termMonths,
        paymentsMade: data.paymentsMade,
        isActive: data.isActive,
      });

    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const breakdown = calculatePurchaseBreakdown(propertyPrice);

  return (
    <div className="mortgage-container">
      <h2>Ancient Mortgage System</h2>
      
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="balance-info">
        <p>Your USDT Balance: {usdtBalance} USDT</p>
      </div>

      {!mortgageData ? (
        // Purchase Form
        <div className="purchase-section">
          <h3>Purchase a Property</h3>
          
          <div className="input-group">
            <label>Property Price (USD):</label>
            <input
              type="number"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(e.target.value)}
              min="10000"
              step="1000"
              disabled={loading}
            />
          </div>

          <div className="breakdown">
            <h4>Purchase Breakdown:</h4>
            <table>
              <tbody>
                <tr>
                  <td>Property Price:</td>
                  <td>{breakdown.propertyPrice} USDT</td>
                </tr>
                <tr>
                  <td>Down Payment (20%):</td>
                  <td>{breakdown.downPayment} USDT</td>
                </tr>
                <tr>
                  <td>Platform Fee (3%):</td>
                  <td>{breakdown.platformFee} USDT</td>
                </tr>
                <tr className="highlight">
                  <td><strong>Total Due Now:</strong></td>
                  <td><strong>{breakdown.totalNeededForPurchase} USDT</strong></td>
                </tr>
                <tr>
                  <td>Loan Amount:</td>
                  <td>{breakdown.loanAmount} USDT</td>
                </tr>
                <tr>
                  <td>Monthly Payment (est):</td>
                  <td>{breakdown.estimatedMonthlyPayment} USDT</td>
                </tr>
                <tr>
                  <td>Term:</td>
                  <td>{breakdown.termMonths} months ({breakdown.termYears} years)</td>
                </tr>
                <tr>
                  <td>APR:</td>
                  <td>{breakdown.apr}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            onClick={handlePurchase}
            disabled={loading || !signer}
            className="btn-primary"
          >
            {loading ? 'Processing...' : 'Purchase Property'}
          </button>

          <div className="info-box">
            <p><strong>Note:</strong> This will require two transactions:</p>
            <ol>
              <li>Approve USDT spending</li>
              <li>Purchase the property</li>
            </ol>
            <p>No ETH is required for this transaction (only USDT).</p>
          </div>
        </div>
      ) : (
        // Mortgage Dashboard
        <div className="mortgage-section">
          <h3>Your Mortgage (NFT #{userTokenId?.toString()})</h3>
          
          <div className="mortgage-stats">
            <table>
              <tbody>
                <tr>
                  <td>Property Price:</td>
                  <td>{formatUSDT(mortgageData.propertyPrice)} USDT</td>
                </tr>
                <tr>
                  <td>Remaining Balance:</td>
                  <td>{formatUSDT(mortgageData.remainingBalance)} USDT</td>
                </tr>
                <tr>
                  <td>Monthly Payment:</td>
                  <td>{formatUSDT(mortgageData.monthlyPayment)} USDT</td>
                </tr>
                <tr>
                  <td>Payments Made:</td>
                  <td>
                    {mortgageData.paymentsMade.toString()} / {mortgageData.termMonths.toString()}
                  </td>
                </tr>
                <tr>
                  <td>Progress:</td>
                  <td>
                    {((Number(mortgageData.paymentsMade) / Number(mortgageData.termMonths)) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td>Status:</td>
                  <td>{mortgageData.isActive ? '✅ Active' : '❌ Inactive'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            onClick={handleMakePayment}
            disabled={loading || !mortgageData.isActive}
            className="btn-primary"
          >
            {loading ? 'Processing...' : 'Make Monthly Payment'}
          </button>

          <div className="info-box">
            <p><strong>Year 10 Appreciation:</strong></p>
            <p>
              After 120 payments, any property appreciation will be distributed
              automatically to the staking pool (50%) and treasury (50%).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Minimal CSS for reference
const styles = `
.mortgage-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.error-banner {
  background: #fee;
  border: 1px solid #c00;
  color: #c00;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.balance-info {
  background: #f0f0f0;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
}

.input-group input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.breakdown {
  background: #f9f9f9;
  padding: 16px;
  margin: 20px 0;
  border-radius: 4px;
}

.breakdown table {
  width: 100%;
  border-collapse: collapse;
}

.breakdown td {
  padding: 6px 0;
}

.breakdown tr.highlight {
  border-top: 2px solid #333;
  border-bottom: 2px solid #333;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: #0066cc;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover:not(:disabled) {
  background: #0052a3;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.info-box {
  margin-top: 20px;
  padding: 16px;
  background: #e7f3ff;
  border-left: 4px solid #0066cc;
  border-radius: 4px;
}

.info-box p {
  margin: 8px 0;
}

.info-box ol {
  margin: 8px 0 8px 20px;
}
`;

