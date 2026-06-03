import type { Id, Rect } from "../builtIns";

export interface Portal extends Rect { 
    id: Id;
    name: string;
    targetName: string;
    targetId: Id;
    pageid: Id;
}

const portals = new Map<Id, Portal>();

export function addPortal(portal: Portal): void {
  const { id, name } = portal;
  if (portals.has(portal.id)) {
    log(`ERROR: There is already a portal with id ${portal.id}`);
    return;
  }
  if (
    getPortals().some(
      ({ name: comparisonName, id: comparisonId }) =>
        name === comparisonName && id !== comparisonId
    )
  ) {
    log(`ERROR: There is already a portal named ${name}`);
    return;
  }
  portals.set(portal.id, portal);
}

export function getPortals(): Portal[] {
  return Array.from(portals.values());
}

export function getPortal(id: Id): Portal | undefined {
  return portals.get(id);
}
