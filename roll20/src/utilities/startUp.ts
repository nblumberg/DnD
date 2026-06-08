import { debug as genericDebug } from "./debug";

type DebugFunction = (...args: unknown[]) => void;

export function startUp(
  apiKey: string,
  debug: DebugFunction = genericDebug.bind(undefined, "")
): void {
  debug(`Starting up ${apiKey} API`);
}
