import { startUp } from "../utilities";
import { PORTALS_API_PREFIX } from "./constants";
import { debug } from "./debug";
import { graphicToPortal } from "./graphicToPortal";
import { mapPortals } from "./mapPortals";

function onReady() {
  startUp(PORTALS_API_PREFIX, debug);
  const tokens = findObjs<Graphic>({
    type: "graphic",
    subtype: "token",
    name: "!portal",
  });
  debug(`${tokens.length} portals`);
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
  debug(`Portal changed: ${obj.get("id")}`);
  graphicToPortal(obj);
  mapPortals();
}

// Cache portal data at startup
on("ready", onReady);

// Watch for changes to portals and update cache
on("change:graphic:gmnotes", onPortalChange);
