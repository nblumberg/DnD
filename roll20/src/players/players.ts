import type { Id } from "../builtIns";

// Cache common data at startup
const players = new Map<Id, Player>();
const pcs = new Map<Id, Character>();
let gm: Player | undefined;
let gmId: Id | undefined;

export function getPlayers(): Player[] {
  return Array.from(players.values());
}

export function getPCs(): Character[] {
  return Array.from(pcs.values());
}

export function getGM(): Player | undefined {
  return gm;
}

export function getGMId(): Id | undefined {
  return gmId;
}

export function getPlayer(id: Id): Player | undefined {
  return players.get(id);
}

/**
 *
 * @param {string} playerId
 * @returns The Player's displayname or "unknown" if the Player is not recognized
 */
export function getPlayerName(playerId: Id): string {
  const player = players.get(playerId);
  if (!player) {
    return "unknown";
  }
  return player.get("displayname");
}


export function getPC(id: Id): Character | undefined {
  return pcs.get(id);
}

/**
 *
 * @param {string} characterId
 * @returns The Character's name or "unknown" if the Character is not recognized
 */
export function getPCName(characterId: Id): string {
  const pc = pcs.get(characterId);
  if (!pc) {
    return "unknown";
  }
  return pc.get("name");
}

export function isPC(character: Character): boolean {
  return getAttrByName(character.get("id"), "npc") === "0";
}

/**
 * Checks whether the given player can control the APIObject
 * @param {Character | Graphic} apiObject
 * @param {string} playerId
 * @returns {boolean}
 */
export function isControlledBy(apiObject: Character | Graphic, playerId: Id): boolean {
  return apiObject.get("controlledby").split(",").includes(playerId);
}


function setGmFromPlayers() {
  gm = Array.from(players.values()).find((player) =>
    playerIsGM(player.get("id"))
  );
  if (gm) {
    log(`GM: ${gm.get("displayname")}`);
    gmId = gm.get("id");
  } else {
    log("No GM present");
  }
}

function addPlayer(player: Player, multipleAdd = false) {
  players.set(player.get("id"), player);
  if (!multipleAdd) {
    log(`Player added: ${player.get("displayname")}`);
    setGmFromPlayers();
  }
}

function addCharacter(character: Character, multipleAdd = false) {
  if (!isPC(character)) {
    return;
  }
  pcs.set(character.get("id"), character);
  if (!multipleAdd) {
    log(`PC added: ${character.get("name")}`);
  }
}

function onReady() {
  findObjs<Player>({ type: "player" }).forEach((player) => {
    addPlayer(player, true);
  });
  log(
    `${players.size} Players: ${Array.from(players.values())
      .map((player) => player.get("displayname"))
      .join(", ")}`
  );
  setGmFromPlayers();

  const characters = findObjs<Character>({ type: "character" });
  characters.forEach((character) => addCharacter(character, true));
  if (pcs.size) {
    log(
      `PCs: ${Array.from(pcs.values())
        .map((pc) => pc.get("name"))
        .join(", ")}`
    );
  } else {
    log("No PCs");
  }
}

on("ready", onReady);
on("add:player", addPlayer);
on("add:character", addCharacter);
