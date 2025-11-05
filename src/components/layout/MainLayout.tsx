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
import { usePopularDadosAutomatico } from "@/hooks/usePopularDadosAutomatico";

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Popular dados automaticamente se a base de dados estiver vazia
  usePopularDadosAutomatico();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "clients":
        return <ClientsTable />;
      case "debts":
        return <DebtsTable />;
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
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;