import { debug as genericDebug } from "../utilities";
import { CHECK_API_PREFIX } from "./constants";

export function debug(...args: unknown[]): void {
  genericDebug(CHECK_API_PREFIX, ...args);
}
