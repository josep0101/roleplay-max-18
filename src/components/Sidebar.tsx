import { Home, Phone, Trophy, Settings, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Phone, label: "Llamadas", path: "/calls/start" },
    { icon: Trophy, label: "Progreso", path: "/progress" },
    { icon: Settings, label: "Ajustes", path: "/settings" },
  ];

  return (
    <div
      className={cn(
        "h-screen bg-white border-r transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <span className="logo-text">Verbaly</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={20} />
        </button>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-4 p-3 hover:bg-accent rounded-lg mb-2 text-gray-700 hover:text-primary transition-colors"
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};