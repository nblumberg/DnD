import { Id } from "../builtIns";

export function findTokenForCharacter(
  characterId: Id,
  pageId: Id
): Graphic | undefined {
  return findObjs<Graphic>({
    type: "graphic",
    represents: characterId,
    pageid: pageId,
  })[0];
}
