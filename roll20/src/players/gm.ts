import type { Id } from "../builtIns";
import { getPlayers } from "./playerStore";

let gm: Player | undefined;
let gmId: Id | undefined;

export function getGM(): Player | undefined {
  return gm;
}

export function getGMId(): Id | undefined {
  return gmId;
}

export function setGmFromPlayers() {
  gm = getPlayers().find((player) =>
    playerIsGM(player.get("id"))
  );
  if (gm) {
    log(`GM: ${gm.get("displayname")}`);
    gmId = gm.get("id");
  } else {
    log("No GM present");
  }
}
