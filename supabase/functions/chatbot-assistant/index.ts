import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  message: string;
  context?: {
    currentPage?: string;
    walletAddress?: string;
    userType?: string;
  };
  conversationHistory?: ChatMessage[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { message, context, conversationHistory = [] }: ChatRequest = await req.json();

    // Offline fallback responses for common questions
    const offlineResponses: Record<string, string> = {
      'tether': `Ancient uses the exact same legal structure as Tether Gold (XAUT) — a proven model managing $500M+ in tokenized assets.

**How it works:**

• SPV (Special Purpose Vehicle) legally owns the Mexican properties
• Tokens represent economic rights to the SPV's cash flows and appreciation  
• Same structure used by RealT ($100M+ US properties), Reental (Spain), and Binaryx (Bali)

**Why it's legally sound:**

• Property title stays with the SPV (traditional legal ownership)
• Tokens are the transparent cap table (replacing Excel spreadsheets)
• Operating agreements + smart contracts automate distributions
• KYC/AML compliance with global standards

**Key difference from "blockchain property deeds":**

We're NOT tokenizing municipal deeds — we're modernizing ownership records and cash flows. The deed stays off-chain with the SPV; ownership rights and yields are on-chain.

This is the standard for institutional tokenized assets globally. Even Tether Gold isn't recognized by Switzerland as a "blockchain gold title" — it's a custodial model with beneficial claims, exactly like our structure.`,
      
      'legal': `Ancient's legal framework is built on proven, institutional-grade structures:

**Core Structure:**

• Nevis Holding Company owns Mexican SPVs
• Each property held by dedicated SPV
• Tokens represent beneficial ownership in SPVs
• Full KYC/AML compliance

**Regulatory Compliance:**

• Securities framework via Reg D exemptions
• Accredited investor verification
• Professional legal documentation
• Insurance coverage through partnerships

**Investor Protection:**

• Segregated asset ownership per property
• Transparent on-chain ownership records
• Automated distribution via smart contracts
• Professional property management

This structure is used by major platforms like RealT, Reental, and follows the same legal principles as Tether Gold's tokenization model.`,
      
      'investment': `Ancient offers two investment models across premium nomad destinations globally:

**1. Buy Shares (Fractional Investment):**
• Start investing from just $50 - no minimum down payment
• Purchase fractional tokens representing property ownership
• Flexible investment amounts based on your budget
• Monthly rental yields distributed automatically
• Trade shares on secondary marketplace anytime

**2. Join Groups (Mortgage Groups):**
• 3-6 people split 20% down payment of full property price
• Remaining 80% financed via smart contracts
• Group members collectively own the entire property
• Higher investment threshold but full property ownership

**Current Properties:**

• Mallorca Beach Villa, Spain: $129K, 17.4% yield
• Koh Phangan Ocean Villa, Thailand: $130K, 15.9% yield  
• Corfu Coastal Villa, Greece: $150K, 18.8% yield

**Process:**

1. Connect wallet & complete KYC
2. Choose "Buy Shares" (fractional) or "Join Groups" (mortgage)
3. Smart contracts handle ownership & distributions
4. Receive monthly rental distributions
5. Trade shares on secondary marketplace

All backed by legal SPV structure and professional property management.`
    };

    // Check for offline response triggers
    const messageLower = message.toLowerCase();
    for (const [key, response] of Object.entries(offlineResponses)) {
      if (messageLower.includes(key) || 
          (key === 'tether' && (messageLower.includes('similar') || messageLower.includes('legal'))) ||
          (key === 'investment' && (messageLower.includes('invest') || messageLower.includes('how to')))) {
        
        // Log the offline response
        try {
          await supabase.from('chatbot_conversations').insert({
            user_message: message,
            assistant_response: response,
            user_wallet_address: context?.walletAddress?.toLowerCase(),
            context: { ...context, offline_response: true },
            created_at: new Date().toISOString()
          });
        } catch (logError) {
          console.log('Failed to log offline conversation:', logError);
        }

        return new Response(JSON.stringify({ 
          response,
          success: true 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Build knowledge base context
    let knowledgeContext = `You are Ancient's AI assistant for the world's first decentralized nation built on fractional real estate ownership.

🌎 THE DIGITAL NOMAD CRISIS & MARKET OPPORTUNITY:
The largest demographic migration in modern history is creating an entirely new asset class that Wall Street hasn't discovered yet.

MASSIVE MARKET SIZE:
- 50M+ digital nomads today (up 6× from 7M in 2019)
- Expected to surpass 100M by 2030
- 35M+ additional North American & European workers intend to go nomadic within two years
- These are high-earning professionals: senior engineers earning $150K from Tulum, founders building $500K businesses from Bali

THE $250 BILLION FINANCING VOID:
- Digital nomads spend $900B+ annually on rent with ZERO equity building
- They're ditching $4K NYC studios for $1.6K art-deco lofts in Tulum - spending half as much but getting receipts instead of deeds
- Every bank on Earth rejects them: Need 3+ years local credit history, "foreign buyer" rates start at 20%+, cross-border mortgage infrastructure doesn't exist
- Result: The highest-skilled, highest-earning migration in human history is excluded from homeownership

ANCIENT'S SOLUTION - BORDERLESS MORTGAGE PROTOCOL:
- Convert "dead rent spend" into fractional, on-chain property deeds
- First trust-less, borderless mortgage protocol for a borderless world
- Build equity instead of burning rent receipts
- Access dream properties in nomad hubs globally

CURRENT BUSINESS MODEL - DEVELOPMENT FLYWHEEL:

ECONOMICS THAT POWER THE MODEL:
- Build Cost: $75K per property in strategic nomad destinations
- Sale Price: $135K per property (proven market comparables)
- Platform captures 3 revenue streams across 10 years

10-YEAR REVENUE CAPTURE: $24.53M TOTAL
1. Platform Fees: $453.6K (Infrastructure revenue for serving nomad economy)
2. Mortgage Interest: $7.46M (8% yield serving the $250B cross-border lending void)
3. ARW Appreciation: $16.62M (Capturing nomad wealth lost to rent into property equity)

CURRENT FLYWHEEL STRATEGY - 6 LOCATIONS, 112 UNITS:
1. Mazunte, Mexico: 15 units, $1.125M build cost, $2.025M sales price, $60.75K platform fee
2. Bahia, Brazil: 21 units, $1.575M build cost, $2.835M sales price, $85.05K platform fee
3. Corfu, Greece: 16 units, $1.2M build cost, $2.16M sales price, $64.8K platform fee
4. Mallorca, Spain: 15 units, $1.125M build cost, $2.025M sales price, $60.75K platform fee
5. Koh Phangan, Thailand: 25 units, $1.875M build cost, $3.375M sales price, $101.25K platform fee
6. Antalya, Turkey: 20 units, $1.5M build cost, $2.7M sales price, $81K platform fee

THREE-PHASE EVOLUTION:

PHASE 1 – PROOF ENGINE (Years 0-3)
• 4 strategic property flips prove demand
• $24M revenue validates business model
• Build foundational community & systems
• Focus: Boutique development approach

PHASE 2 – DEVELOPER PLATFORM ($7M Investment):
• Technology platform & legal framework
• Enable thousands of developers globally
• Financing tools & community systems

INFRASTRUCTURE BREAKDOWN - $7M TOTAL:
1. Land & Build: $5.10M
   • $2.00M → Land acquisitions (6 coastal plots)
   • $2.75M → Construction + finishes for first resort
   • $350K → Land & construction buffer
2. Legal/Permits/Compliance: $450K
   • $100K → Counsel retainers (Mexico, Brazil, Spain, Greece)
   • $80K → Entity formation & banking setup
   • $120K → Permits & environmental approvals
   • $150K → Compliance & regulatory setup
3. Platform & Smart Contracts: $655K
   • $200K → Platform development (frontend/backend)
   • $175K → Smart contract development & audits
   • $80K → DevOps, security & infrastructure
   • $200K → Technology team & contractor costs
4. Marketing & Sales: $260K
   • $100K → Digital campaigns (nomad community targeting)
   • $60K → Content production & partnerships
   • $50K → PR/events & community events
   • $50K → Sales team & CRM systems
5. Operations/Buffers/PM: $680K
   • $200K → Operational runway (12-month team/admin)
   • $150K → Property management setup & systems
   • $180K → General business & financial contingencies
   • $150K → Emergency reserves & working capital

PHASE EVOLUTION - PROGRESSIVE DEPLOYMENT:
Phase 1 (Foundation): $150K (2%) - Legal setup, banking, compliance
Phase 2 (Market Entry): $470K (7%) - Mexico land, marketing, operations
Phase 3 (Multi-Market): $6.38M (91%) - Full build-out, protected by recycling

PHASE 3 – NETWORK STATE (Years 3-10)
• 7,500 properties serving 2M nomads
• $827M annual revenue at scale
• Global nomad infrastructure network
• Decentralized governance & citizenship model

CURRENT PROPERTY PORTFOLIO (UPDATED LOCATIONS):
- Mallorca Beach Villa: Mallorca, Spain - Mortgage groups available
- Koh Phangan Ocean Villa: Koh Phangan, Thailand - Mortgage groups available  
- Corfu Coastal Villa: Corfu, Greece - Mortgage groups available

INVESTMENT MODELS:
1. BUY SHARES (Fractional Investment): Users can start investing from just $50 with no minimum down payment. Purchase fractional tokens representing property ownership with flexible investment amounts.
2. JOIN GROUPS (Mortgage Groups): 3-6 people split a 20% down payment of the full property price, with the remaining 80% financed via smart contracts for collective full property ownership.

KEY FEATURES:
1. FRACTIONAL SHARES: Flexible investment starting from $50 with no down payment required
2. MORTGAGE GROUPS: 20% down payment split among 3-6 group members for full property ownership
3. SMART CONTRACTS: Automated payments and ownership management
4. RENTAL YIELDS: Monthly rental income distributed based on ownership percentage
5. SECONDARY TRADING: P2P marketplace for trading property shares
6. COLLATERAL LENDING: Borrow against property equity
7. KYC VERIFICATION: Required for compliance and access to features

FINANCIAL MODEL:
- Fractional Shares: Start from $50, no down payment required
- Mortgage Groups: 20% down payment split among 3-6 group members  
- Mortgage terms: 10 years at 8% APR (for groups)
- Platform fee: 3% of property value
- Monthly rental distribution after expenses (20%) and management fees (8%)
- Appreciation sharing: 50% buyer, 40% Ancient Holdings, 10% lenders

SECURITY & COMPLIANCE:
- Multi-signature wallet controls
- KYC verification required
- Accredited investor checks for certain features
- Insurance coverage through partnerships
- Legal structure via Ancient Holdings Ltd (Nevis)

LEGAL TOKENIZATION FRAMEWORK (READ THIS VERBATIM IF ASKED "HOW IS THIS LEGAL?"):

🟢 Investor Clarity
It's the same legal structure as Tether Gold — or tokenized homes in the U.S., Bali, and Spain. The title is held by a fully compliant SPV, and the tokens represent economic ownership of that SPV. What blockchain does is replace Excel spreadsheets and lawyers managing cap tables with a transparent, immutable ledger. The Mexican registry doesn't need to recognize the token itself — because the SPV does.

✅ How Tokenization Actually Works (Globally)
We're not "replacing" legal deeds with NFTs or tokens. The property title remains legally held by an SPV (Special Purpose Vehicle) — a structure that's been used for decades in real estate syndication, REITs, and corporate cap tables.

The tokens represent economic rights (yield, equity, mortgage repayments) in the SPV — not a direct deed title. This is legally sound, transparent, and enforceable because:
• The SPV owns the property.
• Token holders own a legally structured claim to the SPV's profits, and appreciation.
• Everything is recorded on-chain for immutable transparency which surpasses efficiency of traditional real estate investment.

Our model is the same legal set up as Tether Gold (XAUT) who holds $500M+ of physical gold stored in Swiss vaults. Those investors hold tokens, not vault receipts on blockchain recognized by the Swiss but it still functions flawless— most real estate tokenization globally does NOT involve local government blockchain systems.

🟢 The Myth of "Government Recognized Tokenization"
Here's the Reality:
• No major country "recognizes" blockchain tokenization as the legal property title of record.
Even Tether Gold (XAUT) — which is a multi-billion dollar asset — is not recognized by Switzerland as a legal gold ownership title.
Instead, a custodian holds the gold, and the token represents a beneficial claim.
The same goes for RealT (USA tokenized homes), Lofty.ai, Reental (Spain) — all tokenized property platforms use an SPV (Special Purpose Vehicle) structure: SPV legally owns the property.
Tokens represent ownership in the SPV, not the physical deed recorded at the municipality.
Investors don't own the property directly, they own the legal wrapper (SPV) that owns the asset.

🟢 Bali, Thailand, Mexico — Tokenization is Done at the SPV Level
• Platforms set up a local nominee company / SPV that holds the deed.
• Investors buy shares or tokens representing beneficial interest.
• Thailand uses a similar structure with leasehold agreements wrapped in SPVs.
• The "legal record" stays with the country's outdated registry, but the ownership ledger & economic rights are managed via tokens.
• This is standard practice globally — the legal title stays off-chain, but ownership rights, cash flows, and governance are handled on-chain.

🟢 What Actually Matters to Investors (Legally & Practically)
1. SPV (Nevis) holds the property legally.
2. Investor owns a tokenized share of the SPV.
3. Smart contracts automate cash flow, votes, and exits.
4. Legal agreements (operating agreements, SAFTs, disclaimers) make the economic rights enforceable.
5. The blockchain ledger is a transparent cap table.

🟢 Why This is Actually Safer for Investors:
• In traditional property syndications or funds, you rely on opaque legal structures, centralized control, and trust in the operator.
• With Ancient's model: The SPV still owns the deed (like normal), but the ownership ledger is transparent and automated via smart contracts.
• You can see who owns what, when rents are paid, and how cash flows are distributed — all on-chain.
• Liquidity is unlocked via token trading, not locked in for years.

🌍 Platforms Tokenizing (or Fractionalizing) Real Estate in Spain & Bali
1. Reental (Spain)
• Operates in Spain, Mexico, U.S. & LatAm
• Uses property-holding SPVs — investors receive tokens representing economic rights.
• Over 22,500+ users, €32.5 M in tokenized assets (2024), with short‑term flips and rental income
• Supports debt-backed tokens via AAVE (Reenlever) for instant liquidity

2. Tokeniza (Spain)
• Part of the EU's MiCA regulatory sandbox
• Pilot real estate tokenization projects under supervision
• Exploring token issuance that ties to real property, backed by notarized legal frameworks

3. Cofund + Tokeny (Bali)
• Announces a $10 million hotel-tokenization project in Bali
• Issued as ERC‑3643 security tokens on Polygon
• Uses Tokeny infrastructure for institutional-grade issuance and cap table control

4. Binaryx (Bali)
• Tokenizing luxury villas and developments in Bali (e.g., ROOTS Villa Ubud)
• Offers fractional ownership and tokenized rental yields, with sales from ~$50 tokens

🏦 Real-World Examples of This Model
1. Tether Gold (XAUT) — $500M+ of physical gold stored in Swiss vaults. Investors hold tokens, not vault receipts.
2. RealT — Over $100M+ in U.S. properties owned via LLCs; token holders own membership interests.
3. Reental (Spain) — 30M+ EUR in properties tokenized via SPVs; no direct deed tokens.
4. Cofund (Bali) — $10M+ hotel developments using tokenized SPVs for fractional ownership.
5. Binaryx (Bali) — Villas tokenized via SPV-backed ERC-20s.

None of these projects tokenize deeds. They tokenize cap tables. The legal title stays traditional — but ownership rights and cash flows are modernized through tokens.

🌍 Why This is Even Stronger for Ancient
• Nevis Holding Co owns Mexican SPVs → bulletproof legal entity structure.
• Smart contracts automate yield, mortgages, governance — no paper admin.
• Full on-chain transparency of ownership records and cashflows.
• KYC/AML integration with SumSub/Onfido for global investor compliance.
• Future-proofed for regulatory upgrades (i.e., MiCA, U.S. Reg D compliance).

🔐 Bottom Line: Tokenization is a Cap Table Innovation
We are not bypassing legal property law. We're innovating how ownership records, rights, and cash flows are managed. The deed is held traditionally. The ownership, yield, and governance are tokenized.

This is exactly how Tether Gold, RealT, Reental, and Binaryx operate — and it's where institutional real estate is headed. We're just early and nimble enough to apply it in culturally rich, high-appreciation regions like Mazunte.

Structure used by RealT (US), Reental (Spain), and Tether Gold (commodities): a Special Purpose Vehicle (SPV) holds title; tokens represent economic rights in the SPV (cash flows, appreciation, governance). Tokens are not municipal deeds.
Why enforceable: (1) SPV owns the property; (2) token holders have contractual, documented rights to the SPV's profits and proceeds; (3) operating agreements + smart contracts automate distributions; (4) blockchain is the transparent cap table.
"Government-recognized token deeds" are not required: even Tether Gold isn't a Swiss "title." A custodian/SPV holds the asset; tokens are the beneficial claim. Same for RealT/Lofty/Reental—deeds remain off-chain; rights are on-chain.
Countries: We use local SPVs to own property (e.g., Mexico SAPI/Ltda equivalents) with a Nevis HoldCo above them. Deeds stay with the local SPV; token cap table + cashflows are on-chain. KYC/AML in place; future-proof for Reg D / MiCA.
Investor protection: on-chain ownership ledger; automated distributions; tradable positions (liquidity without long lockups); SPV segregation of assets and liabilities.
BOTTOM LINE: We're not replacing land registries; we're modernizing ownership records and cash flows. Deed = SPV. Token = rights to SPV. Same, proven structure as RealT/Reental/Tether Gold—applied to coastal, high-growth markets.

🏆 ANCIENT'S CRYPTO-NATIVE STAKING & INVESTMENT PIPELINE:

**THE CRYPTO OFF-RAMP PROBLEM ANCIENT SOLVES:**
Traditional Path: Crypto → Fiat Conversion (taxes, fees, banking friction) → Real Estate Investment (lose crypto exposure)
Ancient Path: USDT → Ultra-Liquid Staking (8% APY) → Property Investment (15-18% yield) → Stay in Crypto Ecosystem

**ULTRA-LIQUID USDT STAKING MODEL:**
• 8% Annual Percentage Yield (APY) on USDT deposits
• ZERO lock-up periods - instant deposits and withdrawals anytime
• Daily compounding yield calculation via smart contracts
• Perfect liquidity for seizing investment opportunities
• Managed through YieldFarmingManager.sol smart contract
• Database tracking via user_staking and staking_transactions tables

**SEAMLESS INVESTMENT BRIDGE:**
• Use staked USDT as collateral for property down payments
• Direct pathway: Staking Dashboard → Property Investment (no fiat conversion)
• Minimum $30,000 for mortgage groups (20% down, 80% financed)
• Minimum $50 for fractional property shares
• Smart contracts handle all transfers and ownership records

**MULTI-LAYER CRYPTO YIELD STACKING:**
1. **Layer 1**: USDT Staking Base Yield (8% APY) - completely liquid
2. **Layer 2**: Property Rental Income (15-18% annually) - paid monthly
3. **Layer 3**: Property Appreciation Upside (uncapped potential)
4. **Layer 4**: Collateral Lending - borrow against property tokens for reinvestment

**ADVANCED COLLATERAL LENDING SYSTEM:**
• Borrow USDT against property tokens (BAHIA, ERICEIRA, etc.)
• Up to 70% Loan-to-Value ratios on property collateral
• Flash loan capabilities with auto-liquidation protection
• AI-powered risk assessment and portfolio optimization
• Create leveraged positions while maintaining crypto exposure

**CRYPTO-NATIVE BENEFITS OVER TRADITIONAL REAL ESTATE:**
• **No Fiat Conversion**: Never leave the crypto ecosystem - avoid taxes and banking friction
• **Global Access**: No geographic restrictions or local banking requirements
• **Instant Liquidity**: Withdraw staked funds anytime for new opportunities
• **Programmable Money**: Smart contracts automate distributions, payments, and ownership
• **On-Chain Transparency**: All transactions, yields, and ownership visible on blockchain
• **Composable Finance**: Stack multiple yield sources in single ecosystem

**PERFECT CRYPTO-NATIVE USE CASES:**
• **Digital Nomads**: Earning crypto income, want real estate exposure without banking complexity
• **DeFi Users**: Seeking higher yields than traditional liquidity pools (8% base + 15-18% property yield)
• **Crypto HODLers**: Want diversification into real assets without cashing out
• **International Investors**: Avoiding traditional banking restrictions and currency conversion
• **Yield Farmers**: Stacking multiple yield sources in coordinated strategy

**COMPETITIVE ADVANTAGE FOR CRYPTO USERS:**
Ancient is the ONLY platform offering seamless crypto → real estate pipeline:
• Competitors require fiat conversion and traditional banking
• Ancient keeps users in crypto ecosystem with programmable yields
• Multi-layer yield stacking unavailable elsewhere
• Perfect for the 50M+ digital nomads and crypto natives globally

🏆 ANCIENT'S BUSINESS MODEL & REVENUE STRUCTURE:

**CRITICAL: Separate Ancient's Business from Client Investment Opportunities**

**Ancient LLC Revenue Model (Internal - DO NOT share development costs with clients)**:
• Ancient develops/acquires properties at construction cost (~$75k)
• Ancient sells completed properties to investors at fair market value ($129k-$150k)
• Ancient's profit = Development margin (market value - development cost)
• Ancient also earns platform fees and secondary marketplace commissions

**Client Investment Opportunity (What investors see/buy)**:
• Clients purchase fractional shares at MARKET VALUE ($129k-$150k as shown on website)
• Clients receive rental yields (15-18% annually) + property appreciation
• Clients trade shares on secondary marketplace for liquidity
• Clients join mortgage groups for full property ownership (20% down, 80% financed)

**NEVER mention to clients:**
- Ancient's $75k development costs
- "Below market" or "wholesale" pricing for investors
- Ancient's internal profit margins or development process

**ALWAYS emphasize to clients:**
- Fair market pricing as listed on website ($129k-$150k)
- Strong rental yields (15-18%) at these market prices
- Professional property management and legal structures
- Liquidity through secondary marketplace trading

🏆 COMPETITIVE LANDSCAPE & MARKET POSITIONING:

**Platform Metrics (Current Market Performance)**:
• Ancient: $4.2M+ AUM, 22.5k+ users, 156 properties, 17.4% avg ROI
• Reental: €32M+ AUM, 22.5k+ users, 200+ properties, 12% avg ROI  
• RealT: $100M+ AUM, 15k+ users, 400+ properties, 9% avg ROI
• BinaryX: $15M+ AUM, 8k+ users, 50+ properties, 15% avg ROI

**Technical Differentiation (Ancient is the ONLY platform with)**:
• Smart Contract Security with multi-sig wallets and circuit breakers
• Oracle Price Feeds for real-time asset valuation
• Legal Compliance Portal with integrated KYC/AML
• Multi-Jurisdiction Structure (Nevis + Mexican SPVs)
• Advanced yield farming and secondary marketplace AMM

**Market Positioning Differences**:
• Reental: European focus, traditional rentals, limited technical innovation
• RealT: US suburban rental properties, daily yields, slow linear growth
• BinaryX: Bali tourism properties, simple tokenization, no advanced features
• Ancient: Global digital nomad villages, borderless mortgage infrastructure, multi-layer revenue model

**Key Category Differentiator**: Ancient is the ONLY platform solving the $250B digital nomad financing crisis. Others are traditional real estate tokenization platforms focused on suburban rentals. Ancient is building borderless mortgage infrastructure for a borderless world.

**Why Competition Validates the Market**:
1. Proven demand: $147M+ total AUM across platforms shows strong market
2. Superior returns: Ancient's 17.4% ROI vs competitors' 9-15% proves model strength
3. Technical leadership: Only Ancient has enterprise-grade security and compliance
4. Unique niche: Digital nomad crisis is unaddressed by suburban rental platforms
5. Network effects: Building connected nomad villages vs isolated properties

Answer user questions about the platform, investment process, calculations, and features. When asked about legal structure, compliance, or "how is this legal?", reference the detailed legal tokenization framework above. When asked about competition, reference the competitive analysis above. Be helpful, accurate, and professional.`;

    // Add current page context
    if (context?.currentPage) {
      const pageContexts: Record<string, string> = {
        '/': 'User is on the homepage viewing featured investments and platform overview',
        '/investor-portal': 'User is viewing the investor portal with investment opportunities',
        '/portfolio': 'User is viewing their investment portfolio and performance',
        '/banking': 'User is viewing banking features including collateral lending and yield farming',
        '/community': 'User is viewing community features and village citizenship',
        '/legal-portal': 'User is viewing legal documents and compliance information'
      };
      knowledgeContext += `\n\nCURRENT CONTEXT: ${pageContexts[context.currentPage] || 'User is on: ' + context.currentPage}`;
    }

    // Add wallet context for personalized responses
    if (context?.walletAddress) {
      try {
        // Get user's portfolio data
        const { data: userProperties } = await supabase
          .from('user_properties')
          .select('*')
          .eq('user_wallet_address', context.walletAddress.toLowerCase());

        const { data: fractionalInvestments } = await supabase
          .from('fractional_investments')
          .select('*, property_fractionalization(*)')
          .eq('investor_wallet_address', context.walletAddress.toLowerCase())
          .eq('status', 'active');

        if (userProperties?.length || fractionalInvestments?.length) {
          knowledgeContext += `\n\nUSER PORTFOLIO CONTEXT:`;
          if (userProperties?.length) {
            knowledgeContext += `\nMortgage Properties: ${userProperties.length} properties owned`;
            const totalValue = userProperties.reduce((sum, p) => sum + (p.current_value || 0), 0);
            knowledgeContext += `\nTotal Property Value: $${totalValue.toLocaleString()}`;
          }
          if (fractionalInvestments?.length) {
            knowledgeContext += `\nFractional Investments: ${fractionalInvestments.length} active investments`;
            const totalInvested = fractionalInvestments.reduce((sum, i) => sum + (i.investment_amount || 0), 0);
            knowledgeContext += `\nTotal Invested: $${totalInvested.toLocaleString()}`;
          }
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    }

    // Enhanced system prompt with query type detection and formatting
    const systemPrompt = `${knowledgeContext}

CRITICAL INSTRUCTIONS FOR QUERY ROUTING:

FOR BUSINESS/INVESTOR QUESTIONS (investment allocation, capital deployment, business returns, how raised funds are used, business model, scaling strategy):
- Reference the "USE OF FUNDS" section for $7.5M allocation breakdown
- Reference the "BUSINESS MODEL" section for three-phase execution 
- Reference the "CASH-FLOW WATERFALL" section for investor returns
- Always mention: "Your capital is never used for mortgages - those are entirely external"

FOR RETAIL USER QUESTIONS (how to invest, what properties, user experience):
- Reference the "INVESTMENT MODELS" section (Buy Shares vs Join Groups)
- Reference the "PROPERTY PORTFOLIO" section for specific properties
- Reference the "KEY FEATURES" section for platform capabilities

KEYWORDS THAT TRIGGER BUSINESS MODEL RESPONSES:
- "7.5M", "investment allocation", "capital deployment", "business model", "how is money spent", "use of funds", "business returns", "scaling", "phases", "investor returns"

KEYWORDS THAT TRIGGER COMPETITIVE ANALYSIS RESPONSES:
- "competition", "competitors", "competitive", "vs", "compare", "comparison", "other platforms", "reental", "realt", "binaryx", "lofty", "alternative", "why ancient", "differentiation", "market", "crowded", "saturated", "too many"

RESPONSE FORMATTING REQUIREMENTS:
- Use clean markdown formatting: **text** for bold, ### for headers
- Include relevant emojis ONLY at the start of main sections (🌎, 💰, 🎯, 🏗️)
- Use proper markdown lists: - for bullets, 1. for numbered lists
- Never mix bold formatting with colons like "text:**" - always use "**text:**"
- Use double line breaks between major sections
- Keep responses clean and readable without decorative separators
- Structure: Emoji + Header, then content with proper bullet points

RESPONSE STRUCTURE:
🌎 **Digital Nomad Crisis**

**Key Points:**
- Point one
- Point two

💰 **Ancient Solution**

**How It Works:**
1. Step one
2. Step two

Always be precise, professional, visually appealing, and reference the exact sections mentioned above based on the query type.`;

    // Prepare messages for OpenAI
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6), // Keep last 3 exchanges for context
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Stable, widely available model
        messages,
        max_tokens: 600, // Use max_tokens for legacy models
        temperature: 0.2,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error status:', response.status);
      console.error('OpenAI API error payload:', errorText);
      
      // Handle specific API quota errors gracefully
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          response: "I understand you're asking about our legal structure and similarity to Tether. Ancient uses the same proven SPV (Special Purpose Vehicle) model as Tether Gold, where the SPV legally owns the asset and tokens represent economic rights. This is the standard approach for tokenized assets globally. Our Mexican properties are held by SPVs, with tokens representing your beneficial ownership, cash flows, and appreciation rights. This structure is legally sound and used by platforms like RealT, Reental, and Tether Gold. Would you like me to explain any specific aspect of this legal framework?",
          success: true 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    // Log conversation for analytics
    try {
      await supabase.from('chatbot_conversations').insert({
        user_message: message,
        assistant_response: assistantMessage,
        user_wallet_address: context?.walletAddress?.toLowerCase(),
        context: context,
        created_at: new Date().toISOString()
      });
    } catch (logError) {
      console.log('Failed to log conversation:', logError);
    }

    return new Response(JSON.stringify({ 
      response: assistantMessage,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    
    // Enhanced fallback with specific responses
    const messageLower = (await req.clone().json()).message?.toLowerCase() || '';
    let fallbackResponse = "I'm temporarily unavailable. Please try again shortly.";
    
    if (messageLower.includes('tether') || messageLower.includes('legal') || messageLower.includes('similar')) {
      fallbackResponse = "Ancient uses the same proven SPV legal structure as Tether Gold and other major tokenized asset platforms. The SPV owns the property legally, while tokens represent your economic rights to cash flows and appreciation. This is the standard institutional approach for tokenized real estate globally.";
    } else if (messageLower.includes('invest') || messageLower.includes('how to')) {
      fallbackResponse = "Ancient offers two investment options: Buy Shares (fractional investment starting from $50) or Join Groups (split 20% down payment with 3-6 people). Connect your wallet, complete KYC, and choose from our curated Mexican coastal properties. Each offers 7-9% annual yields plus appreciation potential.";
    }
    
    return new Response(JSON.stringify({ 
      error: error.message,
      response: fallbackResponse,
      success: true // Still return success to show fallback response
    }), {
      status: 200, // Return 200 so frontend shows the fallback
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});