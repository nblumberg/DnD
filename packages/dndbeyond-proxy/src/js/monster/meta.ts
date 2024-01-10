import { getElementText } from "../dom";
import { parseRegExpGroups } from "../utils";

const metaRegExp =
  /^(?<size>\w+)\s+(?<type>[^(,]+)(\s+\((?<subtype>[^\(\)]+)\))?(,\s+(?<alignment>.+))?$/;

export function getMeta(statBlock: HTMLElement): {
  size: string;
  type: string;
  subtype?: string;
  alignment?: string;
} {
  const meta: HTMLElement = statBlock.querySelector(".mon-stat-block__meta");
  const metaText = getElementText(meta);
  const { size, type, subtype, alignment } = parseRegExpGroups(
    "metaRegExp",
    metaRegExp,
    metaText
  );
  if (!size) {
    throw new Error("Failed to parse size");
  }
  if (!type) {
    throw new Error("Failed to parse type");
  }
  return { size, type, subtype, alignment };
}
