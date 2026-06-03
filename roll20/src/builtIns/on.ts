import type { Ability } from "./ability";
import type { Attribute } from "./attribute";
import type { Card } from "./card";
import type { Character } from "./character";
import type { ChatMessage } from "./chat";
import type { CustomFx } from "./customFx";
import type { Deck } from "./deck";
import type { Door, Roll20Window } from "./doorAndWindow";
import type { Graphic } from "./graphic";
import type { Hand } from "./hand";
import type { Handout } from "./handout";
import type { JukeboxTrack } from "./jukebox";
import type { Macro } from "./macro";
import type { Page } from "./page";
import type { Pathv2 } from "./pathV2";
import type { Pin } from "./pin";
import type { Player } from "./player";
import type { AllObjects, ObjectType } from "./roll20Objects";
import type { RollableTable, TableItem } from "./rollableTable";
import type { Text } from "./text";

type ObjectTypeMap = {
  ability: Ability;
  attribute: Attribute;
  card: Card;
  character: Character;
  custfx: CustomFx;
  deck: Deck;
  door: Door;
  graphic: Graphic;
  hand: Hand;
  handout: Handout;
  jukeboxtrack: JukeboxTrack;
  macro: Macro;
  page: Page;
  path: Pathv2;
  pin: Pin;
  player: Player;
  rollabletable: RollableTable;
  tableitem: TableItem;
  text: Text;
  window: Roll20Window;
};

/**
 * Resolves to the union of all non-readonly, non-method keys of T.
 * Uses the conditional type assignability trick to detect the readonly modifier.
 */
type WritableKeysOf<T> = {
  [K in keyof T]-?: (<G>() => G extends { [Q in K]: T[K] } ? 1 : 2) extends
    (<G>() => G extends { -readonly [Q in K]: T[K] } ? 1 : 2)
    ? K
    : never;
}[keyof T];

type ObjectBaseEvent = "change" | "add" | "destroy";

export type EventType =
  | "ready"
  | "chat:message"
  | `${ObjectBaseEvent}:${ObjectType}`
  | {
      [OT in ObjectType]: `change:${OT}:${Exclude<
        string & WritableKeysOf<ObjectTypeMap[OT]>,
        "get" | "set"
      >}`;
    }[ObjectType];

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
