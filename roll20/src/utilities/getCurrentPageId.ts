import type { Id } from "../builtIns";

export function getCurrentPageId(): Id {
  const playerpageid = Campaign().get("playerpageid");
  return playerpageid || "";
}
