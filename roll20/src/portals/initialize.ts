import { graphicToPortal } from "./graphicToPortal";
import { mapPortals } from "./mapPortals";

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
