// Roll20 blob fields (bio, gmnotes) require a callback for get() but plain set().
// Also: setting bio and gmnotes in the same set() call is bugged — use separate calls.
function copyBlobField(
  src: Character,
  dst: Character,
  field: "bio" | "gmnotes"
): void {
  (src as any).get(field, (value: string) => {
    dst.set(field, value);
  });
}

export function duplicateCharacter(original: Character, name: string): Character {
  const duplicate = createObj("character", {
    name,
    avatar: original.get("avatar"),
    archived: original.get("archived"),
    controlledby: original.get("controlledby"),
    inplayerjournals: original.get("inplayerjournals"),
  });

  copyBlobField(original, duplicate, "bio");
  copyBlobField(original, duplicate, "gmnotes");

  for (const attr of findObjs<Attribute>({
    type: "attribute",
    characterid: original.id,
  })) {
    createObj("attribute", {
      characterid: duplicate.id,
      name: attr.get("name"),
      current: attr.get("current"),
      max: attr.get("max"),
    });
  }

  for (const ability of findObjs<Ability>({
    type: "ability",
    characterid: original.id,
  })) {
    createObj("ability", {
      characterid: duplicate.id,
      name: ability.get("name"),
      description: ability.get("description"),
      action: ability.get("action"),
      istokenaction: ability.get("istokenaction"),
    });
  }

  return duplicate;
}
