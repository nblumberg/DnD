import { extractProperties } from "../utilities";
import { parseGmNotes } from "./parseGmNotes";
import { addPortal, getPortal, Portal } from "./portals";

export function graphicToPortal(token: Graphic): Portal | undefined {
  const { id, gmnotes, left, top, width, height, pageid } = extractProperties(
    token,
    "id",
    "gmnotes",
    "left",
    "top",
    "width",
    "height",
    "pageid"
  );
  const { name, targetName } = parseGmNotes(gmnotes);
  const portal: Portal = { id, name, targetName, targetId: "", pageid, left, top, width, height };
  addPortal(portal);
  return getPortal(id);
}
