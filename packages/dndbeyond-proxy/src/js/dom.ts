export function getElementText(element?: HTMLElement | Node): string {
  if (!element) {
    return "";
  }
  if ("innerText" in element && element.innerText) {
    return element.innerText;
  }
  if ("innerHTML" in element && element.innerHTML) {
    return element.innerHTML;
  }
  if ("textContent" in element && element.textContent) {
    return element.textContent;
  }
  return "";
}

export function getElementTextNodesOnly(elements: Node | Node[]): string {
  let value = "";
  const childNodes = Array.isArray(elements)
    ? elements
    : Array.from(elements.childNodes);
  for (const child of childNodes) {
    if (child.nodeType !== 3) {
      // Node.TEXT_NODE
      continue;
    }
    value += child.textContent.trim();
  }
  return value;
}

export function getRemainingText(previousSibling: ChildNode): string {
  const remainingNodes: ChildNode[] = [];
  let nextNode = previousSibling.nextSibling;
  while (nextNode) {
    remainingNodes.push(nextNode);
    nextNode = nextNode.nextSibling;
  }
  const text = remainingNodes
    .map((node) => node.textContent)
    .join("")
    .trim();
  return text;
}
