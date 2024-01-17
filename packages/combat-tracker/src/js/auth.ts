import { createContext, useContext } from "react";

export function getIdentity(): string {
  return "dm";
}

export const IdentityContext = createContext(getIdentity());

export function isDM(): boolean {
  return useContext(IdentityContext) === "dm";
}
