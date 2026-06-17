import { Id } from "../builtIns";
import { getPlayerName } from "../players";
import { getCurrentPageId } from "../utilities";
import { TRACK_PATH_DURATION_MS } from "./constants";
import { debug } from "./debug";
import { getPath } from "./positions";

export function drawTrackPath(graphic: Graphic, playerId: Id): void {
  const path = getPath(graphic);
  if (path.length < 2) {
    sendChat(
      "TrackAPI",
      `/w ${getPlayerName(playerId)} No movement history found for that token.`
    );
    return;
  }

  // Path is FILO (index 0 = most recent); reverse for chronological drawing order
  const points = [...path]
    .reverse()
    .map(({ left, top }) => [left, top] as [number, number]);
  const [originX, originY] = points[0];
  const relativePoints = points.map(([x, y]) => [x - originX, y - originY]);

  // Roll20's createObj("path") requires a "path" property in SVG command format
  // [["M",x,y],["L",x,y],...], not the Pathv2 "points" array format.
  const svgPath = relativePoints.map(([x, y], i) => [i === 0 ? "M" : "L", x, y]);

  const drawnPath = createObj("path", {
    pageid: getCurrentPageId(),
    x: originX,
    y: originY,
    path: JSON.stringify(svgPath),
    shape: "pol",
    stroke: "#ff0000",
    stroke_width: 5,
    layer: "objects",
  }) as Pathv2 | undefined;

  if (!drawnPath) {
    debug(`Failed to create track path for ${graphic.get("name")}`);
    return;
  }

  debug(
    `Drew track path for ${graphic.get("name")} with ${points.length} waypoints`
  );
  setTimeout(() => {
    drawnPath.remove();
  }, TRACK_PATH_DURATION_MS);
}
