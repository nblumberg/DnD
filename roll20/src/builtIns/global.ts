import { Ability as _Ability } from "./ability";
import { Attribute as _Attribute } from "./attribute";
import { Campaign as _Campaign } from "./campaign";
import { Card as _Card } from "./card";
import { Character as _Character } from "./character";
import { ChatMessage } from "./chat";
import { Points as _Points } from "./coordinateAndRect";
import { CustomFx as _CustomFx } from "./customFx";
import { Deck as _Deck } from "./deck";
import { Door as _Door, Roll20Window } from "./doorAndWindow";
import { Graphic as _Graphic, StatusMarker as _StatusMarker } from "./graphic";
import { Hand as _Hand } from "./hand";
import { Handout as _Handout } from "./handout";
import { Id } from "./ids";
import { JukeboxTrack as _JukeboxTrack } from "./jukeboxTrack";
import { Macro as _Macro } from "./macro";
import { EventType } from "./on";
import { Page as _Page } from "./page";
import { Pathv2 as _Pathv2 } from "./pathV2";
import { Pin as _Pin } from "./pin";
import { Player as _Player } from "./player";
import { AllObjects, CreatableObjectType, ObjectType } from "./roll20Objects";
import {
  RollableTable as _RollableTable,
  TableItem as _TableItem,
} from "./rollableTable";
import { State } from "./state";
import { Text as _Text } from "./text";
import { TurnOrderEntry } from "./turnOrder";

