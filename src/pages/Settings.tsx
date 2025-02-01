import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings2, Volume, User } from "lucide-react";

const SettingsPage = () => {
  const settingsGroups = [
    {
      title: "Cuenta",
      icon: User,
      settings: [
        {
          name: "Recibir notificaciones por email",
          description: "Te mantendremos informado sobre tu progreso",
          enabled: true,
        },
        {
          name: "Perfil público",
          description: "Permite que otros vean tu perfil y progreso",
          enabled: false,
        },
      ],
    },
    {
      title: "Audio",
      icon: Volume,
      settings: [
        {
          name: "Sonidos de notificación",
          description: "Reproduce sonidos al recibir notificaciones",
          enabled: true,
        },
        {
          name: "Audio HD",
          description: "Utiliza audio de alta calidad en las llamadas",
          enabled: true,
        },
      ],
    },
    {
      title: "Preferencias",
      icon: Settings2,
      settings: [
        {
          name: "Modo oscuro",
          description: "Cambia la apariencia de la aplicación",
          enabled: false,
        },
        {
          name: "Autoplay de videos",
          description: "Reproduce videos automáticamente",
          enabled: true,
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-accent">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-8">Ajustes</h1>

          <div className="space-y-6">
            {settingsGroups.map((group) => (
              <Card key={group.title} className="bg-white/50 backdrop-blur-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <group.icon className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">{group.title}</h2>
                  </div>
                  <div className="space-y-6">
                    {group.settings.map((setting) => (
                      <div
                        key={setting.name}
                        className="flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <Label htmlFor={setting.name}>{setting.name}</Label>
                          <p className="text-sm text-muted-foreground">
                            {setting.description}
                          </p>
                        </div>
                        <Switch
                          id={setting.name}
                          defaultChecked={setting.enabled}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;