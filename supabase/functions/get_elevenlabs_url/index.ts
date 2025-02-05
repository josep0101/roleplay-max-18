import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

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

    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    )

    // Get ElevenLabs API key using the secrets function
    const { data, error: secretError } = await supabaseClient.rpc('secrets', {
      secret_name: 'ELEVENLABS_API_KEY'
    })
    
    if (secretError || !data?.[0]?.secret) {
      console.error('Error getting ElevenLabs API key:', secretError)
      throw new Error('Could not retrieve ElevenLabs API key')
    }

    console.log('Requesting signed URL for agent:', agent_id)

    // Using the correct API endpoint for signed URL generation
    const response = await fetch(
      `https://api.elevenlabs.io/v2/conversation/start?agent_id=${agent_id}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": data[0].secret,
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