declare global {
  type Ability = _Ability;
  type Attribute = _Attribute;
  type Card = _Card;
  type Character = _Character;
  type CustomFx = _CustomFx;
  type Deck = _Deck;
  type Door = _Door;
  type Graphic = _Graphic;
  type Hand = _Hand;
  type Handout = _Handout;
  type JukeboxTrack = _JukeboxTrack;
  type Macro = _Macro;
  type Page = _Page;
  type Pathv2 = _Pathv2;
  type Pin = _Pin;
  type Player = _Player;
  type Points = _Points;
  type RollableTable = _RollableTable;
  type StatusMarker = _StatusMarker;
  type TableItem = _TableItem;
  type Text = _Text;
  type TurnOrder = TurnOrderEntry[];
  type Window = Roll20Window;

  /**
   * createObj(type, attributes)
   * Note: currently you can create 'graphic', 'text', 'path', 'character', 'ability', 'attribute', 'handout', 'rollabletable', 'tableitem', and 'macro' objects.
   *
   * You can create a new object in the game using the createObj function. You must pass in the type of the object (one of the valid _type properties from the objects list above), as well as an attributes object containing a list of properties for the object. Note that if the object is has a parent object (for example, attributes and abilities belong to characters, graphics, texts, and paths belong to pages, etc.), you must pass in the ID of the parent in the list of properties (for example, you must include the characterid property when creating an attribute). Also note that even when creating new objects, you can't set read-only properties, they will automatically be set to their default value. The one exception to this is when creating a Path, you must include the 'path' property, but it cannot be modified once the path is initially created.
   *
   * createObj will return the new object, so you can continue working with it.
   *
   * //Create a new Strength attribute on any Characters that are added to the game.
   * on("add:character", function(obj) {
   *     createObj("attribute", {
   *         name: "Strength",
   *         current: 0,
   *         max: 30,
   *         characterid: obj.id
   *     });
   *   });
   *
   * @param {CreatableObjectType} type The _type of the object to create. Must be one of the valid _type properties from the objects list above.
   * @param {Partial<AllObjects>} attributes An object containing a list of properties for the new object. Note that if the object is has a parent object (for example, attributes and abilities belong to characters, graphics, texts, and paths belong to pages, etc.), you must pass in the ID of the parent in the list of properties (for example, you must include the characterid property when creating an attribute). Also note that even when creating new objects, you can't set read-only properties, they will automatically be set to their default value. The one exception to this is when creating a Path, you must include the 'path' property, but it cannot be modified once the path is initially created.
   * @returns {AllObjects} The new object that was created.
   */
  function createObj(type: "ability", attributes: Partial<_Ability>): _Ability;
  function createObj(
    type: "attribute",
    attributes: Partial<_Attribute>
  ): _Attribute;
  function createObj(
    type: "character",
    attributes: Partial<_Character>
  ): _Character;
  function createObj(type: "graphic", attributes: Partial<_Graphic>): _Graphic;
  function createObj(type: "handout", attributes: Partial<_Handout>): _Handout;
  function createObj(type: "macro", attributes: Partial<_Macro>): _Macro;
  function createObj(type: "path", attributes: Partial<_Pathv2>): _Pathv2;
  function createObj(
    type: "rollabletable",
    attributes: Partial<_RollableTable>
  ): _RollableTable;
  function createObj(
    type: "tableitem",
    attributes: Partial<_TableItem>
  ): _TableItem;
  function createObj(type: "text", attributes: Partial<_Text>): _Text;

  /**
   * A function which returns the Campaign object. Since there is only one campaign, this global always points to the only campaign in the game. Useful for doing things like checking to see if an object is on the active page using Campaign().get("playerpageid").
   * @returns {_Campaign} The Campaign object. Since there is only one campaign, this global always points to the only campaign in the game. Useful for doing things like checking to see if an object is on the active page using Campaign().get("playerpageid").
   */
  function Campaign(): _Campaign;

  /**
   * state
   * The state variable is an object in the global scope which is accessible to all scripts running in a game. You can access the state object from any function or callback at any time just by using the global variable named state. Additionally, the state object is persisted between executions of the Sandbox, so you can use it to store information you want to have in future runs of your script.
   *
   * Note: You should use the state object to store information that is only needed by the API, since it is not sent to player computers and does not make your game file larger. Store values that are needed in-game in the Roll20 objects' properties.
   * @see State
   */
  const state: { [key: string]: State };

  /**
   * Finding/Filtering Objects
   * The API provides several helper functions which can be used to find objects.
   *
   * getObj(type, id)
   * This function gets a single object if pass in the _type of the object and the _id. It's best to use this function over the other find functions whenever possible, as its the only one that doesn't have to iterate through the entire collection of objects.
   *
   * on("change:graphic:represents", function(obj) {
   *     if(obj.get("represents") != "") {
   *        var character = getObj("character", obj.get("represents"));
   *     }
   * });
   *
   * @param {ObjectType} type The _type of the object to get. Must be one of the valid _type properties from the objects list above.
   * @param {Id} id The _id of the object to get.
   * @returns {AllObjects | undefined} The object with the specified _type and _id, or undefined if no such object exists.
   */
  function getObj(type: "ability", id: Id): _Ability | undefined;
  function getObj(type: "attribute", id: Id): _Attribute | undefined;
  function getObj(type: "card", id: Id): _Card | undefined;
  function getObj(type: "character", id: Id): _Character | undefined;
  function getObj(type: "custfx", id: Id): _CustomFx | undefined;
  function getObj(type: "deck", id: Id): _Deck | undefined;
  function getObj(type: "door", id: Id): _Door | undefined;
  function getObj(type: "graphic", id: Id): _Graphic | undefined;
  function getObj(type: "hand", id: Id): _Hand | undefined;
  function getObj(type: "handout", id: Id): _Handout | undefined;
  function getObj(type: "jukeboxtrack", id: Id): _JukeboxTrack | undefined;
  function getObj(type: "macro", id: Id): _Macro | undefined;
  function getObj(type: "page", id: Id): _Page | undefined;
  function getObj(type: "pathv2", id: Id): _Pathv2 | undefined;
  function getObj(type: "pin", id: Id): _Pin | undefined;
  function getObj(type: "player", id: Id): _Player | undefined;
  function getObj(type: "rollabletable", id: Id): _RollableTable | undefined;
  function getObj(type: "tableitem", id: Id): _TableItem | undefined;
  function getObj(type: "text", id: Id): _Text | undefined;
  function getObj(type: "window", id: Id): Roll20Window | undefined;

  /**
   * Pass this function a list of attributes, and it will return all objects that match as an array. Note that this operates on all objects of all types across all pages -- so you probably want to include at least a filter for _type and _pageid if you're working with tabletop objects.
   *
   * var currentPageGraphics = findObjs({
   *   _pageid: Campaign().get("playerpageid"),
   *   _type: "graphic",
   * });
   * _.each(currentPageGraphics, function(obj) {
   *   //Do something with obj, which is in the current page and is a graphic.
   * });
   * You can also pass in an optional second argument which contains an object with a list of options, including:
   * caseInsensitive (true/false): If true, string properties will be compared without regard for the case of the string
   * var targetTokens = findObjs({
   *     name: "target"
   * }, {caseInsensitive: true});
   * //Returns all tokens with a name of 'target', 'Target', 'TARGET', etc.
   *
   * @param {Record<string, unknown>} attributes An object containing a list of attributes to filter by. For example, if you want to find all graphics on the current page, you would pass in {_pageid: Campaign().get("playerpageid"), _type: "graphic"}.
   * @returns {AllObjects[]} An array of all objects that match the provided attributes.
   */
  function findObjs(attributes: Record<string, unknown>): AllObjects[];

  /**
   * Will execute the provided callback function on each object, and if the callback returns true, the object will be included in the result array. Currently, it is inadvisable to use filterObjs() for most purposes – due to the fact that findObjs() has some built-in indexing for better executing speed, it is almost always better to use findObjs() to get objects of the desired type first, then filter them using the native .filter() method for arrays.
   *
   * var results = filterObjs(function(obj) {
   *   if(obj.get("left") < 200 && obj.get("top") < 200) return true;
   *   else return false;
   * });
   * //Results is an array of all objects that are in the top-left corner of the tabletop.
   *
   * @param {(obj: AllObjects) => boolean} callback A function which will be executed on each object. If the function returns true, the object will be included in the result array.
   * @returns {AllObjects[]} An array of all objects for which the callback function returned true.
   * @deprecated Due to the fact that findObjs() has some built-in indexing for better executing speed, it is almost always better to use findObjs() to get objects of the desired type first, then filter them using the native .filter() method for arrays.
   */
  function filterObjs(callback: (obj: AllObjects) => boolean): AllObjects[];

  /**
   * Returns an array of all the objects in the Game (all types). Equivalent to calling filterObjs and just returning true for every object.
   * @returns {AllObjects[]} An array of all objects in the game.
   */
  function getAllObjs(): AllObjects[];

  /**
   * Gets the value of an attribute, using the default value from the character sheet if the attribute is not present. value_type is an optional parameter, which you can use to specify "current" or "max".
   * getAttrByName will only get the value of the attribute, not the attribute object itself. If you wish to reference properties of the attribute other than "current" or "max", or if you wish to change properties of the attribute, you must use one of the other functions above, such as findObjs.
   *
   * For repeating sections, you can use the format repeating_section_$n_attribute, where n is the repeating row number (starting with zero). For example, repeating_spells_$2_name will return the value of name from the third row of repeating_spells.
   *
   * You can achieve behavior equivalent to getAttrByNamewith the following:
   *
   * // current and max are completely dependent on the attribute and game system
   * // in question; there is no function available for determining them automatically
   * function myGetAttrByName(character_id,
   *                          attribute_name,
   *                          attribute_default_current,
   *                          attribute_default_max,
   *                          value_type) {
   *     attribute_default_current = attribute_default_current || '';
   *     attribute_default_max = attribute_default_max || '';
   *     value_type = value_type || 'current';
   *
   *     var attribute = findObjs({
   *         type: 'attribute',
   *         characterid: character_id,
   *         name: attribute_name
   *     }, {caseInsensitive: true})[0];
   *     if (!attribute) {
   *         attribute = createObj('attribute', {
   *             characterid: character_id,
   *             name: attribute_name,
   *             current: attribute_default_current,
   *             max: attribute_default_max
   *         });
   *     }
   *
   *     if (value_type == 'max') {
   *         return attribute.get('max');
   *     } else {
   *         return attribute.get('current');
   *     }
   * }
   *
   * @param {Id} character_id The ID of the character whose attribute you want to get.
   * @param {keyof _Character} attribute_name The name of the attribute you want to get.
   * @param {("current" | "max")} value_type The type of value you want to get.
   * @returns {string | number} The value of the attribute.
   */
  function getAttrByName(
    character_id: Id,
    attribute_name: keyof _Character,
    value_type?: "current" | "max"
  ): string | number;

  /**
   * Logs a message to the Mod (API) console.
   * @param {unknown} message MESSAGE(varies) The message to post to the Mod (API) console. The message parameter will be transformed into a String with JSON.stringify.
   * @returns {void}
   * @example
   * on('chat:message', function(msg) {
   *     log('Message received from:');
   *     log(getObj('player', msg.playerid));
   * });
   * "Message received from:"
   * {"_d20userid":"123456","_displayname":"John Doe","speakingas":"","_online":true,"color":"#885b68","_macrobar":"-J16Z-dRU5tleKiKOg0X|-K3F_4q_b1p-Vdiwgn1t","showmacrobar":true,"_id":"-J16Z-dRU5tleKiKOc0X","_type":"player","_lastpage":""}
   */
  function log(message: unknown): void;

  /**
   * Registers an event handler.
   * @param {EventType} event
   * @param {Function} listener
   * @see EventType
   */
  function on(event: "ready", listener: () => void): void;

  function on(
    event: "add:ability",
    listener: (ability: _Ability) => void
  ): void;
  function on(
    event: "add:attribute",
    listener: (attribute: _Attribute) => void
  ): void;
  function on(event: "add:card", listener: (card: _Card) => void): void;
  function on(
    event: "add:character",
    listener: (character: _Character) => void
  ): void;
  function on(
    event: "add:custfx",
    listener: (customFx: _CustomFx) => void
  ): void;
  function on(event: "add:deck", listener: (deck: _Deck) => void): void;
  function on(event: "add:door", listener: (door: _Door) => void): void;
  function on(
    event: "add:graphic",
    listener: (graphic: _Graphic) => void
  ): void;
  function on(event: "add:hand", listener: (hand: _Hand) => void): void;
  function on(
    event: "add:handout",
    listener: (handout: _Handout) => void
  ): void;
  function on(
    event: "add:jukeboxtrack",
    listener: (jukeboxTrack: _JukeboxTrack) => void
  ): void;
  function on(event: "add:macro", listener: (macro: _Macro) => void): void;
  function on(event: "add:page", listener: (page: _Page) => void): void;
  function on(event: "add:path", listener: (pathv2: _Pathv2) => void): void;
  function on(event: "add:pin", listener: (pin: _Pin) => void): void;
  function on(event: "add:player", listener: (player: _Player) => void): void;
  function on(
    event: "add:rollabletable",
    listener: (rollableTable: _RollableTable) => void
  ): void;
  function on(
    event: "add:tableitem",
    listener: (tableItem: _TableItem) => void
  ): void;
  function on(event: "add:text", listener: (text: _Text) => void): void;
  function on(
    event: "add:window",
    listener: (window: Roll20Window) => void
  ): void;

  function on(
    event: "destroy:ability",
    listener: (ability: _Ability) => void
  ): void;
  function on(
    event: "destroy:attribute",
    listener: (attribute: _Attribute) => void
  ): void;
  function on(event: "destroy:card", listener: (card: _Card) => void): void;
  function on(
    event: "destroy:character",
    listener: (character: _Character) => void
  ): void;
  function on(
    event: "destroy:custfx",
    listener: (customFx: _CustomFx) => void
  ): void;
  function on(event: "destroy:deck", listener: (deck: _Deck) => void): void;
  function on(event: "destroy:door", listener: (door: _Door) => void): void;
  function on(
    event: "destroy:graphic",
    listener: (graphic: _Graphic) => void
  ): void;
  function on(event: "destroy:hand", listener: (hand: _Hand) => void): void;
  function on(
    event: "destroy:handout",
    listener: (handout: _Handout) => void
  ): void;
  function on(
    event: "destroy:jukeboxtrack",
    listener: (jukeboxTrack: _JukeboxTrack) => void
  ): void;
  function on(event: "destroy:macro", listener: (macro: _Macro) => void): void;
  function on(event: "destroy:page", listener: (page: _Page) => void): void;
  function on(event: "destroy:path", listener: (pathv2: _Pathv2) => void): void;
  function on(event: "destroy:pin", listener: (pin: _Pin) => void): void;
  function on(
    event: "destroy:player",
    listener: (player: _Player) => void
  ): void;
  function on(
    event: "destroy:rollabletable",
    listener: (rollableTable: _RollableTable) => void
  ): void;
  function on(
    event: "destroy:tableitem",
    listener: (tableItem: _TableItem) => void
  ): void;
  function on(event: "destroy:text", listener: (text: _Text) => void): void;
  function on(
    event: "destroy:window",
    listener: (window: Roll20Window) => void
  ): void;

  function on<T extends AllObjects>(
    event: EventType,
    listener: (changed: T, previous: T) => void
  ): void;

  function on(
    event: "chat:message",
    listener: (msg: ChatMessage) => void
  ): void;

  /**
   *
   * @param callback CALLBACK(Function) The function that will be called when the current 'stack' of Sheet Worker Scripts completes.
   * @returns {void}
   * @example
   * This function is intended to be called prior to setWithWorker. The callback function will be called only once.
   * var myCharacter = ...,
   *     mySourceAttr = findObjs({ type: 'attribute', characterid: myCharacter.id, name: 'mySourceAttribute' })[0];
   *
   * onSheetWorkerCompleted(function() {
   *     var calculatedAttr = findObjs({ type: 'attribute', characterid: myCharacter.id, name: 'myCalculatedAttribute' })[0];
   *     // do something with calculatedAttr.get('current');
   * });
   * mySourceAttr.setWithWorker({ current: 5 });
   */
  function onSheetWorkerCompleted(callback: () => void): void;

  /**
   *
   * @param playerId PLAYER_ID(String) The id of the player Roll20 object to check.
   * @returns {boolean} true if the player currently has GM permissions, or false otherwise.
   * @example
   * This function is especially useful for limiting Mod (API) commands to GM use.
   * on('chat:message', function(msg) {
   *     if (msg.type !== 'api') return;
   *
   *     if (msg.content.indexOf('!playercommand') === 0) {
   *         // ...
   *     } else if (msg.content.indexOf('!gmcommand') === 0) {
   *         if (!playerIsGM(msg.playerid)) return;
   *         // ...
   *     }
   * });
   */
  function playerIsGM(playerId: Id): boolean;

  /**
   *
   * @param playlist PLAYLIST_ID(String) The id of the playlist to start playing.
   * @returns {void}
   * @example
   * var playlists = JSON.parse(Campaign().get('jukeboxfolder')),
   *     myPlaylist = _.find(playlists, (folder) => _.isObject(folder) && folder.n === myPlaylistName);
   * playJukeboxPlaylist(myPlaylist.id);
   */
  function playJukeboxPlaylist(playlist: Id): void;
}
