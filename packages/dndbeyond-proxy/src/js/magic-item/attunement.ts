import { JSDOM } from "jsdom";

export function parseAttunement(
  document: JSDOM["window"]["document"]
): boolean {
  const attunementElement = document.querySelector(
    ".page-header .page-heading__suffix .i-req-attunement"
  );
  return !!attunementElement;
}
