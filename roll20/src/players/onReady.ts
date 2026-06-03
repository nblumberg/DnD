import { setGmFromPlayers } from "./gm";
import { addPC, getPCs } from "./pcs";
import { addPlayer } from "./players";

function onReady() {
  const players = findObjs<Player>({ type: "player" });
  for (const player of players){
    addPlayer(player, true);
  }
  log(
    `${players.length} Players: ${players
      .map((player) => player.get("displayname"))
      .join(", ")}`
  );
  setGmFromPlayers();

  const characters = findObjs<Character>({ type: "character" });
  for (const character of characters) {
    addPC(character, true);
  }
  const pcs = getPCs();
  if (pcs.length) {
    log(
      `PCs: ${pcs
        .map((pc) => pc.get("name"))
        .join(", ")}`
    );
  } else {
    log("No PCs");
  }
}

on("ready", onReady);
