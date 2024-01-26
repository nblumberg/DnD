import { CreatureType, Size } from "creature";
import { getElementText } from "../dom";
import { parseRegExpGroups } from "../utils";

const metaRegExp =
  /^(?<size>\w+)\s+(?<type>[^(,]+)(\s+\((?<subtype>[^\(\)]+)\))?(,\s+(?<alignment>.+))?$/;
const swarmRegExp = /^swarm of (?<swarmSize>\w+) (?<swarmType>\w+)s$/;

export function getMeta(statBlock: HTMLElement): {
  size: Size;
  type: CreatureType;
  subtype?: string;
  alignment?: string;
  swarm?: Size;
} {
  const meta: HTMLElement | null = statBlock.querySelector(
    ".mon-stat-block__meta"
  );
  if (!meta) {
    throw new Error("Couldn't find meta block");
  }
  const metaText = getElementText(meta);
  const {
    size,
    type: preFixType,
    subtype,
    alignment,
  } = parseRegExpGroups("metaRegExp", metaRegExp, metaText);
  if (!size) {
    throw new Error("Failed to parse size");
  }
  if (!Object.values(Size as any).includes(size)) {
    throw new Error(`${size} is not a recognized Size`);
  }
  if (!preFixType) {
    throw new Error("Failed to parse type");
  }
  let type = preFixType.toLowerCase() as CreatureType;
  let swarm: Size | undefined;
  if (size === "Medium" && preFixType === "Or Small Humanoid") {
    type = "humanoid";
  } else if (swarmRegExp.test(preFixType)) {
    const { swarmSize, swarmType } = parseRegExpGroups(
      "swarmRegExp",
      swarmRegExp,
      preFixType
    );
    type = swarmType.toLowerCase() as CreatureType;
    swarm = swarmSize as Size;
  }
  return { size: size as Size, type, subtype, alignment, swarm };
}
