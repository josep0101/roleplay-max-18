import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { agent_id } = await req.json()
    
    if (!agent_id) {
      console.error('Missing agent_id in request')
      throw new Error('Agent ID is required')
    }

    console.log('Processing request for agent:', agent_id)

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    )

    // Get ElevenLabs API key
    const { data: { secret: apiKey }, error: secretError } = await supabaseClient.rpc('get_elevenlabs_key')
    
    if (secretError || !apiKey) {
      console.error('Error getting ElevenLabs API key:', secretError)
      throw new Error('Could not retrieve ElevenLabs API key')
    }

    console.log('Successfully retrieved API key')
    console.log('Requesting signed URL for agent:', agent_id)

    // Get the signed URL using the correct endpoint
    const response = await fetch(
      `https://api.elevenlabs.io/v2/conversation/start?agent_id=${agent_id}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs API error response:', errorText)
      throw new Error(`ElevenLabs API error: ${errorText}`)
    }

    const responseData = await response.json()
    
    if (!responseData.connection_url) {
      console.error('Unexpected response format:', responseData)
      throw new Error('Invalid response format from ElevenLabs API')
    }

    console.log('Successfully generated signed URL for agent:', agent_id)
    
    return new Response(
      JSON.stringify({ url: responseData.connection_url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in get_elevenlabs_url:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})