import { getCurrentPageId } from "../utilities";
import { findTokenForCharacter } from "./findTokenForCharacter";

export function findGraphic(nameOrId: string): Graphic | undefined {
  const pageId = getCurrentPageId();

  const byGraphicId = getObj("graphic", nameOrId);
  if (byGraphicId) return byGraphicId;

  const byGraphicName = findObjs<Graphic>({
    type: "graphic",
    name: nameOrId,
    pageid: pageId,
  });
  if (byGraphicName.length > 0) return byGraphicName[0];

  const byCharacterId = getObj("character", nameOrId);
  if (byCharacterId)
    return findTokenForCharacter(byCharacterId.get("id"), pageId);

  const byCharacterName = findObjs<Character>({
    type: "character",
    name: nameOrId,
  });
  if (byCharacterName.length > 0)
    return findTokenForCharacter(byCharacterName[0].get("id"), pageId);

  return undefined;
}
