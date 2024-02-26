import { useEffect } from "react";
import { windowResize } from "../reducers";
import { checkMobile } from "../utils/checkMobile";
import { getWindow } from "../utils/env";
import { useAppState } from "./state";

export function useMobile(): boolean {
  const [{ isMobile }, dispatch] = useAppState();
  useEffect(() => {
    function handleResize() {
      windowResize(dispatch, checkMobile());
    }
    getWindow()?.addEventListener("resize", handleResize);
    return () => getWindow()?.removeEventListener("resize", handleResize);
  }, [dispatch]);
  return isMobile;
}
