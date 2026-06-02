import { Ability } from "./ability";
import { Attribute } from "./attribute";
import { Card } from "./card";
import { Character } from "./character";
import { ChatMessage } from "./chat";
import { ControlledObject } from "./controlledObject";
import { CustomFx } from "./customFx";
import { Deck } from "./deck";
import { Door, Roll20Window } from "./doorAndWindow";
import { Graphic } from "./graphic";
import { Hand } from "./hand";
import { Handout } from "./handout";
import { JukeboxTrack } from "./jukebox";
import { Macro } from "./macro";
import { Page } from "./page";
import { Pathv2 } from "./pathV2";
import { Pin } from "./pin";
import { Player } from "./player";
import {
    AllObjects,
    APIObject,
    OBJECT_TYPES,
    ObjectType,
    Roll20Object,
} from "./roll20Objects";
import { RollableTable, TableItem } from "./rollableTable";
import { Text } from "./text";

const BASE_OBJECT_KEYS: (keyof APIObject)[] = ["id", "type"] as const;
const OBJECT_KEYS: (keyof Roll20Object)[] = [
  ...BASE_OBJECT_KEYS,
  "pageid",
] as const;
const CONTROLLED_OBJECT_KEYS: (keyof ControlledObject)[] = [
  ...OBJECT_KEYS,
  "controlledBy",
  "fadeOnOverlap",
  "fadeOpacity",
  "layer",
  "interactionManualReset",
  "interactionTriggered",
  "renderAsScenery",
  "rotation",
] as const;
const ABILITY_KEYS: (keyof Ability)[] = [
  ...BASE_OBJECT_KEYS,
  "characterid",
  "action",
  "description",
  "name",
  "istokenaction",
  "remove",
] as const;
const ATTRIBUTE_KEYS: (keyof Attribute)[] = [
  ...BASE_OBJECT_KEYS,
  "characterid",
  "name",
  "current",
  "max",
  "remove",
] as const;
const CARD_KEYS: (keyof Card)[] = [
  ...BASE_OBJECT_KEYS,
  "deckid",
  "avatar",
  "card_back",
  "name",
] as const;
const CHARACTER_KEYS: (keyof Character)[] = [
  ...BASE_OBJECT_KEYS,
  "defaulttoken",
  "archived",
  "avatar",
  "bio",
  "controlledby",
  "gmnotes",
  "inplayerjournals",
  "name",
  "remove",
] as const;
const CUSTOMFX_KEYS: (keyof CustomFx)[] = [
  ...BASE_OBJECT_KEYS,
  "definition",
  "name",
] as const;
const DECK_KEYS: (keyof Deck)[] = [
  ...BASE_OBJECT_KEYS,
  "cardSequencer",
  "currentDeck",
  "currentIndex",
  "currentCardShown",
  "discardPile",
  "avatar",
  "cardsplayed",
  "defaultheight",
  "defaultwidth",
  "discardpilemode",
  "gm_seefrontofcards",
  "gm_seenumcards",
  "infinitecards",
  "name",
  "players_seefrontofcards",
  "players_seenumcards",
  "playerscandraw",
  "showplayers",
  "shown",
] as const;
const DOOR_KEYS: (keyof Door)[] = [...OBJECT_KEYS, "isSecret"] as const;
const WINDOW_KEYS: (keyof Roll20Window)[] = [
  ...OBJECT_KEYS,
  "color",
  "isLocked",
  "isOpen",
  "path",
  "x",
  "y",
] as const;
const GRAPHIC_KEYS: (keyof Graphic)[] = [
  ...CONTROLLED_OBJECT_KEYS,
  "subtype",
  "cardid",
  "adv_fow_view_distance",
  "aura1_color",
  "aura1_options",
  "aura1_radius",
  "aura1_square",
  "aura2_color",
  "aura2_options",
  "aura2_radius",
  "aura2_square",
  "bar1_link",
  "bar1_max",
  "bar1_value",
  "bar2_link",
  "bar2_max",
  "bar2_value",
  "bar3_link",
  "bar3_max",
  "bar3_value",
  "bar4_link",
  "bar4_max",
  "bar4_value",
  "bar_location",
  "base_opacity",
  "compact_bar",
  "disableSnapping",
  "disableTokenMenu",
  "fliph",
  "flipv",
  "gmnotes",
  "imgsrc",
  "isdrawing",
  "lastmove",
  "light_angle",
  "light_dimradius",
  "light_hassight",
  "light_losangle",
  "light_multiplier",
  "light_otherplayers",
  "light_radius",
  "light_sensitivity_multiplier",
  "lockMovement",
  "name",
  "night_vision_effect",
  "playersedit_aura1",
  "playersedit_aura2",
  "playersedit_bar1",
  "playersedit_bar2",
  "playersedit_bar3",
  "playersedit_bar4",
  "playersedit_name",
  "represents",
  "showname",
  "showplayers_bar1",
  "showplayers_bar2",
  "showplayers_bar3",
  "showplayers_bar4",
  "showplayers_aura1",
  "showplayers_aura2",
  "showplayers_name",
  "statusmarkers",
  "tint_color",
  "token_markers",
  "top",
  "left",
  "bottom",
  "right",
  "remove",
] as const;
const HAND_KEYS: (keyof Hand)[] = [
  ...BASE_OBJECT_KEYS,
  "parentid",
  "currentHand",
  "currentView",
] as const;
const HANDOUT_KEYS: (keyof Handout)[] = [
  ...BASE_OBJECT_KEYS,
  "pins",
  "archived",
  "avatar",
  "controlledby",
  "gmnotes",
  "inplayerjournals",
  "name",
  "notes",
  "remove",
] as const;
const JUKEBBOXTRACK_KEYS: (keyof JukeboxTrack)[] = [
  ...BASE_OBJECT_KEYS,
  "loop",
  "playing",
  "softstop",
  "title",
  "volume",
] as const;
const MACRO_KEYS: (keyof Macro)[] = [
  ...BASE_OBJECT_KEYS,
  "playerid",
  "action",
  "istokenaction",
  "name",
  "visibleto",
  "remove",
] as const;
const PAGE_KEYS: (keyof Page)[] = [
  ...BASE_OBJECT_KEYS,
  "zorder",
  "background_color",
  "daylight_mode_enabled",
  "daylightModeOpacity",
  "darknessEffect",
  "diagonaltype",
  "dynamic_lighting_enabled",
  "fog_opacity",
  "explorer_mode",
  "archived",
  "grid_opacity",
  "gridcolor",
  "gridlabels",
  "grid_type",
  "lightglobalillum",
  "lightrestrictmove",
  "lightenforcelos",
  "lightupdatedrop",
  "jukeboxtrigger",
  "name",
  "scale_number",
  "scale_units",
  "showdarkness",
  "showgrid",
  "showlighting",
  "snapping_increment",
  "width",
] as const;
const PATHV2_KEYS: (keyof Pathv2)[] = [
  ...CONTROLLED_OBJECT_KEYS,
  "barrierType",
  "fill",
  "oneWayReversed",
  "points",
  "shape",
  "stroke",
  "stroke_width",
  "x",
  "y",
] as const;
const PIN_KEYS: (keyof Pin)[] = [
  ...OBJECT_KEYS,
  "autoNotesType",
  "bgColor",
  "customizationType",
  "gmNotes",
  "gmNotesDesynced",
  "gmNotesVisibleTo",
  "icon",
  "iconText",
  "imageDesynced",
  "imageVisibleTo",
  "link",
  "linkType",
  "nameplateVisibleTo",
  "notes",
  "notesDesynced",
  "notesVisibleTo",
  "pinImage",
  "scale",
  "shape",
  "subLink",
  "subLinkType",
  "title",
  "tooltipImage",
  "tooltipImageSize",
  "tooltipTitleVisibleTo",
  "tooltipVisibleTo",
  "useTextIcon",
  "visibleTo",
  "x",
  "y",
] as const;
const PLAYER_KEYS: (keyof Player)[] = [
  ...BASE_OBJECT_KEYS,
  "d20userid",
  "displayname",
  "lastpage",
  "macrobar",
  "online",
  "color",
  "showmacrobar",
  "speakingas",
] as const;
const ROLLABLETABLE_KEYS: (keyof RollableTable)[] = [
  ...BASE_OBJECT_KEYS,
  "name",
  "showplayers",
  "remove",
] as const;
const TABLEITEM_KEYS: (keyof TableItem)[] = [
  ...BASE_OBJECT_KEYS,
  "rollabletableid",
  "avatar",
  "name",
  "weight",
  "remove",
] as const;
const TEXT_KEYS: (keyof Text)[] = [
  ...CONTROLLED_OBJECT_KEYS,
  "font_family",
  "font_size",
  "text",
  "remove",
] as const;
const OBJECT_TYPE_TO_KEYS: Record<ObjectType, readonly string[]> = {
  ability: ABILITY_KEYS,
  attribute: ATTRIBUTE_KEYS,
  card: CARD_KEYS,
  character: CHARACTER_KEYS,
  custfx: CUSTOMFX_KEYS,
  deck: DECK_KEYS,
  door: DOOR_KEYS,
  graphic: GRAPHIC_KEYS,
  hand: HAND_KEYS,
  handout: HANDOUT_KEYS,
  jukeboxtrack: JUKEBBOXTRACK_KEYS,
  macro: MACRO_KEYS,
  page: PAGE_KEYS,
  path: PATHV2_KEYS,
  pin: PIN_KEYS,
  player: PLAYER_KEYS,
  rollabletable: ROLLABLETABLE_KEYS,
  tableitem: TABLEITEM_KEYS,
  text: TEXT_KEYS,
  window: WINDOW_KEYS,
} as const;

