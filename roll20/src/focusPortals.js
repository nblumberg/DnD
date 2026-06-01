// Cache common data at startup
const players = new Map();
const pcs = new Map();
let gm;
let gmId;

on("ready", () => {
  findObjs({ type: "player" }).forEach((player) => {
    players.set(player.get("id"), player);
  });
  log(
    `${players.size} Players: ${Array.from(players.values())
      .map((player) => player.get("displayname"))
      .join(", ")}`
  );
  gm = Array.from(players.values()).find((player) =>
    playerIsGM(player.get("id"))
  );
  if (gm) {
    log(`GM: ${gm.get("displayname")}`);
    gmId = gm.get("id");
  } else {
    log("No GM present");
  }
  const characters = findObjs({ type: "character" });
  characters
    .filter((character) => getAttrByName(character.get("id"), "npc") === "0")
    .forEach((pc) => pcs.set(pc.get("id"), pc));
  if (pcs.size) {
    log(
      `PCs: ${Array.from(pcs.values())
        .map((pc) => pc.get("name"))
        .join(", ")}`
    );
  } else {
    log("No PCs");
  }
});

/**
 * Prevent multiple high frequency calls to the function, only taking the latest call within timeout
 * @param {Function} fn The function to debounce
 * @param {number} [timeout=300] The time to delay
 * @returns
 */
function debounce(fn, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(null, args);
    }, timeout);
  };
}

/**
 * Gets a set of properties from an APIObject and returns them as a POJO
 * @param {APIObject} object https://help.roll20.net/hc/en-us/articles/360037772793-API-Objects
 * @param  {...string} props The APIObject properties to get
 * @returns A POJO of the selected properties
 */
function multiProp(object, ...props) {
  const values = {};
  props.forEach((prop) => {
    values[prop] = object.get(prop);
  });
  return values;
}

/**
 *
 * @param {string} playerId
 * @returns The Player's displayname or "unknown" if the Player is not recognized
 */
function getPlayerName(playerId) {
  const player = players.get(playerId);
  if (!player) {
    return "unknown";
  }
  return player.get("displayname");
}

/**
 *
 * @param {string} characterId
 * @returns The Character's name or "unknown" if the Character is not recognized
 */
function pcName(characterId) {
  const pc = pcs.get(characterId);
  if (!pc) {
    return "unknown";
  }
  return pc.get("name");
}

/**
 * Checks whether the given player can control the APIObject
 * @param {Token or Character} object
 * @param {string} playerId
 * @returns {boolean}
 */
function isControlledBy(object, playerId) {
  return object.get("controlledby").split(",").includes(playerId);
}

/**
 *
 * @param {Token} token
 * @returns {string} The player (or the GM if no players) ID controlling the Token
 */
function tokenToPlayerId(token) {
  const props = multiProp(token, "controlledby", "represents");
  let { controlledby } = props;
  if (!controlledby) {
    // log(`controlledby blank, looking to represented character`);
    const { represents } = props;
    const pc = pcs.get(represents);
    if (pc) {
      controlledby = pc.get("controlledby");
    }
  }
  if (!controlledby) {
    // log(`character controlledby blank, using GM`);
    return gmId;
  }
  controlledby = controlledby.split(",");
  if (controlledby.length === 0) {
    return gmId;
  }
  if (controlledby.length === 1) {
    return controlledby[0];
  }
  const playerId = controlledby.find(
    (playerId) => playerId !== "all" && playerId !== gmId
  );
  return playerId;
}

function centerScreen(token, playerId) {
  if (!token || !playerId) {
    return;
  }
  const { left, top, pageid } = multiProp(token, "left", "top", "pageid");
  const color = playerId;
  const moveScreen = true;
  // log(`Centering screen at ${left}, ${top}`);
  sendPing(left, top, pageid, color, moveScreen, playerId);
}

// ===========================
// CENTER SCREEN ON TOKEN MOVE
// ===========================
/**
 * Whenever a player moves one of their tokens, recenter only their screen on the token
 * @param {Graphic} graphic https://help.roll20.net/hc/en-us/articles/360037772793-API-Objects#API:Objects-Graphic(Token/Map/Card/Etc.)
 * @param {object} previousState https://help.roll20.net/hc/en-us/articles/360037772813#API:Events-ObjectEvents
 */
