import { getElementText } from "../dom";

const metaRegExp =
  /^(?<size>\w+)\s+(?<type>[^(,]+)(\s+\((?<subtype>[^\(\)]+)\))?,\s+(?<alignment>.+)$/;

export function getMeta(statBlock: HTMLElement): {
  size: string;
  type: string;
  subtype?: string;
  alignment: string;
} {
  const meta: HTMLElement = statBlock.querySelector(".mon-stat-block__meta");
  const metaText = getElementText(meta);
  const { size, type, subtype, alignment } = metaRegExp.exec(metaText).groups;
  return { size, type, subtype, alignment };
}
