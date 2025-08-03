import React from 'react';

export const InvestmentAgreement: React.FC = () => {
  return (
    <div className="bg-white text-black font-serif leading-relaxed">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold">INVESTMENT AGREEMENT</h1>
        <div className="text-lg mt-2">Mazunte Beach Property Investment</div>
        <div className="text-base mt-1">Tokenized Real Estate Investment Contract</div>
      </div>

      {/* Parties */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">PARTIES TO THIS AGREEMENT</h2>
        <div className="space-y-3 ml-4">
          <div>
            <strong>ISSUER:</strong> Ancient Holdings Ltd.<br/>
            A corporation incorporated under the laws of Nevis<br/>
            Registered Office: Suite 1, A.L. Evelyn Building, Charlestown, Nevis<br/>
            Corporation No.: C-47893
          </div>
          <div>
            <strong>INVESTOR:</strong> [Connected Wallet Address]<br/>
            Ethereum/Avalanche Address: 0x742d35Cc6641C86b8A82E9A9CFA7c8B8A6B8F2E3<br/>
            Investment Date: November 28, 2024
          </div>
        </div>
      </div>

      {/* Investment Details */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">INVESTMENT DETAILS</h2>
        <div className="bg-gray-50 p-4 space-y-2">
          <div><strong>Property:</strong> Beachfront Villa Development, Mazunte, Oaxaca, Mexico</div>
          <div><strong>Total Property Value:</strong> $750,000 USD</div>
          <div><strong>Investment Amount:</strong> $50,000 USD</div>
          <div><strong>Ownership Percentage:</strong> 6.67% (667 basis points)</div>
          <div><strong>Token Allocation:</strong> 667 MAZUNTE tokens</div>
          <div><strong>Smart Contract:</strong> 0xA1B2C3D4E5F6789...abcd (Avalanche Network)</div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">TERMS AND CONDITIONS</h2>

        <div>
          <h3 className="font-bold">1. INVESTMENT STRUCTURE</h3>
          <p className="ml-4 text-justify">
            This investment represents a fractional ownership interest in the Mazunte beach property 
            through tokenized securities. Each MAZUNTE token represents 0.01% ownership in the underlying 
            real estate asset, providing proportional rights to rental income and capital appreciation.
          </p>
        </div>

        <div>
          <h3 className="font-bold">2. RENTAL INCOME DISTRIBUTION</h3>
          <div className="ml-4 space-y-2">
            <p><strong>Monthly Rental Income:</strong> Projected $10,250 USD per month</p>
            <p><strong>Investor Share:</strong> 6.67% of net rental income after expenses</p>
            <p><strong>Expected Monthly Income:</strong> $683 USD</p>
            <p><strong>Distribution Schedule:</strong> Monthly, on the 15th of each month</p>
            <p><strong>Distribution Method:</strong> Smart contract automatic distribution</p>
          </div>
        </div>

        <div>
          <h3 className="font-bold">3. PROPERTY MANAGEMENT</h3>
          <div className="ml-4 space-y-2">
            <p><strong>Management Company:</strong> Oaxaca Property Solutions</p>
            <p><strong>Management Fee:</strong> 10% of gross rental income</p>
            <p><strong>Maintenance Reserve:</strong> 5% of gross rental income</p>
            <p><strong>Property Insurance:</strong> $150,000 coverage maintained by Ancient Holdings</p>
          </div>
        </div>

        <div>
          <h3 className="font-bold">4. SMART CONTRACT INTEGRATION</h3>
          <div className="ml-4 space-y-2">
            <p>This investment is governed by smart contracts deployed on the Avalanche blockchain:</p>
            <ul className="list-disc ml-6">
              <li><strong>Mortgage Contract:</strong> Manages ownership and payment distributions</li>
              <li><strong>Rental Income Contract:</strong> Automates monthly income distributions</li>
              <li><strong>Village Citizenship:</strong> Grants governance and property access rights</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="font-bold">5. INVESTOR RIGHTS</h3>
          <div className="ml-4">
            <ul className="list-disc ml-6 space-y-1">
              <li>Proportional share of rental income</li>
              <li>Proportional share of capital gains upon sale</li>
              <li>Voting rights on major property decisions</li>
              <li>Access to property for personal use (subject to availability)</li>
              <li>Right to transfer tokens (subject to regulatory compliance)</li>
              <li>Quarterly financial reporting</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="font-bold">6. RISK DISCLOSURES</h3>
          <div className="ml-4 text-justify">
            <p className="mb-2">
              <strong>Investment Risks:</strong> Real estate investments carry inherent risks including 
              market volatility, natural disasters, changes in local regulations, currency fluctuations, 
              and potential loss of principal.
            </p>
            <p className="mb-2">
              <strong>Technology Risks:</strong> Smart contract technology, while audited, carries risks 
              of bugs, exploits, or network failures that could affect investment recovery.
            </p>
            <p>
              <strong>Regulatory Risks:</strong> Changes in cryptocurrency or real estate regulations 
              in Mexico or internationally may affect this investment.
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-bold">7. GOVERNING LAW</h3>
          <p className="ml-4 text-justify">
            This agreement shall be governed by the laws of Nevis, with property law matters 
            governed by Mexican law. Disputes shall be resolved through binding arbitration 
            in accordance with UNCITRAL rules.
          </p>
        </div>

        <div>
          <h3 className="font-bold">8. EXIT STRATEGY</h3>
          <div className="ml-4 space-y-2">
            <p><strong>Property Sale:</strong> May be initiated by majority token holder vote</p>
            <p><strong>Token Transfer:</strong> Tokens may be transferred subject to KYC compliance</p>
            <p><strong>Buyback Program:</strong> Ancient Holdings reserves right to repurchase tokens</p>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="mt-8 grid grid-cols-2 gap-8 border-t-2 border-gray-400 pt-6">
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="font-bold">ANCIENT HOLDINGS LTD.</p>
            <p className="text-sm">By: Michael Thompson</p>
            <p className="text-sm">Director</p>
            <div className="mt-4 text-xs italic">Digital Signature</div>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="font-bold">INVESTOR</p>
            <p className="text-sm">Wallet Address:</p>
            <p className="text-xs font-mono">0x742d35Cc6641C86b8A82E9A9CFA7c8B8A6B8F2E3</p>
            <div className="mt-4 text-xs italic">Blockchain Signature</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-600 border-t pt-4">
        <p>This agreement is digitally signed and recorded on the Avalanche blockchain</p>
        <p>Transaction Hash: 0xabcd1234...5678efgh | Block: 15,892,341 | Date: 28/11/2024</p>
      </div>
    </div>
  );
};