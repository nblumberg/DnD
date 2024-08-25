export function parseDescription(main: HTMLElement): string {
  const description = main.querySelector(".more-info-content");
  if (!description) {
    throw new Error("Couldn't find description element");
  }
  return description.innerHTML.trim();
}
