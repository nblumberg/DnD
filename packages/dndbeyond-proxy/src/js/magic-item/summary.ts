export const summaryRegExp =
  /^(?<type>[^,(]+)(\s+\((?<subtype>[^)]+)\))?,\s+(?<rarity>[^(]+)(\s*\((?<attunement>requires attunement)(?<attunementPrerequisite>[^)]+)?\))?$/;

export function parseSummary(summary: string): {
  type: string;
  subtype?: string;
  rarity: string;
  attunement: boolean;
  attunementPrerequisite?: string;
} {
  const result = summaryRegExp.exec(summary);
  if (!result) {
    throw new Error(`Couldn't parse summary: ${summary}`);
  }
  const { type, subtype, rarity, attunement, attunementPrerequisite } =
    result.groups ?? {};
  return {
    type: type.trim(),
    subtype: subtype?.trim(),
    rarity: rarity.trim(),
    attunement: !!attunement,
    attunementPrerequisite: attunementPrerequisite?.trim(),
  };
}
