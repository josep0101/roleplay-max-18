import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Phone, Play, BarChart2 } from "lucide-react";

const Index = () => {
  return (
    <div className="flex h-screen bg-accent">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Bienvenido a tu entrenamiento
            </h1>
            <p className="text-lg text-gray-600">
              Practica tus habilidades de ventas y atención al cliente con nuestros agentes AI
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Llamadas Realizadas</h3>
                <Phone className="text-primary" size={24} />
              </div>
              <p className="text-3xl font-bold">24</p>
              <p className="text-sm text-gray-500">Esta semana</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Tiempo de Práctica</h3>
                <Play className="text-secondary" size={24} />
              </div>
              <p className="text-3xl font-bold">3.5h</p>
              <p className="text-sm text-gray-500">Esta semana</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Puntuación Media</h3>
                <BarChart2 className="text-primary" size={24} />
              </div>
              <p className="text-3xl font-bold">8.5</p>
              <p className="text-sm text-gray-500">Últimas 10 llamadas</p>
            </div>
          </div>

          <section className="bg-white p-8 rounded-xl shadow-sm mb-8">
            <h2 className="text-2xl font-bold mb-6">Comenzar Nueva Práctica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button className="h-auto py-6 flex flex-col items-center gap-2">
                <Phone size={24} />
                <span>Venta Producto Nuevo</span>
              </Button>
              <Button variant="secondary" className="h-auto py-6 flex flex-col items-center gap-2">
                <Phone size={24} />
                <span>Atención al Cliente</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2">
                <Phone size={24} />
                <span>Resolución Conflictos</span>
              </Button>
            </div>
          </section>

          <section className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Últimas Llamadas</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((call) => (
                <div key={call} className="flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors">
                  <div>
                    <h4 className="font-semibold">Llamada de Ventas #{call}</h4>
                    <p className="text-sm text-gray-500">Hace {call} hora{call > 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-secondary font-semibold">8.{call}/10</span>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;