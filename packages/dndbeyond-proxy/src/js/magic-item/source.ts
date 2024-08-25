export function parseSource(main: HTMLElement): string {
  const source = main.querySelector("footer .source");
  if (!source) {
    throw new Error("Couldn't find source element");
  }
  return source.textContent?.trim() ?? "";
}
