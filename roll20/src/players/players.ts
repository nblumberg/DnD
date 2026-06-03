import { setGmFromPlayers } from "./gm";
import { addToPlayerStore, getPlayer, getPlayers } from "./playerStore";

export { getPlayer, getPlayers };

export function addPlayer(player: Player, multipleAdd = false) {
  addToPlayerStore(player);
  if (!multipleAdd) {
    log(`Player added: ${player.get("displayname")}`);
    setGmFromPlayers();
  }
}

on("add:player", addPlayer);
