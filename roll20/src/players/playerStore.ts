import type { Id } from "../builtIns";

const players = new Map<Id, Player>();

export function addToPlayerStore(player: Player): void {
  players.set(player.get("id"), player);
}

export function getPlayers(): Player[] {
  return Array.from(players.values());
}

export function getPlayer(id: Id): Player | undefined {
  return players.get(id);
}
