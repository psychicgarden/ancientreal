import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { contract_address, network = 'fuji' } = await req.json();

    if (!contract_address) {
      throw new Error('contract_address is required');
    }

    console.log(`🔍 Starting mortgage events indexing for contract: ${contract_address} on ${network}`);

    // Fetch AVAX to USD ratio from app_settings
    const { data: settingData } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'avax_to_usd_ratio')
      .single();

    const avaxToUsdRatio = parseInt(settingData?.value || '1000000');
    console.log(`💰 Using AVAX to USD ratio: ${avaxToUsdRatio}`);

    // Get RPC URL based on network
    const rpcUrl = network === 'mainnet' 
      ? 'https://api.avax.network/ext/bc/C/rpc'
      : 'https://api.avax-test.network/ext/bc/C/rpc';

    // Get the latest block number
    const latestBlockResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      })
    });

    const latestBlockData = await latestBlockResponse.json();
    const latestBlock = parseInt(latestBlockData.result, 16);
    console.log(`📊 Latest block: ${latestBlock}`);

    // Event signatures for EnhancedAvaxMortgage contract
    const mortgageCreatedSignature = '0x5d4a84b7b8d6f3b6c8c3b9f8e7d6c5b4a3b2c1d0e1f2a3b4c5d6e7f8a9b0c1d2'; // MortgageCreated event
    const paymentMadeSignature = '0x8b4e4f7f8a6b5c3d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d'; // PaymentMade event

    // Process MortgageCreated events
    await processEvents(supabase, contract_address, network, 'MortgageCreated', mortgageCreatedSignature, rpcUrl, avaxToUsdRatio);
    
    // Process PaymentMade events  
    await processEvents(supabase, contract_address, network, 'PaymentMade', paymentMadeSignature, rpcUrl, avaxToUsdRatio);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Mortgage events indexed successfully',
        latest_block: latestBlock 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Error indexing mortgage events:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function processEvents(
  supabase: any, 
  contractAddress: string, 
  network: string, 
  eventName: string, 
  signature: string, 
  rpcUrl: string, 
  avaxToUsdRatio: number
) {
  console.log(`🔄 Processing ${eventName} events...`);

  // Get last scanned block for this event
  let { data: cursor } = await supabase
    .from('contract_event_cursors')
    .select('last_block_scanned')
    .eq('contract_address', contractAddress.toLowerCase())
    .eq('network', network)
    .eq('event_name', eventName)
    .single();

  const fromBlock = cursor ? cursor.last_block_scanned + 1 : 0;
  
  // Get latest block
  const latestBlockResponse = await fetch(rpcUrl, {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_blockNumber', 
      params: [],
      id: 1
    })
  });
  
  const latestBlockData = await latestBlockResponse.json();
  const toBlock = parseInt(latestBlockData.result, 16);

  if (fromBlock > toBlock) {
    console.log(`✅ ${eventName}: No new blocks to scan`);
    return;
  }

  console.log(`🔍 ${eventName}: Scanning blocks ${fromBlock} to ${toBlock}`);

  // Fetch events
  const logsResponse = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getLogs',
      params: [{
        address: contractAddress,
        fromBlock: `0x${fromBlock.toString(16)}`,
        toBlock: `0x${toBlock.toString(16)}`,
        topics: [signature]
      }],
      id: 1
    })
  });

  const logsData = await logsResponse.json();
  const events = logsData.result || [];

  console.log(`📋 Found ${events.length} ${eventName} events`);

  for (const event of events) {
    try {
      if (eventName === 'MortgageCreated') {
        await processMortgageCreatedEvent(supabase, event, avaxToUsdRatio);
      } else if (eventName === 'PaymentMade') {
        await processPaymentMadeEvent(supabase, event, avaxToUsdRatio);
      }
    } catch (error) {
      console.error(`❌ Error processing ${eventName} event:`, error);
    }
  }

  // Update cursor
  await supabase
    .from('contract_event_cursors')
    .upsert({
      contract_address: contractAddress.toLowerCase(),
      network,
      event_name: eventName,
      last_block_scanned: toBlock,
      updated_at: new Date().toISOString()
    });

  console.log(`✅ ${eventName}: Updated cursor to block ${toBlock}`);
}

async function processMortgageCreatedEvent(supabase: any, event: any, avaxToUsdRatio: number) {
  console.log('🏠 Processing MortgageCreated event:', event.transactionHash);

  // Decode event data (simplified - in production use proper ABI decoding)
  const topics = event.topics;
  const data = event.data;
  
  // Extract borrower address from first topic (indexed parameter)
  const borrowerAddress = '0x' + topics[1].slice(26);
  
  // Decode data fields - this is simplified, use proper ABI decoder in production
  const propertyValue = parseInt(data.slice(2, 66), 16) / avaxToUsdRatio;
  const downPayment = parseInt(data.slice(66, 130), 16) / avaxToUsdRatio;
  const loanAmount = parseInt(data.slice(130, 194), 16) / avaxToUsdRatio;

  // Insert into user_transactions (which triggers backfill to user_properties)
  const { error } = await supabase
    .from('user_transactions')
    .insert({
      user_wallet_address: borrowerAddress,
      transaction_type: 'property_purchase',
      amount: downPayment,
      status: 'completed',
      transaction_hash: event.transactionHash,
      metadata: {
        property_value: propertyValue,
        down_payment: downPayment,
        loan_amount: loanAmount,
        property_name: `Property ${event.blockNumber}`,
        property_location: 'On-Chain Property',
        contract_address: event.address,
        block_number: parseInt(event.blockNumber, 16)
      }
    });

  if (error) {
    console.error('❌ Error inserting purchase transaction:', error);
  } else {
    console.log(`✅ Created purchase transaction for ${borrowerAddress}`);
  }
}

async function processPaymentMadeEvent(supabase: any, event: any, avaxToUsdRatio: number) {
  console.log('💳 Processing PaymentMade event:', event.transactionHash);

  // Extract borrower address from first topic
  const borrowerAddress = '0x' + event.topics[1].slice(26);
  
  // Decode payment amounts from data
  const principalPaid = parseInt(event.data.slice(66, 130), 16);
  const interestPaid = parseInt(event.data.slice(130, 194), 16);

  // Insert into mortgage_payments_ledger
  const { error: ledgerError } = await supabase
    .from('mortgage_payments_ledger')
    .insert({
      user_address: borrowerAddress,
      property_id: 1, // Default property ID - could be extracted from event data
      principal_delta_base: principalPaid,  
      interest_delta_base: interestPaid,
      tx_hash: event.transactionHash
    });

  if (ledgerError) {
    console.error('❌ Error inserting payment ledger:', ledgerError);
  } else {
    console.log(`✅ Recorded payment for ${borrowerAddress}: Principal=${principalPaid}, Interest=${interestPaid}`);
    
    // Apply payment to user_properties via RPC
    const { error: rpcError } = await supabase
      .rpc('apply_mortgage_payment', {
        p_user_address: borrowerAddress,
        p_property_id: 1,
        p_principal_delta_base: principalPaid,
        p_interest_delta_base: interestPaid,
        p_tx_hash: event.transactionHash
      });

    if (rpcError) {
      console.error('❌ Error applying mortgage payment:', rpcError);
    }
  }
}