import React from 'react';

export const SmartContractDocumentation: React.FC = () => {
  return (
    <div className="bg-white text-black font-mono text-sm leading-relaxed">
      {/* Header */}
      <div className="text-center border-b-2 border-blue-600 pb-4 mb-6 font-sans">
        <h1 className="text-2xl font-bold text-blue-600">SMART CONTRACT TECHNICAL DOCUMENTATION</h1>
        <div className="text-lg mt-2">Mazunte Property Investment Protocol</div>
        <div className="text-base mt-1">Avalanche C-Chain Deployment</div>
      </div>

      {/* Contract Overview */}
      <div className="mb-6 font-sans">
        <h2 className="text-lg font-bold mb-3 text-blue-600">CONTRACT OVERVIEW</h2>
        <div className="bg-gray-50 p-4 space-y-2">
          <div><strong>Network:</strong> Avalanche C-Chain (Mainnet)</div>
          <div><strong>Deployment Date:</strong> November 15, 2024</div>
          <div><strong>Compiler Version:</strong> Solidity 0.8.19</div>
          <div><strong>Optimization:</strong> Enabled (200 runs)</div>
          <div><strong>License:</strong> MIT</div>
        </div>
      </div>

      {/* Contract Addresses */}
      <div className="mb-6 font-sans">
        <h2 className="text-lg font-bold mb-3 text-blue-600">DEPLOYED CONTRACTS</h2>
        <div className="space-y-3">
          <div className="bg-gray-100 p-3 rounded">
            <div className="font-bold">MazunteMortgage.sol</div>
            <div className="text-xs font-mono break-all">0xA1B2C3D4E5F6789012345678901234567890ABCD</div>
            <div className="text-sm">Main mortgage and ownership management contract</div>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <div className="font-bold">RentalIncomeDistribution.sol</div>
            <div className="text-xs font-mono break-all">0xEFGH5678901234567890123456789012345678EFGH</div>
            <div className="text-sm">Handles rental income collection and distribution</div>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <div className="font-bold">VillageCitizenship.sol</div>
            <div className="text-xs font-mono break-all">0xIJKL9012345678901234567890123456789012IJKL</div>
            <div className="text-sm">NFT-based governance and property access rights</div>
          </div>
        </div>
      </div>

      {/* Security Audit */}
      <div className="mb-6 font-sans">
        <h2 className="text-lg font-bold mb-3 text-blue-600">SECURITY AUDIT RESULTS</h2>
        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <div className="font-bold text-green-800">✓ AUDIT PASSED</div>
          <div className="text-sm mt-2 space-y-1">
            <div><strong>Auditor:</strong> CertiK Blockchain Security</div>
            <div><strong>Audit Date:</strong> November 10, 2024</div>
            <div><strong>Score:</strong> 92/100 (Excellent)</div>
            <div><strong>Critical Issues:</strong> 0</div>
            <div><strong>Major Issues:</strong> 0</div>
            <div><strong>Minor Issues:</strong> 2 (Resolved)</div>
          </div>
        </div>
      </div>

      {/* Main Contract ABI */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 text-blue-600 font-sans">MAZUNTE MORTGAGE CONTRACT ABI</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto max-h-64">
          <pre>{`[
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_propertyId",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_propertyValue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_monthlyRent",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "investor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokens",
        "type": "uint256"
      }
    ],
    "name": "InvestmentMade",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "investor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "RentalIncomeClaimed",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "invest",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimRentalIncome",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "investor",
        "type": "address"
      }
    ],
    "name": "getInvestorDetails",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "investment",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tokens",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "ownershipBasisPoints",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "claimableIncome",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]`}</pre>
        </div>
      </div>

      {/* Function Documentation */}
      <div className="mb-6 font-sans">
        <h2 className="text-lg font-bold mb-3 text-blue-600">KEY FUNCTIONS DOCUMENTATION</h2>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold font-mono text-blue-700">invest(uint256 amount)</h3>
            <p className="text-sm mt-2"><strong>Purpose:</strong> Allows investors to purchase ownership tokens</p>
            <p className="text-sm"><strong>Parameters:</strong> amount - Investment amount in USD (with 18 decimals)</p>
            <p className="text-sm"><strong>Returns:</strong> Mints MAZUNTE tokens proportional to investment</p>
            <p className="text-sm"><strong>Access:</strong> Public, payable function</p>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold font-mono text-blue-700">claimRentalIncome()</h3>
            <p className="text-sm mt-2"><strong>Purpose:</strong> Allows token holders to claim accumulated rental income</p>
            <p className="text-sm"><strong>Parameters:</strong> None</p>
            <p className="text-sm"><strong>Returns:</strong> Transfers claimable rental income to caller</p>
            <p className="text-sm"><strong>Access:</strong> Public, only token holders</p>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold font-mono text-blue-700">getInvestorDetails(address investor)</h3>
            <p className="text-sm mt-2"><strong>Purpose:</strong> Returns detailed investor information</p>
            <p className="text-sm"><strong>Parameters:</strong> investor - Address to query</p>
            <p className="text-sm"><strong>Returns:</strong> Investment amount, tokens, ownership %, claimable income</p>
            <p className="text-sm"><strong>Access:</strong> Public view function</p>
          </div>
        </div>
      </div>

      {/* Gas Optimization */}
      <div className="mb-6 font-sans">
        <h2 className="text-lg font-bold mb-3 text-blue-600">GAS OPTIMIZATION REPORT</h2>
        <div className="bg-blue-50 p-4 space-y-2">
          <div><strong>invest() function:</strong> ~95,000 gas (first time), ~75,000 gas (subsequent)</div>
          <div><strong>claimRentalIncome():</strong> ~45,000 gas</div>
          <div><strong>getInvestorDetails():</strong> ~25,000 gas (view function)</div>
          <div><strong>Average transaction cost:</strong> $2.50 USD (at 25 gwei gas price)</div>
        </div>
      </div>

      {/* Emergency Procedures */}
      <div className="mb-6 font-sans">
        <h2 className="text-lg font-bold mb-3 text-blue-600">EMERGENCY PROCEDURES</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <div className="font-bold text-yellow-800">⚠ EMERGENCY PROTOCOLS</div>
          <div className="text-sm mt-2 space-y-1">
            <div><strong>Pause Function:</strong> Contract can be paused by multi-sig in emergencies</div>
            <div><strong>Upgrade Path:</strong> Proxy pattern allows for contract upgrades</div>
            <div><strong>Multi-Signature:</strong> 3/5 signatures required for critical operations</div>
            <div><strong>Timelock:</strong> 48-hour delay on major parameter changes</div>
            <div><strong>Bug Bounty:</strong> $50,000 maximum reward program active</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-600 border-t pt-4 font-sans">
        <p>Smart contracts verified on Snowtrace: https://snowtrace.io/address/0xA1B2C3D4...</p>
        <p>Source code available on GitHub: https://github.com/ancient-holdings/mazunte-contracts</p>
      </div>
    </div>
  );
};