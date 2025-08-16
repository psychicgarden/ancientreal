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

    // Build knowledge base context
    let knowledgeContext = `You are an AI assistant for the Mazunte Real Estate Investment Platform. 

PLATFORM OVERVIEW:
- Blockchain-based fractional real estate investment platform
- Users can purchase fractional ownership in premium properties with 20% down payment
- Smart contracts handle mortgages, rental income distribution, and secondary trading
- Built on Avalanche Fuji Testnet using USDT for transactions
- Features include: property investment, mortgage management, yield farming, secondary marketplace

KEY FEATURES:
1. FRACTIONAL INVESTMENT: Users buy shares of properties with 20% down payment, remaining 80% is financed
2. SMART MORTGAGES: Automated mortgage payments through smart contracts
3. RENTAL YIELDS: Monthly rental income distributed to fractional owners based on ownership percentage
4. SECONDARY TRADING: P2P marketplace for trading property shares
5. COLLATERAL LENDING: Borrow against property equity
6. KYC VERIFICATION: Required for compliance and access to features

PROPERTY PORTFOLIO:
- Art Deco Loft in Mexico: $240,000, 8.5% annual yield, luxury beachfront property
- Bahia Beach Bungalow: $180,000, 9.2% annual yield, eco-smart sustainable living
- Ericeira Oceanview Apartment: $320,000, 7.8% annual yield, Portuguese coastal property

FINANCIAL MODEL:
- Down payment: 20% of property value
- Mortgage terms: 10 years at 8% APR
- Platform fee: 3% of property value
- Monthly rental distribution after expenses (20%) and management fees (8%)
- Appreciation sharing: 50% buyer, 40% Ancient Holdings, 10% lenders

SECURITY & COMPLIANCE:
- Multi-signature wallet controls
- KYC verification required
- Accredited investor checks for certain features
- Insurance coverage through partnerships
- Legal structure via Ancient Holdings Ltd (Nevis)

Answer user questions about the platform, investment process, calculations, and features. Be helpful, accurate, and professional.`;

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

    // Prepare messages for OpenAI
    const messages: ChatMessage[] = [
      { role: 'system', content: knowledgeContext },
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
        model: 'gpt-4.1-2025-04-14',
        messages,
        max_completion_tokens: 800,
        stream: false
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
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
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});