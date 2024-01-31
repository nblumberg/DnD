import { createContext, useEffect, useState } from "react";
import { device } from "../components/breakpoints";

export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(window.screen.width <= device.md);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.screen.width <= device.md);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);
  return isMobile;
}

export const MobileContext = createContext(false);
