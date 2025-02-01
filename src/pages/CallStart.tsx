import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Phone, Video, Settings } from "lucide-react";

const CallStart = () => {
  return (
    <div className="flex h-screen bg-accent">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold">Iniciar Llamada</h1>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src="/lovable-uploads/6b9e6a0f-9541-46f4-be51-4f52890a5c93.png" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-1">Alex Dupont</h2>
                  <p className="text-muted-foreground">VP of Sales Operations @ CustomerCenter</p>
                </div>

                <div className="bg-white/80 rounded-lg p-6 w-full max-w-2xl">
                  <h3 className="font-semibold mb-3">Instrucciones del Role-play</h3>
                  <p className="text-muted-foreground">
                    Alex está teniendo problemas con su proveedor actual de datos. Tu objetivo es entender sus necesidades y presentar una solución que se ajuste a sus requerimientos.
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
        </div>
      </main>
    </div>
  );
};

export default CallStart;