function onGraphicMove(graphic, previousState) {
  const props = multiProp(
    graphic,
    "subtype",
    "layer",
    "pageid",
    "represents",
    "left",
    "top"
  );
  const { subtype, layer, pageid, left, top, represents } = props;
  if (
    subtype !== "token" ||
    layer !== "objects" ||
    pageid !== Campaign().get("playerpageid")
  ) {
    return;
  }
  const name = pcName(represents);
  const playerId = tokenToPlayerId(graphic);
  if (!playerId) {
    log(`Couldn't determine player screen to center when ${name} moved`);
    return;
  }
  const { left: previousLeft, top: previousTop } = previousState;
  if (
    !previousState ||
    typeof previousLeft !== "number" ||
    typeof previousTop !== "number" ||
    (left === previousLeft && top === previousTop)
  ) {
    // ignore adds and moves to the same location
    log(
      `${name} either didn't move or there was nothing to compare its position to`
    );
    return;
  }
  const rect = getRect(graphic);
  log(
    `${getPlayerName(playerId)} moved ${name} to (${rect.left}, ${rect.top}), recentering their screen`
  );
  centerScreen(graphic, playerId);
}

on("ready", () => {
  log("Starting up center-on-token-move functionality");
});

on("change:graphic:left", debounce(onGraphicMove, 1000));
on("change:graphic:top", debounce(onGraphicMove, 1000));

// ===========================
// !pingMe API
// ===========================
// Support !pingMe and !pingTarget chat commands to center the activating player's screen on one of the player's tokens

on("ready", () => {
  log("Starting up !pingMe API");
});

on("chat:message", ({ type, content, playerid }) => {
  if (type !== "api" || !content.startsWith("!pingMe")) {
    return;
  }
  // TODO: should this expand to include all characters?
  const characterIds = Array.from(pcs.values())
    .filter((pc) => isControlledBy(pc, playerid))
    .map((character) => character.get("id"));
  const tokens = findObjs({
    type: "graphic",
    subtype: "token",
    layer: "objects",
    pageid: Campaign().get("playerpageid"),
  }).filter((token) => {
    const represents = token.get("represents");
    if (characterIds.some((characterId) => represents === characterId)) {
      return true;
    }
    return isControlledBy(token, playerid);
  });
  const playerName = getPlayerName(playerid);
  if (tokens.length === 1) {
    const [target] = tokens;
    pingTarget(target.get("id"), playerid, playerName);
  } else {
    const buttons = tokens.reduce((previous, target) => {
      return `${previous}<a href="!pingTarget|${target.get("id")}|${playerid}|${playerName}">${target.get(
        "name"
      )}</a>`;
    }, "Which character?<br/>");
    chatMessage(playerName, buttons);
  }
});

/**
 * API talks back to the player (token choice UI or error feedback)
 * @param {string} playerName
 * @param {string} message
 */
function chatMessage(playerName, message) {
  sendChat("PingMeAPI", `/w ${playerName} ${message}`);
}

/**
 * API calls second-stage API to center the player's screen on the given token
 * @param {string} targetId
 * @param {string} playerId
 * @param {string} playerName
 */
function pingTarget(targetId, playerId, playerName) {
  sendChat(`!pingTarget ${targetId} ${playerId} ${playerName}`);
}

on("chat:message", ({ type, content }) => {
  if (type !== "api" || !content.startsWith("!pingTarget")) {
    return;
  }
  const pageid = Campaign().get("playerpageid");
  const [, id, playerId, playerName] = content.split("|");
  const token = [
    ...findObjs({
      type: "graphic",
      subtype: "token",
      represents: id,
      pageid,
    }),
    getObj("graphic", id),
  ][0];
  if (!token) {
    chatMessage(playerName, "That character is not on the map.");
    return;
  }
  centerScreen(token, playerId);
});

// ===========================
// Portals
// Any token named !portal with a gmnotes containing:
// 1st line = name of the portal
// 2nd line = name of the target portal
// ===========================
const portals = new Map();

