import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar } from "@/components/Sidebar";
import { Phone, Video, Settings, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface Agent {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  scenario: string;
  initials: string;
}

const agents: Agent[] = [
  {
    id: "1",
    name: "Alex Dupont",
    role: "VP of Sales Operations",
    company: "CustomerCenter",
    avatar: "/lovable-uploads/6b9e6a0f-9541-46f4-be51-4f52890a5c93.png",
    scenario: "Alex está teniendo problemas con su proveedor actual de datos. Tu objetivo es entender sus necesidades y presentar una solución que se ajuste a sus requerimientos.",
    initials: "AD"
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "IT Director",
    company: "TechGrowth Inc",
    avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    scenario: "Sarah busca modernizar la infraestructura de su empresa. Necesita una solución escalable y segura para manejar datos sensibles.",
    initials: "SC"
  },
  {
    id: "3",
    name: "Michael Ross",
    role: "Operations Manager",
    company: "LogisticsPro",
    avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    scenario: "Michael necesita optimizar sus procesos de logística. Está interesado en soluciones que puedan integrar múltiples fuentes de datos.",
    initials: "MR"
  },
  {
    id: "4",
    name: "Laura García",
    role: "Customer Success Lead",
    company: "SaaS Solutions",
    avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    scenario: "Laura está evaluando nuevas herramientas para su equipo de soporte. Busca mejorar los tiempos de respuesta y la satisfacción del cliente.",
    initials: "LG"
  }
];

const CallStart = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

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
                  onClick={() => setSelectedAgent(null)}
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
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={selectedAgent.avatar} />
                      <AvatarFallback>{selectedAgent.initials}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  </div>

                  <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-1">{selectedAgent.name}</h2>
                    <p className="text-muted-foreground">
                      {selectedAgent.role} @ {selectedAgent.company}
                    </p>
                  </div>

                  <div className="bg-white/80 rounded-lg p-6 w-full max-w-2xl">
                    <h3 className="font-semibold mb-3">Instrucciones del Role-play</h3>
                    <p className="text-muted-foreground">
                      {selectedAgent.scenario}
                    </p>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <Button className="gap-2" size="lg">
                      <Phone className="h-4 w-4" />
                      Iniciar Llamada
                    </Button>
                    <Button variant="secondary" className="gap-2" size="lg">
                      <Video className="h-4 w-4" />
                      Iniciar Videollamada
                    </Button>
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
                          <AvatarImage src={agent.avatar} />
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