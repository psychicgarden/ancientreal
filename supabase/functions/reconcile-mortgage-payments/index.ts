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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { wallet_address, contract_address, from_block } = await req.json()

    if (!wallet_address || !contract_address) {
      throw new Error('wallet_address and contract_address are required')
    }

    console.log('🔄 Starting reconciliation for wallet:', wallet_address)

    // Use Avalanche Fuji testnet RPC
    const rpcUrl = 'https://api.avax-test.network/ext/bc/C/rpc'
    
    // Get current block number
    const latestBlockResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      })
    })
    
    const latestBlockResult = await latestBlockResponse.json()
    const currentBlock = parseInt(latestBlockResult.result, 16)
    const fromBlockNumber = from_block || (currentBlock - 1000) // Last ~1000 blocks
    
    console.log('📊 Scanning from block:', fromBlockNumber, 'to:', currentBlock)

    // PaymentMade event signature: PaymentMade(address indexed borrower, uint256 indexed propertyId, uint256 paymentAmount, uint256 principalPaid, uint256 interestPaid, uint256 remainingBalance)
    // Calculated using: ethers.id("PaymentMade(address,uint256,uint256,uint256,uint256,uint256)")
    const paymentMadeSignature = '0x8e0796c3c2b107b916806a5bd0b4f447ecc7db6c2b37f4c6e2b9e2f1f8e7b1c3'

    // Get logs for PaymentMade events
    const logsResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getLogs',
        params: [{
          fromBlock: `0x${fromBlockNumber.toString(16)}`,
          toBlock: `0x${currentBlock.toString(16)}`,
          address: contract_address,
          topics: [
            paymentMadeSignature,
            `0x000000000000000000000000${wallet_address.slice(2).toLowerCase()}` // Pad wallet address to 32 bytes
          ]
        }],
        id: 2
      })
    })

    const logsResult = await logsResponse.json()
    const logs = logsResult.result || []
    
    console.log('📋 Found', logs.length, 'PaymentMade events for wallet')

    let paymentsSynced = 0

    for (const log of logs) {
      try {
        // Decode the log data
        // Topics: [signature, borrower, propertyId]
        // Data: [paymentAmount, principalPaid, interestPaid, remainingBalance]
        
        const propertyId = parseInt(log.topics[2], 16)
        
        // Parse data (each value is 32 bytes / 64 hex chars)
        const data = log.data.slice(2) // Remove 0x
        const paymentAmount = BigInt('0x' + data.slice(0, 64))
        const principalPaid = BigInt('0x' + data.slice(64, 128))
        const interestPaid = BigInt('0x' + data.slice(128, 192))
        const remainingBalance = BigInt('0x' + data.slice(192, 256))

        // Convert from wei to USD (using 100M:1 ratio for test environment)
        const AVAX_TO_USD_RATIO = 100000000
        const principalPaidUSD = Number(principalPaid) / 1e18 * AVAX_TO_USD_RATIO
        const interestPaidUSD = Number(interestPaid) / 1e18 * AVAX_TO_USD_RATIO
        
        console.log('💰 Processing payment:', {
          txHash: log.transactionHash,
          propertyId,
          principalPaidUSD: principalPaidUSD.toFixed(2),
          interestPaidUSD: interestPaidUSD.toFixed(2)
        })

        // Check if payment already exists in ledger
        const { data: existingPayment } = await supabaseClient
          .from('mortgage_payments_ledger')
          .select('id')
          .eq('tx_hash', log.transactionHash)
          .single()

        if (existingPayment) {
          console.log('⏭️ Payment already exists, skipping:', log.transactionHash)
          continue
        }

        // Insert into mortgage_payments_ledger
        const { error: ledgerError } = await supabaseClient
          .from('mortgage_payments_ledger')
          .insert({
            user_address: wallet_address.toLowerCase(),
            property_id: propertyId,
            principal_delta_base: BigInt(Math.round(principalPaidUSD * 1000000)),
            interest_delta_base: BigInt(Math.round(interestPaidUSD * 1000000)),
            tx_hash: log.transactionHash
          })

        if (ledgerError) {
          console.error('❌ Ledger insert error:', ledgerError)
          continue
        }

        // Apply payment to user properties
        const { error: rpcError } = await supabaseClient.rpc('apply_mortgage_payment', {
          p_user_address: wallet_address.toLowerCase(),
          p_property_id: propertyId,
          p_principal_delta_base: BigInt(Math.round(principalPaidUSD * 1000000)),
          p_interest_delta_base: BigInt(Math.round(interestPaidUSD * 1000000)),
          p_tx_hash: log.transactionHash
        })

        if (rpcError) {
          console.error('❌ RPC error:', rpcError)
          continue
        }

        paymentsSynced++
        console.log('✅ Payment synced:', log.transactionHash)
        
      } catch (error) {
        console.error('❌ Error processing log:', error, log)
        continue
      }
    }

    console.log('🎉 Reconciliation complete. Synced', paymentsSynced, 'payments')

    return new Response(
      JSON.stringify({ 
        success: true, 
        payments_synced: paymentsSynced,
        blocks_scanned: currentBlock - fromBlockNumber,
        from_block: fromBlockNumber,
        to_block: currentBlock
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Reconciliation error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})