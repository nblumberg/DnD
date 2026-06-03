import { Id } from "../builtIns";
import { extractProperties } from "./extractProperties";

export function centerScreen(graphic: Graphic, playerId: Id) {
  if (!graphic || !playerId) {
    return;
  }
  const { left, top, pageid } = extractProperties(graphic, "left", "top", "pageid");
  const moveScreen = true;
  // log(`Centering screen at ${left}, ${top}`);
  sendPing(left, top, pageid, playerId, moveScreen);
}
