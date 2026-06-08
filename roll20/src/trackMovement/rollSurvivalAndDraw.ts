import { Id, ParsedRollResult } from "../builtIns";
import { getPCs, getPlayerName, isControlledBy } from "../players";
import { SURVIVAL_DC } from "./constants";
import { drawTrackPath } from "./drawTrackPath";

export function rollSurvivalAndDraw(graphic: Graphic, playerId: Id): void {
  const pc = getPCs().find((c) => isControlledBy(c, playerId));
  if (!pc) {
    sendChat(
      "TrackAPI",
      `/w ${getPlayerName(playerId)} You don't control any characters, so you can't attempt to track that.`
    );
    return;
  }
  const survivalBonus =
    parseInt(getAttrByName(pc.get("id"), "survival_bonus") ?? "0") || 0;
  const pcName = pc.get("name");

  sendChat("TrackAPI", `/r 1d20+${survivalBonus}`, (results) => {
    const msg = results[0];
    if (msg.type !== "rollresult") {
      return;
    }
    const roll = JSON.parse(msg.content) as ParsedRollResult;
    if (roll.total >= SURVIVAL_DC) {
      sendChat(
        "TrackAPI",
        `/w ${getPlayerName(playerId)} ${pcName} succeeded on the Survival check (${roll.total} vs DC ${SURVIVAL_DC}).`
      );
      drawTrackPath(graphic, playerId);
    } else {
      sendChat(
        "TrackAPI",
        `/w ${getPlayerName(playerId)} ${pcName} failed the Survival check (${roll.total} vs DC ${SURVIVAL_DC}).`
      );
    }
  });
}
