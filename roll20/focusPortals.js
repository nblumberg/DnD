// Cache common data at startup
const players = new Map();
const pcs = new Map();
let gm;
let gmId;

on('ready', () => {
    findObjs({ type: 'player' }).forEach(player => {
        players.set(player.get('id'), player);
    });
    log(`${players.size} Players: ${Array.from(players.values()).map(player => player.get('displayname')).join(', ')}`);
    gm = Array.from(players.values()).find(player => playerIsGM(player.get('id')));
    if (gm) {
        log(`GM: ${gm.get('displayname')}`);
        gmId = gm.get('id');
    } else {
        log('No GM present');
    }
    const characters = findObjs({ type: 'character' });
    characters.filter(character => getAttrByName(character.get('id'), 'npc') === '0').forEach(pc => pcs.set(pc.get('id'), pc));
    if (pcs.size) {
        log(`PCs: ${Array.from(pcs.values()).map(pc => pc.get('name')).join(', ')}`);
    } else {
        log('No PCs');
    }
});

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
        return 'unknown';
    }
    return player.get('displayname');
}

/**
 *
 * @param {string} characterId
 * @returns The Character's name or "unknown" if the Character is not recognized
 */
function pcName(characterId) {
    const pc = pcs.get(characterId);
    if (!pc) {
        return 'unknown';
    }
    return pc.get('name');
}

/**
 * Checks whether the given player can control the APIObject
 * @param {Token or Character} object
 * @param {string} playerId
 * @returns {boolean}
 */
function isControlledBy(object, playerId) {
    return object.get('controlledby').split(',').includes(playerId);
}

/**
 *
 * @param {Token} token
 * @returns {string} The player (or the GM if no players) ID controlling the Token
 */
function tokenToPlayerId(token) {
    const props = multiProp(token, 'controlledby', 'represents');
    let { controlledby } = props;
    if (!controlledby) {
        // log(`controlledby blank, looking to represented character`);
        const { represents } = props;
        const pc = pcs.get(represents);
        if (pc) {
            controlledby = pc.get('controlledby');
        }
    }
    if (!controlledby) {
        // log(`character controlledby blank, using GM`);
        return gmId;
    }
    controlledby = controlledby.split(',');
    if (controlledby.length === 0) {
        return gmId;
    }
    if (controlledby.length === 1) {
        return controlledby[0];
    }
    const playerId = controlledby.find(playerId => playerId !== 'all' && playerId !== gmId);
    return playerId;
}

function centerScreen(token, playerId) {
    if (!token || !playerId) {
        return;
    }
    const { left, top, pageid } = multiProp(token, 'left', 'top', 'pageid');
    const color = playerId;
    const moveScreen = true;
    log(`Centering screen at ${left}, ${top}`);
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
    const props = multiProp(graphic, 'subtype', 'layer', 'pageid', 'represents', 'left', 'top');
    const { subtype, layer, pageid, left, top, represents } = props;
    if (subtype !== 'token' || layer !== 'objects' || pageid !== Campaign().get('playerpageid')) {
        return;
    }
    const playerId = tokenToPlayerId(graphic);
    if (!playerId) {
        return;
    }
    const { left: previousLeft, top: previousTop } = previousState;
    if (!previousState || typeof previousLeft !== 'number' || typeof previousTop !== 'number' || (left === previousLeft && top === previousTop)) {
        // ignore adds and moves to the same location
        return;
    }
    log(`${getPlayerName(playerId)} moved ${pcName(represents)}, recentering their screen`);
    centerScreen(graphic, playerId);
}

on('ready', () => {
    log('Starting up center-on-token-move functionality');
});

on('change:graphic:left', onGraphicMove);

on('change:graphic:top', onGraphicMove);


// ===========================
// !pingMe API
// ===========================
// Support !pingMe and !pingTarget chat commands to center the activating player's screen on one of the player's tokens

on('ready', () => {
    log('Starting up !pingMe API');
});

on('chat:message', ({ type, content, playerid }) => {
    if (type !== 'api' || !content.startsWith('!pingMe')) {
        return;
    }
    // TODO: should this expand to include all characters?
    const characterIds = Array.from(pcs.values()).filter(pc => isControlledBy(pc, playerid)).map(character => character.get('id'));
    const tokens = findObjs({ type: 'graphic', subtype: 'token', layer: 'objects', pageid: Campaign().get('playerpageid') }).filter(token => {
        const represents = token.get('represents');
        if (characterIds.some(characterId => represents === characterId)) {
            return true;
        }
        return isControlledBy(token, playerid);
    });
    const playerName = getPlayerName(playerid);
    if (tokens.length === 1) {
        const [target] = tokens;
        pingTarget(target.get('id'), playerid, playerName);
    } else {
        const buttons = tokens.reduce((previous, target) => {
            return `${previous}<a href="!pingTarget|${target.get('id')}|${playerid}|${playerName}">${
                target.get('name')}</a>`;
        }, 'Which character?<br/>');
        chatMessage(playerName, buttons);
    }
});

