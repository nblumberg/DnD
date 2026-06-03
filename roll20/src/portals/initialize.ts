import { graphicToPortal } from "./graphicToPortal";
import { mapPortals } from "./mapPortals";

// ===========================
// !portal API
// Support !portal tokens, which allow players to move their characters onto them to be teleported to 
// another !portal token. The destination portal is determined by the gmnotes field of the token, 
// which should contain the names of the current and destination portal tokens. 
// ===========================

function onReady() {
  const tokens = findObjs<Graphic>({
    type: "graphic",
    subtype: "token",
    name: "!portal",
  });
  log(`Starting up portal functionality: ${tokens.length} portals`);
  tokens.forEach(graphicToPortal);
  mapPortals();
}

function onPortalChange(obj: Graphic, prev: Graphic) {
  if (
    obj.get("name") !== "!portal" ||
    obj.get("subtype") !== "token" ||
    obj.get("gmnotes") === prev.gmnotes
  ) {
    return;
  }
  graphicToPortal(obj);
  mapPortals();
}

// Cache portal data at startup
on("ready", onReady);

// Watch for changes to portals and update cache
on("change:graphic:gmnotes", onPortalChange);