function tokenToPortal(token) {
  const { id, gmnotes, left, top, width, height, pageid } = multiProp(
    token,
    "id",
    "gmnotes",
    "left",
    "top",
    "width",
    "height",
    "pageid"
  );
  const { name, targetName } = parseGmNotes(gmnotes);
  const portal = { id, name, targetName, pageid, left, top, width, height };
  if (
    Array.from(portals.values()).some(
      ({ name: comparisonName, id: comparisonId }) =>
        name === comparisonName && id !== comparisonId
    )
  ) {
    log(`ERROR: There is already a portal named ${name}`);
    return;
  }
  portals.set(id, portal);
  return portal;
}

function mapPortals() {
  const values = Array.from(portals.values());
  const nameMap = values.reduce(
    (map, portal) => ({ ...map, [portal.name]: portal }),
    {}
  );
  values.forEach((portal) => {
    const { name, targetName, targetId } = portal;
    if (targetId && portals.get(targetId).name === targetName) {
      return;
    }
    if (nameMap[targetName]) {
      portal.targetId = nameMap[targetName].id;
      log(`Portal ${name} -> ${targetName}`);
    } else {
      log(`ERROR: Can't find portal named ${targetName}`);
    }
  });
}

// Cache portal data at startup
on("ready", () => {
  const tokens = findObjs({
    type: "graphic",
    subtype: "token",
    name: "!portal",
  });
  log(`Starting up portal functionality: ${tokens.length} portals`);
  tokens.forEach(tokenToPortal);
  mapPortals();
});
// Watch for changes to portals and update cache
on("change.graphic.gmnotes", (obj, prev) => {
  if (
    obj.get("name") !== "!portal" ||
    obj.get("subtype") !== "token" ||
    obj.get("gmnotes") === prev.gmnotes
  ) {
    return;
  }
  tokenToPortal(obj);
  mapPortals();
});

const htmlTagRegExp = /<[^>]+>/g;
/**
 * Get the portal name and target portal name from the portal gmnotes
 * @param {string} gmnotes The portal token's gmnotes, URL encoded HTML
 * @returns {{targetName: any, name: any}} The portal name and target portal name
 */
function parseGmNotes(gmnotes) {
  const decoded = decodeURI(gmnotes);
  const lines = decoded.split("</p>");
  if (lines.length < 2) {
    log(
      `ERROR: there appears to are ${lines.length} line(s) in ${decoded}, expected 2:\nname,\ntargetName`
    );
  }
  const name = lines[0].replace(htmlTagRegExp, "").trim();
  const targetName = lines[1].replace(htmlTagRegExp, "").trim();
  if (!name || !targetName) {
    log(`ERROR: couldn't parse gmnotes ${decoded}`);
  }
  return { name, targetName };
}

/**
 * Get the bounding box of the token
 * @param {Token} token
 * @returns {{top: *, left: *, width: *, height: *}}
 */
function getRect(token) {
  const left = token.get("left");
  const top = token.get("top");
  const width = token.get("width");
  const height = token.get("height");
  return { left, top, width, height };
}

const tokenPositions = new Map();

/**
 * Get the last known position of the token
 * @param {Graphic} token The token to get the position of
 * @returns {Rect} The position of the token, with left, top, width, and height properties
 */
function getLastTokenPosition(token) {
  return (
    tokenPositions.get(token.id) ?? { ...getRect(token), left: -1, top: -1 }
  );
}

/**
 * Set the last known position of the token
 * @param {Graphic} token The token to Set the position of
 */
function updateTokenPosition(token) {
  tokenPositions.set(token.id, getRect(token));
}

/**
 * Check if target point is between other points
 * (but not equal to so it doesn't trigger when the token outer edge meets portal outer edge without being inside the portal)
 * @param {number} target
 * @param {number} min
 * @param {number} max
 * @returns {boolean} true if target is between min and max
 */
function isBetween(target, min, max) {
  return min < target && target < max;
}

/**
 * Check if the token is within (or exactly overlapping) the portal
 * @param {Rect} token The Rect of the token, with left, top, width, and height properties
 * @param {Rect} portal The Rect of the portal, with left, top, width, and height properties
 * @returns {boolean} true if the token is within the portal
 */
