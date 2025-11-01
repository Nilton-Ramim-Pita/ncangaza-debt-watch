import { useState, useEffect } from "react";

export interface SystemSettings {
  siteName: string;
  siteUrl: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  timezone: string;
  language: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  autoBackup: boolean;
  backupFrequency: string;
  dataRetention: number;
  twoFactorAuth: boolean;
  sessionTimeout: number;
}

const DEFAULT_SETTINGS: SystemSettings = {
  siteName: "Ncangaza Multiservices",
  siteUrl: "https://ncangaza.mz",
  contactEmail: "info@ncangaza.mz",
  contactPhone: "+258 84 123 4567",
  currency: "MZN",
  timezone: "Africa/Maputo",
  language: "pt-MZ",
  emailNotifications: true,
  smsNotifications: false,
  whatsappNotifications: true,
  autoBackup: true,
  backupFrequency: "daily",
  dataRetention: 365,
  twoFactorAuth: false,
  sessionTimeout: 30,
};

export const useSettings = () => {
  const [settings, setSettingsState] = useState<SystemSettings>(() => {
    const stored = localStorage.getItem("system-settings");
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  });

  const setSettings = (newSettings: SystemSettings) => {
    setSettingsState(newSettings);
    localStorage.setItem("system-settings", JSON.stringify(newSettings));
  };

  const updateSetting = <K extends keyof SystemSettings>(
    key: K,
    value: SystemSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    setSettings,
    updateSetting,
    resetSettings,
  };
};
