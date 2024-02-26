import { createContext } from "react";
import { View } from "../app/constants/view";

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