function isWithin(
  { left: tokenLeft, top: tokenTop, width: tokenWidth, height: tokenHeight },
  {
    name,
    left: portalLeft,
    top: portalTop,
    width: portalWidth,
    height: portalHeight,
  }
) {
  const tokenRight = tokenLeft + tokenWidth;
  const tokenBottom = tokenTop + tokenHeight;
  const portalRight = portalLeft + portalWidth;
  const portalBottom = portalTop + portalHeight;

  // log(
  //   `Checking ${name} [${portalLeft}, ${portalTop}, ${portalRight}, ${portalBottom}] vs. [${tokenLeft}, ${tokenTop}, ${tokenRight}, ${tokenBottom}]`
  // );

  const leftEdgeWithin = isBetween(tokenLeft, portalLeft, portalRight);
  const rightEdgeWithin = isBetween(tokenRight, portalLeft, portalRight);
  const topEdgeWithin = isBetween(tokenTop, portalTop, portalBottom);
  const bottomEdgeWithin = isBetween(tokenBottom, portalTop, portalBottom);
  const topLeftCornerWithin = leftEdgeWithin && topEdgeWithin;
  const topRightCornerWithin = rightEdgeWithin && topEdgeWithin;
  const bottomLeftCornerWithin = leftEdgeWithin && bottomEdgeWithin;
  const bottomRightCornerWithin = rightEdgeWithin && bottomEdgeWithin;
  const atLeastACornerWithin =
    topLeftCornerWithin ||
    topRightCornerWithin ||
    bottomLeftCornerWithin ||
    bottomRightCornerWithin;
  if (atLeastACornerWithin) {
    return true;
  }
  // Because we don't consider exactly matching the portal edges in isBetween so a single edge overlap doesn't count,
  // we need to check for the case where at least two opposing edges of the token
  // are exactly overlapping the portal edges as well.
  // Both horizontal edges matching or both vertical edges matching is considered within the portal,
  // so long at it isn't just a single edge of the opposite orientation also matching (i.e.
  // the token is next to the portal).
  const matchesLeftAndRight =
    tokenLeft === portalLeft && tokenRight === portalRight;
  const matchesTopAndBottom =
    tokenTop === portalTop && tokenBottom === portalBottom;
  const matchesBoth = matchesLeftAndRight && matchesTopAndBottom;
  if (
    matchesBoth ||
    (matchesLeftAndRight && (topEdgeWithin || bottomEdgeWithin)) ||
    (matchesTopAndBottom && (leftEdgeWithin || rightEdgeWithin))
  ) {
    return true;
  }
  return (
    (isBetween(tokenLeft, portalLeft, portalLeft + portalWidth) &&
      isBetween(tokenTop, portalTop, portalTop + portalHeight)) ||
    (isBetween(tokenLeft + tokenWidth, portalLeft, portalLeft + portalWidth) &&
      isBetween(tokenTop + tokenHeight, portalTop, portalTop + portalHeight)) ||
    (isBetween(portalLeft, tokenLeft, tokenLeft + tokenWidth) &&
      isBetween(portalTop, tokenTop, tokenTop + tokenHeight)) ||
    (isBetween(portalLeft + portalWidth, tokenLeft, tokenLeft + tokenWidth) &&
      isBetween(portalTop + portalHeight, tokenTop, tokenTop + tokenHeight))
  );
}

const temporarilyClosedPortalsByToken = new Map();

/**
 * Temporarily close the given portals to the token, preventing it from immediately bouncing back through the portal it just came from
 * @param {Graphic} graphic The token to temporarily close portals to
 * @param {Portal[]} portals The portals to temporarily close to the token
 */
function temporarilyClosePortals({ id }, portals) {
  if (!portals || portals.length === 0) {
    return;
  }
  if (!temporarilyClosedPortalsByToken.has(id)) {
    temporarilyClosedPortalsByToken.set(id, new Set());
  }
  const closedPortals = temporarilyClosedPortalsByToken.get(id);
  portals.forEach((portal) => closedPortals.add(portal));
  setTimeout(() => {
    portals.forEach((portal) => closedPortals.delete(portal));
  }, 1000);
}

