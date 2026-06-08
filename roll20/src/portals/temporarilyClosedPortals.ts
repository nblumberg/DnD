import type { Id } from "../builtIns";
import { Portal } from "./portals";

const temporarilyClosedPortalsByGraphic = new Map<Id, Set<Id>>();

/**
 * Temporarily close the given portals to the graphic, preventing it from immediately bouncing back through the portal it just came from
 * @param {Graphic} graphic The graphic to temporarily close portals to
 * @param {Portal[]} portals The portals to temporarily close to the graphic
 */
export function temporarilyClosePortals(
  { id: graphicId }: Graphic,
  portals: Portal[]
) {
  if (!portals || portals.length === 0) {
    return;
  }
  if (!temporarilyClosedPortalsByGraphic.has(graphicId)) {
    temporarilyClosedPortalsByGraphic.set(graphicId, new Set());
  }
  const closedPortals = temporarilyClosedPortalsByGraphic.get(graphicId)!;
  portals.forEach(({ id: portalId }) => closedPortals.add(portalId));
  setTimeout(() => {
    portals.forEach(({ id: portalId }) => closedPortals.delete(portalId));
  }, 1000);
}

/**
 * Check if the portal is temporarily closed to the token
 * @param {Graphic} token The token to check
 * @param {Portal} portal The portal to check
 * @returns {boolean} true if the portal is temporarily closed to the token
 */
export function isPortalTemporarilyClosedToToken(
  { id: tokenId }: Graphic,
  { id: portalId }: Portal
): boolean {
  return temporarilyClosedPortalsByGraphic.get(tokenId)?.has(portalId) ?? false;
}
