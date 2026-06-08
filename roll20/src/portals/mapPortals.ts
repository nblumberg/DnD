import { getCurrentPageId } from "../utilities";
import { debug } from "./debug";
import { getPortal, getPortals, Portal } from "./portals";

export function mapPortals() {
  const nameMap = new Map<string, Portal>();
  const portals = getPortals();
  portals.forEach((portal) => {
    nameMap.set(portal.name, portal);
  });
  portals.forEach((portal) => {
    const { name, targetName, targetId } = portal;
    if (targetId && getPortal(targetId)?.name === targetName) {
      return;
    }
    if (nameMap.has(targetName)) {
      portal.targetId = nameMap.get(targetName)!.id;
      if (portal.pageid === getCurrentPageId()) {
        debug(`Portal ${name} -> ${targetName}`);
      }
    } else {
      debug(`ERROR: Can't find portal named ${targetName}`);
    }
  });
}
