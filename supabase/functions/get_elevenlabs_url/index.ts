import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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

    // Get ElevenLabs API key from secrets
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY')
    if (!apiKey) {
      console.error('ElevenLabs API key not configured')
      throw new Error('ElevenLabs API key not configured')
    }

    console.log('Requesting signed URL for agent:', agent_id)

    const response = await fetch(
      `https://api.elevenlabs.io/v1/conversation/get_signed_url?agent_id=${agent_id}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    )

    const responseText = await response.text()
    console.log('ElevenLabs API response:', responseText)

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${responseText}`)
    }

    const data = JSON.parse(responseText)
    console.log('Successfully generated signed URL for agent:', agent_id)
    
    return new Response(
      JSON.stringify({ url: data.signed_url }),
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