export function getWindow(): Window | void {
  if (typeof window === "undefined") {
    return undefined;
  }
  return window;
}
