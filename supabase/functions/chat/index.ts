import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ELEVENLABS_WS_URL = "wss://api.elevenlabs.io/v2/chat"
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const { headers } = req
  const upgradeHeader = headers.get("upgrade") || ""

  if (upgradeHeader.toLowerCase() !== "websocket") {
    console.error("Expected WebSocket connection")
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders
    })
  }

  try {
    // Get the agent ID from the request URL
    const url = new URL(req.url)
    const agentId = url.searchParams.get('agentId')
    
    if (!agentId) {
      console.error("Missing agent ID")
      return new Response("Agent ID is required", { 
        status: 400,
        headers: corsHeaders
      })
    }

    // Get ElevenLabs API key from Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: { secret: apiKey }, error } = await supabaseClient.rpc('get_elevenlabs_key')
    
    if (error || !apiKey) {
      console.error('Error getting API key:', error)
      return new Response("Error getting API key", { 
        status: 500,
        headers: corsHeaders
      })
    }

    console.log("Upgrading connection to WebSocket")
    
    // Upgrade the connection to WebSocket
    const { socket: clientSocket, response } = Deno.upgradeWebSocket(req)
    
    // Connect to ElevenLabs WebSocket with API key
    const elevenlabsSocket = new WebSocket(`${ELEVENLABS_WS_URL}?xi-api-key=${apiKey}`)

    // Handle connection open
    elevenlabsSocket.onopen = () => {
      console.log("Connected to ElevenLabs WebSocket")
      // Send initial configuration
      elevenlabsSocket.send(JSON.stringify({
        text: "",
        model_id: agentId,
        debug: true
      }))
    }

    // Forward messages from client to ElevenLabs
    clientSocket.onmessage = (event) => {
      console.log("Received message from client:", event.data)
      elevenlabsSocket.send(event.data)
    }

    // Forward messages from ElevenLabs to client
    elevenlabsSocket.onmessage = (event) => {
      console.log("Received message from ElevenLabs:", event.data)
      clientSocket.send(event.data)
    }

    // Handle errors
    elevenlabsSocket.onerror = (error) => {
      console.error("ElevenLabs WebSocket error:", error)
      clientSocket.close(1011, "Error in ElevenLabs connection")
    }

    clientSocket.onerror = (error) => {
      console.error("Client WebSocket error:", error)
      elevenlabsSocket.close(1011, "Error in client connection")
    }

    // Handle connection close
    elevenlabsSocket.onclose = () => {
      console.log("ElevenLabs WebSocket closed")
      clientSocket.close()
    }

    clientSocket.onclose = () => {
      console.log("Client WebSocket closed")
      elevenlabsSocket.close()
    }

    return response
  } catch (error) {
    console.error("Error in WebSocket setup:", error)
    return new Response(`WebSocket setup failed: ${error.message}`, { 
      status: 500,
      headers: corsHeaders
    })
  }
})