import { Size } from "creature";
import { getElementText } from "../dom";
import { parseRegExpGroups } from "../utils";

const metaRegExp =
  /^(?<size>\w+)\s+(?<type>[^(,]+)(\s+\((?<subtype>[^\(\)]+)\))?(,\s+(?<alignment>.+))?$/;

export function getMeta(statBlock: HTMLElement): {
  size: Size;
  type: string;
  subtype?: string;
  alignment?: string;
} {
  const meta: HTMLElement | null = statBlock.querySelector(
    ".mon-stat-block__meta"
  );
  if (!meta) {
    throw new Error("Couldn't find meta block");
  }
  const metaText = getElementText(meta);
  const { size, type, subtype, alignment } = parseRegExpGroups(
    "metaRegExp",
    metaRegExp,
    metaText
  );
  if (!size) {
    throw new Error("Failed to parse size");
  }
  if (!Object.values(Size as any).includes(size)) {
    throw new Error(`${size} is not a recognized Size`);
  }
  if (!type) {
    throw new Error("Failed to parse type");
  }
  return { size: size as Size, type, subtype, alignment };
}