const READONLY_KEYS = new Set([
  "id", "type", "pageid",
  "characterid", "deckid", "defaulttoken",
  "cardSequencer", "currentDeck", "currentIndex", "currentCardShown", "discardPile",
  "subtype", "cardid", "parentid", "pins", "playerid",
  "zorder", "d20userid", "displayname", "lastpage", "macrobar", "online",
  "rollabletableid",
]);

const OBJECT_BASE_EVENT_TYPES = ["change", "add", "destroy"] as const;
const EVENT_OBJECT_TYPES = OBJECT_BASE_EVENT_TYPES.flatMap((baseEvent) =>
  OBJECT_TYPES.map((objectType) => `${baseEvent}:${objectType}` as const)
);
const EVENT_OBJECT_ATTRIBUTE_TYPES = EVENT_OBJECT_TYPES.flatMap((baseEvent) => {
  const objectType = baseEvent.split(":")[1] as ObjectType;
  const objectKeys = OBJECT_TYPE_TO_KEYS[objectType];
  const attributeKeys = objectKeys.filter((key) => !READONLY_KEYS.has(key));
  return attributeKeys.map(
    (attributeType) => `${baseEvent}:${attributeType}` as const
  );
});

/**
on
Parameters

EVENT(String) There are five types of event:readychangeadddestroychatWith the exception of ready, all event types must also be paired with an object type. For chat, this is always message. For everything else, this is the type property of a Roll20 object. In addition to the object type, changeevents can also optionally specify a property of the specified Roll20 object to watch.The 2-3 parts of the event (type, object, and optionally property) are separated by colons. So, valid event strings include but are not limited to "ready", "chat:message", "change:graphic", "change:campaign:playerpageid", "add:character", and "destroy:handout".CALLBACK(Function) The function that will be called when the specified event fires. The parameters passed depend on the event type:ready events have no callback parameters.change events have an obj parameter, which is a reference to the Roll20 object as it exists after the change, and a prev parameter, which is a plain old JavaScript object with properties matching the Roll20 object prior to the change event.add events have an obj parameter, which is a reference to the new Roll20 object.destroy events have an obj parameter, which is a reference to the no-longer existing Roll20 object.chat events have a msg parameter, which contains the details of the message that was sent to the chat.

Returns

(Void)

Examples

Events are fired in the order they were registered, and from most to least specific. In this example, a change to a graphic Roll20 object's left property will result in function3 getting called, followed by function1 and then function2.

on('change:graphic', function1);
on('change:graphic', function2);
on('change:graphic:left', function3);
add events will attempt to fire for Roll20 objects that are already in the campaign when a new session starts. In order to prevent this behavior, you can wait to register your add event until the ready event fires.

on('add:graphic', function(obj) {
    // When the session begins, this function will be called for every graphic in the campaign
    // This function will also be called whenever a new graphic Roll20 object is created
});

on('ready', function() {
    on('add:graphic', function(obj) {
        // This function will *only* be called when a new graphic Roll20 object is created, not for ones that already exist
    });
});
The pre parameter for change events is not a Roll20 object, it is a plain old JavaScript object. As such, you cannot use the get or set functions, and you cannot omit the leading underscores on read-only properties.

on('change:graphic', function(obj, prev) {
    var id1 = obj.id,         // all three are equivalent
        id2 = obj.get('id'),
        id3 = obj.get('_id'),

        id4 = prev.id,        // undefined
        id5 = prev.get('id'), // undefined is not a function
        id6 = prev._id;       // correct

    // both are equivalent
    obj.set('left', 70);
    obj.set({
        left: 70
    });

    prev.set('left', 70); // undefined is not a function
    prev.set({            // undefined is not a function
        left: 70
    });
    prev.left = 70;       // correct, although it won't change anything on the tabletop
});
For the async fields of character and handout Roll20 objects (notes, gmnotes, and bio), the prev parameter will not hold the data you need. (It will have a numeric identifier used by the system instead.) If you need to access the previous value of one of these fields, you will have to keep track of it yourself:

on('ready', function() {
    if (!state.example) state.example = { bioCache: {} };
});

on('change:character:bio', function(obj, prev) {
    obj.get('bio', function(text) {
        state.example.bioCache[obj.id] = text;

        // do stuff...

        if (shouldRevertBio()) {
            obj.set('bio', state.example.bioCache[obj.id]);
        }
    });
});
 */
