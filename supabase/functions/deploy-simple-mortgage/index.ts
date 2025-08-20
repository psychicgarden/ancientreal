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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🚀 Starting SimpleMortgage deployment process...');

    // Prepare deployment command
    const deployCommand = [
      'npx', 'hardhat', 'run', 'scripts/deploy-simple-mortgage.js', '--network', 'fuji'
    ];

    console.log('📋 Running command:', deployCommand.join(' '));

    // Execute deployment
    const process = new Deno.Command(deployCommand[0], {
      args: deployCommand.slice(1),
      stdout: 'piped',
      stderr: 'piped',
    });

    const { code, stdout, stderr } = await process.output();
    const output = new TextDecoder().decode(stdout);
    const errorOutput = new TextDecoder().decode(stderr);

    console.log('📄 Deployment output:', output);
    if (errorOutput) {
      console.log('⚠️ Deployment stderr:', errorOutput);
    }

    if (code !== 0) {
      throw new Error(`Deployment failed with code ${code}: ${errorOutput}`);
    }

    // Parse the contract address from output
    const addressMatch = output.match(/SimpleMortgage deployed to: (0x[a-fA-F0-9]{40})/);
    if (!addressMatch) {
      throw new Error('Could not parse contract address from deployment output');
    }

    const contractAddress = addressMatch[1];
    console.log(`✅ Parsed contract address: ${contractAddress}`);

    // Update the database with the actual contract address
    const { error: updateError } = await supabase
      .from('contract_addresses')
      .update({
        address: contractAddress,
        deployment_status: 'deployed',
        deployment_tx_hash: 'pending_verification',
        updated_at: new Date().toISOString()
      })
      .eq('contract_name', 'SIMPLE_MORTGAGE')
      .eq('network', 'fuji');

    if (updateError) {
      console.error('❌ Database update failed:', updateError);
      throw updateError;
    }

    console.log('✅ Database updated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        contractAddress,
        network: 'fuji',
        snowtraceUrl: `https://testnet.snowtrace.io/address/${contractAddress}`,
        deploymentOutput: output,
        message: 'SimpleMortgage contract deployed successfully'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
})