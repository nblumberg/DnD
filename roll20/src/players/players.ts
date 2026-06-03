import type { Id } from "../builtIns";
import { setGmFromPlayers } from "./gm";

const players = new Map<Id, Player>();

export function addPlayer(player: Player, multipleAdd = false) {
  players.set(player.get("id"), player);
  if (!multipleAdd) {
    log(`Player added: ${player.get("displayname")}`);
    setGmFromPlayers();
  }
}

export function getPlayers(): Player[] {
  return Array.from(players.values());
}

export function getPlayer(id: Id): Player | undefined {
  return players.get(id);
}

on("add:player", addPlayer);
