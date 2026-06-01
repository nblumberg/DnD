import { createContext } from "react";

type Mode = "play" | "generate";

declare global {
  interface Window {
    mode: Mode;
  }
}

export const ModeContext = createContext<Mode>("play");
