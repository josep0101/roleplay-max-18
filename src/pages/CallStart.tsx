import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar } from "@/components/Sidebar";
import { Phone, Video, Settings, ArrowLeft, Mic, MicOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Agent {
  id: string;
  name: string;
  role: string;
  company: string;
  scenario: string;
  initials: string;
  elevenlabs_agent_id?: string;
}

const agents: Agent[] = [
  {
    id: "1",
    name: "Alex Dupont",
    role: "VP of Sales Operations",
    company: "CustomerCenter",
    scenario: "Alex está teniendo problemas con su proveedor actual de datos. Tu objetivo es entender sus necesidades y presentar una solución que se ajuste a sus requerimientos.",
    initials: "AD"
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "IT Director",
    company: "TechGrowth Inc",
    scenario: "Sarah busca modernizar la infraestructura de su empresa. Necesita una solución escalable y segura para manejar datos sensibles.",
    initials: "SC"
  },
  {
    id: "3",
    name: "Michael Ross",
    role: "Operations Manager",
    company: "LogisticsPro",
    scenario: "Michael necesita optimizar sus procesos de logística. Está interesado en soluciones que puedan integrar múltiples fuentes de datos.",
    initials: "MR"
  },
  {
    id: "4",
    name: "Laura García",
    role: "Customer Success Lead",
    company: "SaaS Solutions",
    scenario: "Laura está evaluando nuevas herramientas para su equipo de soporte. Busca mejorar los tiempos de respuesta y la satisfacción del cliente.",
    initials: "LG"
  },
  {
    id: "5",
    name: "José Martínez",
    role: "COO",
    company: "Snaps",
    scenario: "José busca una solución para optimizar los procesos internos de su empresa y mejorar la comunicación entre departamentos.",
    initials: "JM",
    elevenlabs_agent_id: "tT9mhGJdnZVWHGHHQMZ4"
  }
];

const CallStart = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState<'user' | 'agent' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Audio elements for call sounds
  const ringToneRef = useRef<HTMLAudioElement | null>(null);
  const hangupToneRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        toast({
          title: "Error de autenticación",
          description: "Por favor, inicia sesión para continuar",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }
      setIsAuthenticated(true);
    };

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAuthenticated(false);
        navigate("/auth");
      }
    });

    // Create audio elements
    ringToneRef.current = new Audio('/sounds/ringtone.mp3');
    hangupToneRef.current = new Audio('/sounds/hangup.mp3');
    
    return () => {
      subscription.unsubscribe();
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [navigate, toast]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    if (!selectedAgent?.elevenlabs_agent_id) {
      toast({
        title: "Error",
        description: "Este agente no está configurado para llamadas de voz.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast({
          title: "Error de autenticación",
          description: "Por favor, inicia sesión para realizar llamadas.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Get ElevenLabs API key from Supabase
      const { data: { secret: apiKey }, error } = await supabase.rpc('get_elevenlabs_key');
      
      if (error || !apiKey) {
        console.error('Error getting API key:', error);
        toast({
          title: "Error",
          description: "No se pudo obtener la clave de API necesaria.",
          variant: "destructive",
        });
        return;
      }

      // Play ringtone
      if (ringToneRef.current) {
        ringToneRef.current.loop = true;
        await ringToneRef.current.play().catch(console.error);
      }

      // Construct WebSocket URL with API key and agent ID
      const wsUrl = `wss://api.elevenlabs.io/v1/chat?xi-api-key=${apiKey}&agent_id=${selectedAgent.elevenlabs_agent_id}`;
      
      console.log('Connecting to WebSocket URL:', wsUrl);
      
      // Create WebSocket connection
      wsRef.current = new WebSocket(wsUrl);
      
      // Set up WebSocket event handlers
      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsCallActive(true);
        // Stop ringtone when connection is established
        if (ringToneRef.current) {
          ringToneRef.current.pause();
          ringToneRef.current.currentTime = 0;
        }
        // Start call duration timer
        durationIntervalRef.current = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
        
        toast({
          title: "Llamada iniciada",
          description: `Conectado con ${selectedAgent.name}`,
        });
      };

      wsRef.current.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          console.log("Received message:", response);
          
          // Update speaking state based on message type
          if (response.type === 'speech_started') {
            setIsSpeaking('agent');
          } else if (response.type === 'speech_ended') {
            setIsSpeaking('user');
          }
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast({
          title: "Error en la llamada",
          description: "Ha ocurrido un error en la conexión",
          variant: "destructive",
        });
        endCall();
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket closed");
        setIsCallActive(false);
        setIsSpeaking(null);
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }
        toast({
          title: "Llamada finalizada",
          description: "La conexión ha sido cerrada",
        });
      };
    } catch (error) {
      console.error("Error starting call:", error);
      toast({
        title: "Error",
        description: "No se pudo iniciar la llamada",
        variant: "destructive",
      });
    }
  };

  const endCall = () => {
    // Play hangup sound
    if (hangupToneRef.current) {
      hangupToneRef.current.play().catch(console.error);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    setIsCallActive(false);
    setIsSpeaking(null);
    setCallDuration(0);
    
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Implement microphone muting logic here
  };

  if (!isAuthenticated) {
    return null; // O un componente de carga
  }

  return (
    <div className="flex h-screen bg-accent">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              {selectedAgent && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    if (isCallActive) {
                      endCall();
                    }
                    setSelectedAgent(null);
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h1 className="text-2xl font-semibold">
                {selectedAgent ? 'Iniciar Llamada' : 'Seleccionar Cliente'}
              </h1>
            </div>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {selectedAgent ? (
            <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <Avatar className={`w-32 h-32 transition-all ${
                      isSpeaking === 'agent' ? 'ring-4 ring-blue-500' :
                      isSpeaking === 'user' ? 'ring-4 ring-green-500' : ''
                    }`}>
                      <AvatarFallback className="text-2xl">{selectedAgent.initials}</AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-2 right-2 w-4 h-4 ${
                      isCallActive ? 'bg-green-500' : 'bg-gray-400'
                    } rounded-full border-2 border-white`} />
                  </div>

                  <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-1">{selectedAgent.name}</h2>
                    <p className="text-muted-foreground">
                      {selectedAgent.role} @ {selectedAgent.company}
                    </p>
                    {isCallActive && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Duración: {formatDuration(callDuration)}
                      </p>
                    )}
                  </div>

                  <div className="bg-white/80 rounded-lg p-6 w-full max-w-2xl">
                    <h3 className="font-semibold mb-3">Instrucciones del Role-play</h3>
                    <p className="text-muted-foreground">
                      {selectedAgent.scenario}
                    </p>
                  </div>

                  <div className="flex gap-4 mt-4">
                    {isCallActive ? (
                      <>
                        <Button 
                          variant="destructive" 
                          className="gap-2" 
                          size="lg"
                          onClick={endCall}
                        >
                          <Phone className="h-4 w-4" />
                          Finalizar Llamada
                        </Button>
                        <Button
                          variant={isMuted ? "secondary" : "outline"}
                          className="gap-2"
                          size="lg"
                          onClick={toggleMute}
                        >
                          {isMuted ? (
                            <MicOff className="h-4 w-4" />
                          ) : (
                            <Mic className="h-4 w-4" />
                          )}
                          {isMuted ? "Activar Micrófono" : "Silenciar"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          className="gap-2" 
                          size="lg"
                          onClick={startCall}
                        >
                          <Phone className="h-4 w-4" />
                          Iniciar Llamada
                        </Button>
                        <Button 
                          variant="secondary" 
                          className="gap-2" 
                          size="lg"
                        >
                          <Video className="h-4 w-4" />
                          Iniciar Videollamada
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <Card 
                    key={agent.id}
                    className="bg-white/50 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback>{agent.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{agent.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {agent.role} @ {agent.company}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {agent.scenario}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </main>
    </div>
  );
};

export default CallStart;