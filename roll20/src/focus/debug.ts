import { debug as genericDebug } from "../utilities";
import { FOCUS_API_PREFIX } from "./constants";

export function debug(...args: unknown[]): void {
  genericDebug(FOCUS_API_PREFIX, ...args);
}
