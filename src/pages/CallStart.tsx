import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar } from "@/components/Sidebar";
import { Phone, Video, Settings, ArrowLeft, Mic, MicOff, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useConversation } from "@11labs/react";

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
  const [userProfile, setUserProfile] = useState<any>(null);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const [microphoneStream, setMicrophoneStream] = useState<MediaStream | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs WebSocket");
      setIsCallActive(true);
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs WebSocket");
      setIsCallActive(false);
      setIsSpeaking(null);
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
        setMicrophoneStream(null);
      }
    },
    onMessage: (message) => {
      console.log("Received message:", message);
      if (message.type === 'speech_started') {
        setIsSpeaking('agent');
      } else if (message.type === 'speech_ended') {
        setIsSpeaking('user');
      }
    },
    onError: (error) => {
      console.error("ElevenLabs WebSocket error:", error);
      toast({
        title: "Error en la llamada",
        description: "Ha ocurrido un error en la conexión",
        variant: "destructive",
      });
      endCall();
    }
  });

  useEffect(() => {
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
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      setUserProfile(profile);
    };

    checkAuth();

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (conversation) {
        conversation.endSession();
      }
      if (microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [navigate, toast]);

  const requestMicrophonePermission = async () => {
    try {
      console.log("Requesting microphone permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted");
      setHasMicrophonePermission(true);
      setMicrophoneStream(stream);
      return stream;
    } catch (error) {
      console.error("Error requesting microphone permission:", error);
      toast({
        title: "Error de micrófono",
        description: "No se pudo acceder al micrófono. Por favor, permite el acceso para continuar.",
        variant: "destructive",
      });
      return null;
    }
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

    // Request microphone permission if not already granted
    if (!hasMicrophonePermission) {
      const stream = await requestMicrophonePermission();
      if (!stream) return;
    }

    try {
      console.log("Getting signed WebSocket URL for agent:", selectedAgent.elevenlabs_agent_id);
      
      // Get signed WebSocket URL from our Edge Function
      const { data: urlData, error: urlError } = await supabase.functions.invoke('get_elevenlabs_url', {
        body: { agent_id: selectedAgent.elevenlabs_agent_id }
      });

      if (urlError || !urlData?.url) {
        console.error('Error getting signed URL:', urlError);
        toast({
          title: "Error",
          description: "No se pudo iniciar la llamada. Por favor, intenta de nuevo.",
          variant: "destructive",
        });
        return;
      }

      console.log('Starting conversation with URL:', urlData.url);
      
      // Initialize WebSocket connection
      await conversation.startSession({ url: urlData.url });
      toast({
        title: "Llamada iniciada",
        description: `Conectado con ${selectedAgent.name}`,
      });

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
    if (conversation) {
      conversation.endSession();
    }
    setIsCallActive(false);
    setIsSpeaking(null);
    setCallDuration(0);
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
    if (microphoneStream) {
      microphoneStream.getTracks().forEach(track => track.stop());
      setMicrophoneStream(null);
    }
  };

  const toggleMute = () => {
    if (microphoneStream) {
      microphoneStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated) {
    return null;
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
                {selectedAgent ? 'Llamada en Curso' : 'Seleccionar Cliente'}
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
                  {isCallActive ? (
                    <div className="flex items-center justify-center gap-16 w-full">
                      {/* User Avatar */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                          <Avatar className={`w-32 h-32 transition-all ${
                            isSpeaking === 'user' ? 'ring-4 ring-green-500' : ''
                          }`}>
                            {userProfile?.avatar_url ? (
                              <AvatarImage src={userProfile.avatar_url} />
                            ) : (
                              <AvatarFallback>
                                <User className="w-16 h-16 text-gray-400" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <p className="font-medium">Tú</p>
                      </div>

                      {/* Agent Avatar */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                          <Avatar className={`w-32 h-32 transition-all ${
                            isSpeaking === 'agent' ? 'ring-4 ring-blue-500' : ''
                          }`}>
                            <AvatarFallback className="text-2xl bg-blue-100">
                              {selectedAgent.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <p className="font-medium">{selectedAgent.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <Avatar className="w-32 h-32">
                        <AvatarFallback className="text-2xl">
                          {selectedAgent.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}

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
