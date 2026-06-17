import { debug as genericDebug } from "../utilities";
import { DUPLICATE_API_PREFIX } from "./constants";

export function debug(...args: unknown[]): void {
  genericDebug(DUPLICATE_API_PREFIX, ...args);
}
