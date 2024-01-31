import { createContext } from "react";

export type View = "both" | "turnOrder" | "history";
interface ViewContextValue {
  view: View;
  setView: (view: View) => void;
}

export const ViewContext = createContext<ViewContextValue>({
  view: "both",
  setView: () => {
    console.warn("ViewContextProvider not found in component tree.");
  },
});
