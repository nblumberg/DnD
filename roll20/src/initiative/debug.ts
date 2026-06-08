import { debug as genericDebug } from "../utilities";
import { INITIATIVE_API_PREFIX } from "./constants";

export function debug(...args: unknown[]): void {
  genericDebug(INITIATIVE_API_PREFIX, ...args);
}
