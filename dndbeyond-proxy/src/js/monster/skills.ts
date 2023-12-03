export function getSkills(parentElement: HTMLElement): Record<string, number> {
  const skills: Record<string, number> = {};
  let skill: string;
  Array.from(parentElement.childNodes).forEach((child: Node) => {
    let { textContent: text } = child;
    text = text.trim();
    if (!text) {
      return;
    }
    if (child.nodeType === 1) {
      // Node.ELEMENT_NODE
      skill = text.trim();
    } else if (child.nodeType === 3) {
      // Node.TEXT_NODE
      skills[skill] = parseInt(text, 10);
    }
  });
  return skills;
}
