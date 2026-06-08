import { debug as genericDebug } from "../utilities";
import { TRACK_API_PREFIX } from "./constants";

export function debug(...args: unknown[]): void {
  genericDebug(TRACK_API_PREFIX, ...args);
}
