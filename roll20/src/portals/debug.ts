import { debug as genericDebug } from "../utilities";
import { PORTALS_API_PREFIX } from "./constants";

export function debug(...args: unknown[]): void {
  genericDebug(PORTALS_API_PREFIX, ...args);
}
