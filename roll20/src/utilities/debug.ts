export function debug(prefix: string, ...args: unknown[]): void {
  log(`${prefix}: ${args.map(String).join(" ")}`);
}
