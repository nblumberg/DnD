import { debug as genericDebug } from "../utilities";
import { GRID_API_PREFIX } from "./constants";

export function debug(...args: unknown[]): void {
  genericDebug(GRID_API_PREFIX, ...args);
}
