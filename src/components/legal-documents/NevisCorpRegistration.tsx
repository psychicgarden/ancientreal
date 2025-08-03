import React from 'react';

export const NevisCorpRegistration: React.FC = () => {
  return (
    <div className="bg-white text-black font-serif leading-relaxed">
      {/* Header */}
      <div className="text-center border-b-2 border-blue-800 pb-6 mb-6">
        <div className="text-2xl font-bold text-blue-800">FEDERATION OF SAINT CHRISTOPHER AND NEVIS</div>
        <div className="text-lg font-semibold mt-2">NEVIS ISLAND ADMINISTRATION</div>
        <div className="text-base mt-1">FINANCIAL SERVICES DEPARTMENT</div>
        <div className="mt-4 w-16 h-16 mx-auto border-2 border-blue-800 rounded-full flex items-center justify-center">
          <div className="text-xs text-center font-bold text-blue-800">
            <div>OFFICIAL</div>
            <div>SEAL</div>
          </div>
        </div>
      </div>

      {/* Certificate Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-blue-800">CERTIFICATE OF INCORPORATION</h1>
        <div className="text-lg mt-2">NEVIS BUSINESS CORPORATION ACT</div>
        <div className="text-base mt-1">(Chapter 9.03)</div>
      </div>

      {/* Certificate Number */}
      <div className="text-center mb-6">
        <div className="inline-block border-2 border-blue-800 px-4 py-2">
          <div className="font-bold">CERTIFICATE NO.</div>
          <div className="text-xl font-bold text-blue-800">C-47893</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <p className="text-justify">
          I HEREBY CERTIFY that <strong>ANCIENT HOLDINGS LTD.</strong> has this day been incorporated 
          under the Nevis Business Corporation Act as a Business Corporation.
        </p>

        <div className="bg-gray-50 p-4 border-l-4 border-blue-800">
          <h3 className="font-bold text-blue-800 mb-3">CORPORATION DETAILS</h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div><strong>Corporation Name:</strong> Ancient Holdings Ltd.</div>
            <div><strong>Incorporation Date:</strong> October 15, 2024</div>
            <div><strong>Corporation Number:</strong> C-47893</div>
            <div><strong>Jurisdiction:</strong> Nevis, Federation of Saint Christopher and Nevis</div>
            <div><strong>Corporation Type:</strong> Business Corporation</div>
            <div><strong>Status:</strong> Active and in Good Standing</div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 border-l-4 border-blue-800">
          <h3 className="font-bold text-blue-800 mb-3">REGISTERED OFFICE</h3>
          <div className="text-sm">
            <div>TDC Corporate Services Ltd.</div>
            <div>Suite 1, A.L. Evelyn Building</div>
            <div>Charlestown, Nevis</div>
            <div>Federation of Saint Christopher and Nevis</div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 border-l-4 border-blue-800">
          <h3 className="font-bold text-blue-800 mb-3">AUTHORIZED CAPITAL</h3>
          <div className="text-sm space-y-1">
            <div><strong>Authorized Shares:</strong> 50,000 shares</div>
            <div><strong>Share Type:</strong> Common shares without par value</div>
            <div><strong>Voting Rights:</strong> One vote per share</div>
            <div><strong>Issued Shares:</strong> 1,000 shares</div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 border-l-4 border-blue-800">
          <h3 className="font-bold text-blue-800 mb-3">DIRECTORS</h3>
          <div className="text-sm space-y-2">
            <div>
              <strong>Director:</strong> Michael Thompson<br/>
              <em>Nationality:</em> Canadian<br/>
              <em>Appointed:</em> October 15, 2024
            </div>
            <div>
              <strong>Director:</strong> Sarah Chen<br/>
              <em>Nationality:</em> Singaporean<br/>
              <em>Appointed:</em> October 15, 2024
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 border-l-4 border-blue-800">
          <h3 className="font-bold text-blue-800 mb-3">CORPORATE PURPOSE</h3>
          <div className="text-sm">
            <p>To engage in real estate investment, development, and management activities, 
            including but not limited to the acquisition, holding, and disposal of real property 
            for investment purposes, and to conduct all lawful business activities.</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 border-l-4 border-blue-800">
          <h3 className="font-bold text-blue-800 mb-3">COMPLIANCE STATUS</h3>
          <div className="text-sm space-y-1">
            <div>✓ Annual Return filed for 2024</div>
            <div>✓ Government fees paid in full</div>
            <div>✓ Registered agent appointed</div>
            <div>✓ Corporate records maintained</div>
            <div>✓ Good standing certificate current</div>
          </div>
        </div>
      </div>

      {/* Certification */}
      <div className="mt-8 pt-6 border-t-2 border-blue-800">
        <p className="text-justify mb-6">
          GIVEN under my hand and the Seal of the Nevis Island Administration this 
          <strong> 15th day of October, 2024</strong>.
        </p>

        <div className="text-center">
          <div className="inline-block">
            <div className="border-t-2 border-gray-400 pt-2 px-8">
              <p className="font-bold">Marcus Williams</p>
              <p className="text-sm">Registrar of Corporations</p>
              <p className="text-sm">Nevis Financial Services Department</p>
              <div className="mt-4 text-xs italic">Official Signature and Seal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-600 border-t pt-4">
        <p>This certificate is issued pursuant to Section 43 of the Nevis Business Corporation Act</p>
        <p>For verification purposes, contact: registrar@nevisfinance.gov.kn | Tel: +1 (869) 469-0173</p>
      </div>
    </div>
  );
};