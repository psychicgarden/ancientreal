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
      
      'investment': `Ancient offers two investment models for premium Mexican coastal properties:

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

• Art Deco Loft Mexico: $240K, 8.5% yield
• Bahia Beach Bungalow: $180K, 9.2% yield  
• Ericeira Oceanview: $320K, 7.8% yield

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

ARBITRAGE ECONOMICS & CORE VALUE PROPOSITION:
Our business model is built on a powerful arbitrage opportunity:
- Build Cost: ~$75K per property
- Sale Price: $150K per property  
- Market Comparables: Listed for significantly higher than $150K
- Developer Problem: Huge markups but struggle to find buyers who can pay 100% down
- Our Solution: Fractional ownership eliminates the 100% cash requirement barrier
- Result: Developers get their markup + find buyers, we prove platform demand

WHY WE BUILD FIRST (Instead of Just Platform):
1. Arbitrage Opportunity: Immediate 100% profit margins ($75K → $150K) in undervalued markets
2. Solve Core Market Problem: Developers have inventory but no 100% cash buyers - we create the buyers through fractional ownership
3. Proof of Concept: Successful builds demonstrate to developers that our platform solves their liquidity problem
4. Platform Adoption Strategy: Once developers see our success, they'll want to join the platform
5. Revenue Generation: Building first creates immediate cash flow to fund platform development
6. Quality Control: Ensures our first properties meet regenerative standards and build brand reputation

PLATFORM OVERVIEW:
- Blockchain-based real estate investment platform with two distinct models
- Built on Avalanche Fuji Testnet using USDT for transactions
- Features include: fractional property investment, mortgage groups, yield farming, secondary marketplace

USE OF FUNDS - $7.5M Seed A:
1. Land Acquisition - $1.5M (20%): Secure 4 prime development plots across Mazunte (Mexico), Bahia (Brazil), Ericeira (Portugal), and Greece
2. Construction Fund - $3.5M (47%): Core pool to finance first development cycle, recycled from each flip revenue
3. Platform & Technology - $1.0M (13%): Build Ancient digital platform, tokenization, DAO governance, marketplace
4. Legal & Compliance - $500K (7%): International structuring, Nevis ParentCo + SPVs, securities compliance
5. Team & Operations - $750K (10%): 2 years runway for founding team and local project managers
6. Marketing & Launch - $250K (3%): Launch campaign for Founding Pass NFTs, community building

INVESTOR RISK CLARITY: Your capital is never used for mortgages. Those are entirely external and off our balance sheet.

BUSINESS MODEL: Three Phases to $12B

PHASE 1 – Foundation & Proof of Concept (Years 1-6)
What we do:
• Build and sell 178 regenerative homes across 5 strategic lifestyle hubs (EQUITY-ONLY, NO DEBT)
• All mortgages are external capital (banks, institutional lenders, DeFi pools) - NOT from company raise
• Develop and refine the technology stack (fractional marketplace, tokenization rails, lender servicing)

Execution Table (canonical numbers):
Location | Year | Homes | Revenue | Profit | Mortgages
Mazunte, Mexico | 1–2 | 15 | $2.06M | $0.93M | 3
Bahia, Brazil | 2–3 | 21 | $3.04M | $1.47M | 5
Porto, Portugal | 3–4 | 31 | $4.87M | $2.54M | 8
Corfu, Greece | 4–5 | 48 | $8.45M | $4.85M | 12
Ericeira, Portugal | 5–6 | 63 | $12.60M | $7.88M | 20
Total | 6 yrs | 178 | $31.02M | $17.67M | 48

Returns to Investor (Phase 1):
• Profits generated: $17.67M
• Investor's 70% preferred share: $12.37M
• Return: 1.65x in 6 years (even if the company stops here, investor walks away positive)

PHASE 2 – Platform Launch & Scale (Years 3-7)
What we do:
• Transition from developer → platform
• Attract external developers to list their projects  
• Scale mortgage operations with institutional capital
• Enable fractional ownership from $1,000 for retail buyers globally

Key Milestones:
• Attract 50+ builders into the developer marketplace
• Grow mortgage pool to 700+ loans funded by a $50M institutional facility
• Open platform to 12 countries across LatAm and Europe
• Monetize via: Platform fees (~3%), Servicing fees (0.5–1%), Capital gains capture (ARWs: 40% to Ancient, 10% lenders, 50% buyers)

Growth Metrics:
Year | Users | Properties | Annual Revenue | Company Valuation
3 | 15,000 | 200 | $15M | $240M
5 | 150,000 | 1,500 | $127M | $1.65B
7 | 500,000 | 5,000 | $350M | $5.25B

PHASE 3 – Global Domination (Years 7-10+)
What we do:
• Become the Shopify × Airbnb × Robinhood of regenerative real estate
• Expand across 25 countries with network-effect scale

At scale:
• 2M+ global users
• 15,000 new properties listed annually
• Annual revenue: $914.5M (diversified across developer fees, servicing, ARWs, marketplace)

CASH-FLOW WATERFALL & INVESTOR DISTRIBUTIONS

Phase 1 – Development Flips (178 Homes)
Sources of Cash Flow:
• Build/sell spread from homes = $17.67M profit
• Very light mortgage pool = 48 loans, not material to cash flow

Distribution Waterfall:
1. Investor 70% Preferred Share of Profits: $17.67M × 70% = $12.37M paid to investors over 6 years
2. GP/Company 30% Share: $17.67M × 30% = $5.30M retained by company

Investor Profile:
• Multiple = 1.65x in 6 years, even if company stopped here
• Risk = low → mortgage exposure capped at $2M pool

Phase 2 – Platform Scale (Marketplace + Mortgages)
Sources of Cash Flow:
• Developer fees (≈3% of property value)
• Mortgage servicing spread (0.75%)
• ARW capture (Ancient takes 40%)
• Marketplace fractional transaction fees (0.5–1%)

Distribution Waterfall:
1. Investors continue to receive 70% of Profits until end of Phase 2
2. Company retains 30%, fueling reinvestment into tech, global expansion, and working capital

Phase 3 – Global Network-State (2M Users)
Sources of Cash Flow:
• Global developer listings (~15,000/year)
• Servicing on $5B+ mortgages
• ARWs captured at scale (50% buyer / 40% Ancient / 10% lenders)
• Platform network fees

Distribution Waterfall:
1. Investor Preferred Ends → Convert to Equity Stake
2. At IPO/strategic exit, investors receive equity appreciation from their original ParentCo shares
3. By this stage, they've already received $12.37M cash distributions from Phase 1 + 70% share from Phase 2 profits

MARKET TRENDS & TAILWINDS:
• Tokenization of real assets: Expected to exceed $16T by 2030 (BCG, Citigroup)
• Global mortgage gap: $400B+ unmet demand in emerging markets (World Bank)
• Digital nomad surge: 40M+ nomads by 2030; high concentration in coastal lifestyle hubs
• Sustainable real estate premium: Regenerative builds already selling 10–25% above market in EU/LatAm
• Platform winners: History shows category leaders (Airbnb, Shopify) capture 30–50% of sector value

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

PROPERTY PORTFOLIO:
- Art Deco Loft in Mexico: $240,000, 8.5% annual yield, luxury beachfront property
- Bahia Beach Bungalow: $180,000, 9.2% annual yield, eco-smart sustainable living
- Ericeira Oceanview Apartment: $320,000, 7.8% annual yield, Portuguese coastal property

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

Answer user questions about the platform, investment process, calculations, and features. When asked about legal structure, compliance, or "how is this legal?", reference the detailed legal tokenization framework above. Be helpful, accurate, and professional.`;

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

RESPONSE FORMATTING REQUIREMENTS:
- Use **bold** for main headers and key points
- Include relevant emojis for visual appeal (🏛️, 💰, 🎯, 🏗️, ⚖️, 👥, 📈, ⸻)
- Create clear visual hierarchy with markdown
- Use bullet points with emojis for lists
- Add visual separators with ⸻ between major sections
- Structure responses with clear sections and spacing
- For business model responses, use format: "🏛️ **ANCIENT [TOPIC]**" as main header

EXAMPLE BUSINESS MODEL RESPONSE FORMAT:
🏛️ **ANCIENT CAPITAL DEPLOYMENT & RETURNS**

⸻

**💰 How Your $7.5M Investment Works:**

🎯 **Land Acquisition** — $1.5M (20%)
• Secure 4 prime plots across strategic hubs
• Mexico → Brazil → Portugal → Greece

🏗️ **Construction Fund** — $3.5M (47%)
• Self-sustaining flywheel: each flip funds the next
• Zero debt exposure, pure equity plays

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