/**
 * API talks back to the player (token choice UI or error feedback)
 * @param {string} playerName
 * @param {string} message
 */
function chatMessage(playerName, message) {
    sendChat('PingMeAPI', `/w ${playerName} ${message}`);
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

on('chat:message', ({ type, content }) => {
    if (type !== 'api' || !content.startsWith('!pingTarget')) {
        return;
    }
    const pageid = Campaign().get('playerpageid');
    const [, id, playerId, playerName] = content.split('|');
    const token = [...findObjs({
        type: 'graphic',
        subtype: 'token',
        represents: id,
        pageid,
    }), getObj('graphic', id)][0];
    if (!token) {
        chatMessage(playerName, 'That character is not on the map.');
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
    const { id, gmnotes, left, top, width, height, pageid } = multiProp(token, 'id', 'gmnotes', 'left', 'top', 'width', 'height', 'pageid');
    const { name, targetName } = parseGmNotes(gmnotes);
    const portal = { id, name, targetName, pageid, left, top, width, height };
    if (Array.from(portals.values()).some(({ name: comparisonName, id: comparisonId }) => name === comparisonName && id !== comparisonId)) {
        log(`ERROR: There is already a portal named ${name}`);
        return;
    }
    portals.set(id, portal);
    return portal;
}

function mapPortals() {
    const values = Array.from(portals.values());
    const nameMap = values.reduce((map, portal) => ({ ...map, [portal.name]: portal }), {});
    values.forEach(portal => {
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
on('ready', () => {
    const tokens = findObjs({ type: 'graphic', subtype: 'token', name: '!portal' });
    log(`Starting up portal functionality: ${tokens.length} portals`);
    tokens.forEach(tokenToPortal);
    mapPortals();
});
// Watch for changes to portals and update cache
on('change.graphic.gmnotes', (obj, prev) => {
    if (obj.get('name') !== '!portal' || obj.get('subtype') !== 'token' || obj.get('gmnotes') === prev.gmnotes) {
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
    const lines = decoded.split('</p>');
    if (lines.length < 2) {
        log(`ERROR: there appears to are ${lines.length} line(s) in ${decoded}, expected 2:\nname,\ntargetName`);
    }
    const name = lines[0].replace(htmlTagRegExp, '').trim();
    const targetName = lines[1].replace(htmlTagRegExp, '').trim();
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
    const left = token.get('left');
    const top = token.get('top');
    const width = token.get('width');
    const height = token.get('height');
    return {left, top, width, height};
}

/**
 * Check if target point is between (but not equal to so it doesn't trigger when token edge meets portal edge) other points
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
 * @param {number} left1 Token left
 * @param {number} top1 Token top
 * @param {number} width1 Token width
 * @param {number} height1 Token height
 * @param {string} name Portal name
 * @param {number} left2 Portal left
 * @param {number} top2 Portal top
 * @param {number} width2 Portal width
 * @param {number} height2 Portal height
 * @returns {boolean}
 */
function isWithin({ left: left1, top: top1, width: width1, height: height1 }, { name, left: left2, top: top2, width: width2, height: height2 }) {
    if (left1 === left2 && top1 === top2 && left1 + width1 === left2 + width2 && top1 + height1 === top2 + height2) {
        // log('exact match');
        return true;
    }
    // log(`Checking ${name} [${left1}, ${top1}, ${left1 + width1}, ${top1 + height1}] vs. [${left2}, ${top2}, ${left2 + width2}, ${top2 + height2}]`);
    return (isBetween(left1, left2, left2 + width2) && isBetween(top1, top2, top2 + height2) ||
        isBetween(left1 + width1, left2, left2 + width2) && isBetween(top1 + height1, top2, top2 + height2)) ||
        (isBetween(left2, left1, left1 + width1) && isBetween(top2, top1, top1 + height1) ||
            isBetween(left2 + width2, left1, left1 + width1) && isBetween(top2 + height2, top1, top1 + height1));
}

/**
 * Check if the Graphic is a Token on the current page and see if it overlaps any portals on the current page.
 * If so, move the Token through the portal and recenter the player's view.
 * @param {Graphic} graphic
 */
function checkForPortal(graphic) {
    const props = multiProp(graphic, 'subtype', 'layer', 'pageid', 'represents');
    const { subtype, layer, pageid } = props;
    if (subtype !== 'token' || layer !== 'objects' || pageid !== Campaign().get('playerpageid')) {
        return;
    }
    const rect = getRect(graphic);
    const portal = Array.from(portals.values()).find((portal) => {
        if (portal.pageid !== pageid) {
            return false;
        }
        return isWithin(rect, portal);
    });
    if (!portal) {
        return;
    }
    const targetPortal = portals.get(portal.targetId);
    log(`${graphic.get('name')} passing through ${portal.name} to ${targetPortal.name}`);
    graphic.set('left', targetPortal.left);
    graphic.set('top', targetPortal.top);
    centerScreen(graphic, tokenToPlayerId(graphic));
}

on('change:graphic:left', checkForPortal);
on('change:graphic:top', checkForPortal);
