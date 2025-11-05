import { useState, useEffect } from "react";
import defaultLogo from "@/assets/logo-ncangaza-hq.png";

export const useLogo = () => {
  const [logo, setLogoState] = useState<string>(() => {
    const stored = localStorage.getItem("system-logo");
    return stored || defaultLogo;
  });

  const setLogo = (newLogo: string) => {
    setLogoState(newLogo);
    localStorage.setItem("system-logo", newLogo);
  };

  const resetLogo = () => {
    setLogoState(defaultLogo);
    localStorage.removeItem("system-logo");
  };

  return {
    logo,
    setLogo,
    resetLogo,
    defaultLogo,
  };
};