export type EventType =
  | "ready"
  | "chat:message"
  | (typeof EVENT_OBJECT_TYPES)[number]
  | (typeof EVENT_OBJECT_ATTRIBUTE_TYPES)[number];

  declare global {
  /**
   * Registers an event handler.
   * @param {EventType} event
   * @param {Function} listener
   * @see EventType
   */
  function on(event: "ready", listener: () => void): void;

  function on(
    event: "add:ability",
    listener: (ability: Ability) => void
  ): void;
  function on(
    event: "add:attribute",
    listener: (attribute: Attribute) => void
  ): void;
  function on(event: "add:card", listener: (card: Card) => void): void;
  function on(
    event: "add:character",
    listener: (character: Character) => void
  ): void;
  function on(
    event: "add:custfx",
    listener: (customFx: CustomFx) => void
  ): void;
  function on(event: "add:deck", listener: (deck: Deck) => void): void;
  function on(event: "add:door", listener: (door: Door) => void): void;
  function on(
    event: "add:graphic",
    listener: (graphic: Graphic) => void
  ): void;
  function on(event: "add:hand", listener: (hand: Hand) => void): void;
  function on(
    event: "add:handout",
    listener: (handout: Handout) => void
  ): void;
  function on(
    event: "add:jukeboxtrack",
    listener: (jukeboxTrack: JukeboxTrack) => void
  ): void;
  function on(event: "add:macro", listener: (macro: Macro) => void): void;
  function on(event: "add:page", listener: (page: Page) => void): void;
  function on(event: "add:path", listener: (pathv2: Pathv2) => void): void;
  function on(event: "add:pin", listener: (pin: Pin) => void): void;
  function on(event: "add:player", listener: (player: Player) => void): void;
  function on(
    event: "add:rollabletable",
    listener: (rollableTable: RollableTable) => void
  ): void;
  function on(
    event: "add:tableitem",
    listener: (tableItem: TableItem) => void
  ): void;
  function on(event: "add:text", listener: (text: Text) => void): void;
  function on(
    event: "add:window",
    listener: (window: Roll20Window) => void
  ): void;

  function on(
    event: "destroy:ability",
    listener: (ability: Ability) => void
  ): void;
  function on(
    event: "destroy:attribute",
    listener: (attribute: Attribute) => void
  ): void;
  function on(event: "destroy:card", listener: (card: Card) => void): void;
  function on(
    event: "destroy:character",
    listener: (character: Character) => void
  ): void;
  function on(
    event: "destroy:custfx",
    listener: (customFx: CustomFx) => void
  ): void;
  function on(event: "destroy:deck", listener: (deck: Deck) => void): void;
  function on(event: "destroy:door", listener: (door: Door) => void): void;
  function on(
    event: "destroy:graphic",
    listener: (graphic: Graphic) => void
  ): void;
  function on(event: "destroy:hand", listener: (hand: Hand) => void): void;
  function on(
    event: "destroy:handout",
    listener: (handout: Handout) => void
  ): void;
  function on(
    event: "destroy:jukeboxtrack",
    listener: (jukeboxTrack: JukeboxTrack) => void
  ): void;
  function on(event: "destroy:macro", listener: (macro: Macro) => void): void;
  function on(event: "destroy:page", listener: (page: Page) => void): void;
  function on(event: "destroy:path", listener: (pathv2: Pathv2) => void): void;
  function on(event: "destroy:pin", listener: (pin: Pin) => void): void;
  function on(
    event: "destroy:player",
    listener: (player: Player) => void
  ): void;
  function on(
    event: "destroy:rollabletable",
    listener: (rollableTable: RollableTable) => void
  ): void;
  function on(
    event: "destroy:tableitem",
    listener: (tableItem: TableItem) => void
  ): void;
  function on(event: "destroy:text", listener: (text: Text) => void): void;
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
}
