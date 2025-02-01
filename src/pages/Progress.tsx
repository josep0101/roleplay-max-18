import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/Sidebar";
import { TrendingUp, Calendar, ChartBar } from "lucide-react";

const ProgressPage = () => {
  const stats = [
    {
      title: "Llamadas Completadas",
      value: "12",
      change: "+20%",
      icon: ChartBar,
    },
    {
      title: "Tiempo Total",
      value: "4.5h",
      change: "+5%",
      icon: Calendar,
    },
    {
      title: "Puntuación Media",
      value: "8.5",
      change: "+15%",
      icon: TrendingUp,
    },
  ];

  const skills = [
    { name: "Comunicación", progress: 75 },
    { name: "Negociación", progress: 60 },
    { name: "Resolución de Problemas", progress: 85 },
    { name: "Empatía", progress: 90 },
  ];

  return (
    <div className="flex h-screen bg-accent">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold mb-8">Tu Progreso</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title} className="bg-white/50 backdrop-blur-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <h3 className="text-2xl font-semibold mt-1">{stat.value}</h3>
                      <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                    </div>
                    <stat.icon className="h-8 w-8 text-primary opacity-75" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-white/50 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Habilidades</h2>
              <div className="space-y-6">
                {skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {skill.progress}%
                      </span>
                    </div>
                    <Progress value={skill.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;