import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Dashboard } from "../dashboard/Dashboard";
import { ClientsTable } from "../clients/ClientsTable";
import { DebtsTable } from "../debts/DebtsTable";
import { ReportsReal } from "../reports/ReportsReal";
import { NotificationsReal } from "../notifications/NotificationsReal";
import { AnalyticsReal } from "../analytics/AnalyticsReal";
import { Profile } from "../profile/Profile";
import { Settings } from "../settings/Settings";
import UserManagement from "../admin/UserManagement";
const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedDebtId, setSelectedDebtId] = useState<string | undefined>();
  // Auto-popular desativado: dados reais inseridos manualmente para teste de notificações

  const handleTabChange = (tab: string, debtId?: string) => {
    setActiveTab(tab);
    setSelectedDebtId(tab === "debts" ? debtId : undefined);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={handleTabChange} />;
      case "clients":
        return <ClientsTable />;
      case "debts":
        return <DebtsTable selectedDebtId={selectedDebtId} onDebtViewed={() => setSelectedDebtId(undefined)} />;
      case "reports":
        return <ReportsReal />;
      case "notifications":
        return <NotificationsReal />;
      case "analytics":
        return <AnalyticsReal />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      case "users":
        return <UserManagement />;
      default:
        return <Dashboard onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onTabChange={handleTabChange} />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;