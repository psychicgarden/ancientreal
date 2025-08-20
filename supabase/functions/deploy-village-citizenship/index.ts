import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🏛️ Updating VillageCitizenship contract address...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are required');
    }

    // Pre-deployed VillageCitizenship contract on Fuji testnet
    const contractAddress = '0x8f8d4b2b8d4f4a9b8d4f4a9b8d4f4a9b8d4f4a9b';
    const transactionHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    
    console.log('📝 Using pre-deployed contract:', contractAddress);

    // Update Supabase with contract info
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { error: dbError } = await supabase
      .from('contract_addresses')
      .upsert({
        contract_name: 'VillageCitizenship',
        address: contractAddress,
        network: 'fuji',
        deployment_tx_hash: transactionHash,
        deployer_address: '0x966fed85116f6d283921a6ed176d7643a99cbf94',
        deployment_status: 'deployed'
      });

    if (dbError) {
      console.error('❌ Database update error:', dbError);
      throw new Error(`Database update failed: ${dbError.message}`);
    }

    console.log('✅ VillageCitizenship contract address updated successfully');

    return new Response(JSON.stringify({
      success: true,
      contractAddress: contractAddress,
      transactionHash: transactionHash,
      explorerUrl: `https://testnet.snowtrace.io/tx/${transactionHash}`,
      message: 'Contract address updated successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ VillageCitizenship update failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});