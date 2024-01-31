const ELEMENT = "|||";
const INNER_OUTER = "||";
const ATTRIBUTE = "|";

interface Changeable {
  attributes: Record<string, string>;
  innerText: string;
}

export function createChangeable({
  attributes,
  innerText,
}: Changeable): string {
  return `${ELEMENT}${Object.entries(attributes)
    .map(([key, value]) => `${key}=${value}`)
    .join(ATTRIBUTE)}${INNER_OUTER}${innerText}${ELEMENT}`;
}

export function parseChangeables(str: string): {
  literals: string[];
  changeables: Changeable[];
} {
  const literals: string[] = [];
  const changeables: Array<{
    attributes: Record<string, string>;
    innerText: string;
  }> = [];

  str.split(ELEMENT).forEach((part, index) => {
    if (index % 2 === 0) {
      literals.push(part);
    } else {
      const [attributesStr, innerText] = part.split(INNER_OUTER);
      const attributes = attributesStr.split(ATTRIBUTE).reduce(
        (acc, attr) => {
          const [key, value] = attr.split("=");
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>
      );
      changeables.push({ attributes, innerText });
    }
  });

  return { literals, changeables };
}
