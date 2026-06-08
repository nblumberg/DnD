import { debug as genericDebug } from "../utilities";
import { PING_ME_API_PREFIX } from "./constants";

export function debug(...args: unknown[]): void {
  genericDebug(PING_ME_API_PREFIX, ...args);
}
