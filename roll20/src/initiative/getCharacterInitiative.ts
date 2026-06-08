export function getCharacterInitiative(graphic: Graphic): {
  bonus: number;
  dex: number;
} {
  const characterId = graphic.get("represents");
  if (!characterId) {
    return { bonus: 0, dex: 0 };
  }
  const bonus =
    parseInt(getAttrByName(characterId, "initiative_bonus") ?? "0", 10) || 0;
  const dex = parseInt(getAttrByName(characterId, "dexterity") ?? "0", 10) || 0;
  return { bonus, dex };
}
