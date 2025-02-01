import { createContext } from "react";

export const ModeContext = createContext<"generate" | "play">("play");
