import { createContext, useContext } from "react";

export function getIdentity(): string {
  return "dm";
  // return "Harrow_Zinvaris";
}

export const IdentityContext = createContext(getIdentity());

export function isDM(): boolean {
  return useContext(IdentityContext) === "dm";
}
