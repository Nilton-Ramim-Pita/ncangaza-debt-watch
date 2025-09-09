import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileText, 
  Settings, 
  TrendingUp,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Visão geral"
  },
  {
    id: "clients",
    label: "Clientes",
    icon: Users,
    description: "Gestão de clientes"
  },
  {
    id: "debts",
    label: "Dívidas",
    icon: CreditCard,
    description: "Gestão de dívidas"
  },
  {
    id: "reports",
    label: "Relatórios",
    icon: FileText,
    description: "Análises e relatórios"
  },
  {
    id: "notifications",
    label: "Notificações",
    icon: Calendar,
    description: "Alertas automáticos"
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: TrendingUp,
    description: "Métricas avançadas"
  }
];

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <div className="w-64 bg-card border-r h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">N</span>
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Ncangaza</h2>
            <p className="text-sm text-muted-foreground">Multiservices</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-12 text-left",
                isActive && "bg-primary text-primary-foreground shadow-md"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="mr-3 h-5 w-5" />
              <div className="flex flex-col items-start">
                <span className="font-medium">{item.label}</span>
                <span className={cn(
                  "text-xs",
                  isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {item.description}
                </span>
              </div>
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Configurações
        </Button>
      </div>
    </div>
  );
};