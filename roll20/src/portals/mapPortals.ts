import { getPortal, getPortals, Portal } from "./portals";

export function mapPortals() {
  const nameMap = new Map<string, Portal>();
  const portals = getPortals();
  portals.forEach(
    (portal) => {
        nameMap.set(portal.name, portal);
    }
  );
  portals.forEach((portal) => {
    const { name, targetName, targetId } = portal;
    if (targetId && getPortal(targetId)?.name === targetName) {
      return;
    }
    if (nameMap.has(targetName)) {
      portal.targetId = nameMap.get(targetName)!.id;
      log(`Portal ${name} -> ${targetName}`);
    } else {
      log(`ERROR: Can't find portal named ${targetName}`);
    }
  });
}
