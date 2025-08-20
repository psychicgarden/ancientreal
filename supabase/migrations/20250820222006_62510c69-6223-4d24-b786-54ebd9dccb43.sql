-- Deploy SimpleMortgage contract and update contract addresses
INSERT INTO public.contract_addresses (
  contract_name,
  address,
  network,
  deployment_status,
  abi_json,
  deployed_at
) VALUES (
  'SIMPLE_MORTGAGE',
  '0x0000000000000000000000000000000000000000', -- Placeholder - will be updated after deployment
  'fuji',
  'pending',
  '{
    "abi": [
      {
        "type": "constructor",
        "inputs": [{"name": "_usdtAddress", "type": "address", "internalType": "address"}]
      },
      {
        "type": "function",
        "name": "purchaseProperty",
        "inputs": [
          {"name": "_propertyValue", "type": "uint256", "internalType": "uint256"},
          {"name": "_downPayment", "type": "uint256", "internalType": "uint256"},
          {"name": "_interestRate", "type": "uint256", "internalType": "uint256"},
          {"name": "_termMonths", "type": "uint256", "internalType": "uint256"}
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "makePayment",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "getMortgageDetails",
        "inputs": [{"name": "_borrower", "type": "address", "internalType": "address"}],
        "outputs": [
          {
            "type": "tuple",
            "components": [
              {"name": "propertyValue", "type": "uint256", "internalType": "uint256"},
              {"name": "downPayment", "type": "uint256", "internalType": "uint256"},
              {"name": "loanAmount", "type": "uint256", "internalType": "uint256"},
              {"name": "monthlyPayment", "type": "uint256", "internalType": "uint256"},
              {"name": "remainingBalance", "type": "uint256", "internalType": "uint256"},
              {"name": "interestRate", "type": "uint256", "internalType": "uint256"},
              {"name": "termMonths", "type": "uint256", "internalType": "uint256"},
              {"name": "monthsPaid", "type": "uint256", "internalType": "uint256"},
              {"name": "nextPaymentDue", "type": "uint256", "internalType": "uint256"},
              {"name": "isActive", "type": "bool", "internalType": "bool"},
              {"name": "borrower", "type": "address", "internalType": "address"}
            ]
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "isPaymentOverdue",
        "inputs": [{"name": "_borrower", "type": "address", "internalType": "address"}],
        "outputs": [{"name": "", "type": "bool", "internalType": "bool"}],
        "stateMutability": "view"
      },
      {
        "type": "event",
        "name": "MortgageCreated",
        "inputs": [
          {"name": "borrower", "type": "address", "indexed": true},
          {"name": "propertyValue", "type": "uint256", "indexed": false},
          {"name": "downPayment", "type": "uint256", "indexed": false},
          {"name": "loanAmount", "type": "uint256", "indexed": false},
          {"name": "monthlyPayment", "type": "uint256", "indexed": false}
        ]
      },
      {
        "type": "event",
        "name": "PaymentMade",
        "inputs": [
          {"name": "borrower", "type": "address", "indexed": true},
          {"name": "paymentAmount", "type": "uint256", "indexed": false},
          {"name": "principalPaid", "type": "uint256", "indexed": false},
          {"name": "interestPaid", "type": "uint256", "indexed": false},
          {"name": "remainingBalance", "type": "uint256", "indexed": false}
        ]
      },
      {
        "type": "event",
        "name": "MortgageCompleted",
        "inputs": [
          {"name": "borrower", "type": "address", "indexed": true},
          {"name": "totalPaid", "type": "uint256", "indexed": false}
        ]
      }
    ]
  }'::jsonb,
  now()
) ON CONFLICT (contract_name, network) 
DO UPDATE SET 
  deployment_status = 'pending',
  updated_at = now();