/**
 * Check if the portal is temporarily closed to the token
 * @param {Graphic} token The token to check
 * @param {Portal} portal The portal to check
 * @returns {boolean} true if the portal is temporarily closed to the token
 */
function isPortalTemporarilyClosedToToken({ id: tokenId }, { id: portalId }) {
  return temporarilyClosedPortalsByToken.get(tokenId)?.has(portalId) ?? false;
}

/**
 * Prevent a Token from triggering portals immediately after passing through a portal
 * so it doesn't immediately come back through the destination portal
 */
const twoWayPortalDelay = {
  /**
   * Have the token ignore a given portal if they step on it
   * @param {{ id: string, name: string }} token The token moving through portals
   * @param {Portal} portal The portal for the token to ignore
   * @param {Portal} targetPortal The portal for the token to ignore
   * @returns {boolean} true if already ignored
   */
  addDelay({ id: tokenId, name: tokenName }, portal, targetPortal) {
    let ignoredPortals = twoWayPortalDelay[tokenId];
    if (!ignoredPortals) {
      ignoredPortals = twoWayPortalDelay[tokenId] = {};
    }
    if (ignoredPortals[portal.id] || ignoredPortals[targetPortal.id]) {
      log(
        `Ignoring portal bounce back of ${tokenName} from ${portal.name} to ${targetPortal.name}`
      );
      delete ignoredPortals[portal.id];
      delete ignoredPortals[targetPortal.id];
      return true;
    }
    ignoredPortals[portal.id] = true;
    ignoredPortals[targetPortal.id] = true;
    setTimeout(() => {
      if (ignoredPortals[portal.id] || ignoredPortals[targetPortal.id]) {
        log(
          `Portals ${portal.name}/${targetPortal.name} are once again open to ${tokenName}`
        );
        delete ignoredPortals[portal.id];
        delete ignoredPortals[targetPortal.id];
      }
    }, 1000);
    return false;
  },
};

/**
 * Check if the Graphic is a Token on the current page and see if it overlaps any portals on the current page.
 * If so, move the Token through the portal and recenter the player's view.
 * @param {Graphic} graphic
 */
function checkForPortal(graphic) {
  const { id, name, subtype, layer, pageid } = multiProp(
    graphic,
    "id",
    "name",
    "subtype",
    "layer",
    "pageid",
    "represents"
  );

  // Stop if it's not a token on the current page or if it's a portal token
  if (
    subtype !== "token" ||
    layer !== "objects" ||
    pageid !== Campaign().get("playerpageid") ||
    name === "!portal"
  ) {
    return;
  }

  // Stop if the token hasn't moved since the last check
  const lastPosition = getLastTokenPosition(graphic);
  const rect = getRect(graphic);
  log(
    `Checking ${name} for portals, moving from (${lastPosition.left}, ${lastPosition.top}) to (${rect.left}, ${rect.top})`
  );
  if (rect.left === lastPosition.left && rect.top === lastPosition.top) {
    return;
  }

  updateTokenPosition(graphic);

  // Stop if the token isn't overlapping a portal
  const portal = Array.from(portals.values()).find((portal) => {
    if (portal.pageid !== pageid) {
      return false;
    }
    return isWithin(rect, portal);
  });
  if (!portal) {
    return;
  }

  // Prevent the token from bouncing back and forth between two-way portals
  const targetPortal = portals.get(portal.targetId);
  temporarilyClosePortals(graphic, [portal.id, targetPortal.id]);
  // if (twoWayPortalDelay.addDelay({ id, name }, portal, targetPortal)) {
  //   return;
  // }

  // Move the token to the target portal and center the screen
  log(`${name} passing through ${portal.name} to ${targetPortal.name}`);
  graphic.set("left", targetPortal.left);
  graphic.set("top", targetPortal.top);
  updateTokenPosition(graphic);
  setTimeout(() => {
    centerScreen(graphic, tokenToPlayerId(graphic));
  }, 300);
}

on("change:graphic:left", debounce(checkForPortal));
on("change:graphic:top", debounce(checkForPortal));
