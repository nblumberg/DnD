import { Ability } from "./ability";
import { Attribute } from "./attribute";
import { Card } from "./card";
import { Character } from "./character";
import { CustomFx } from "./customFx";
import { Deck } from "./deck";
import { Door, Roll20Window } from "./doorAndWindow";
import { Graphic } from "./graphic";
import { Hand } from "./hand";
import { Handout } from "./handout";
import { Id } from "./ids";
import { JukeboxTrack } from "./jukebox";
import { Macro } from "./macro";
import { Page } from "./page";
import { Pathv2 } from "./pathV2";
import { Pin } from "./pin";
import { Player } from "./player";
import { RollableTable, TableItem } from "./rollableTable";
import { Text } from "./text";

export interface APIObject {
  /**
   * A unique ID for this object. Globally unique across all objects in this game. Read-only.
   * @readonly
   */
  readonly id: Id;
  /**
   * Can be used to identify the object type or search for the object. Read-only.
   * @readonly
   */
  readonly type: string;

  get<K extends keyof this>(attribute: K): this[K];
  set<K extends keyof this>(attribute: K, value: this[K]): void;
  set(attributes: Partial<this>): void;
}

export interface Roll20Object extends APIObject {
  /**
   * ID of the page the object is in. Read-only.
   * @readonly
   */
  readonly pageid: Id;
}

export interface CreatableRoll20Object {
  /**
   * You can delete existing game objects using the .remove() function. The .remove() function works on all of the objects you can create with the createObj function. You call the function directly on the object. For example, mycharacter.remove();.
   */
  remove: () => void;
}

export type AllObjects =
  | Ability
  | Attribute
  | Card
  | Character
  | CustomFx
  | Deck
  | Door
  | Graphic
  | Hand
  | Handout
  | JukeboxTrack
  | Macro
  | Page
  | Pathv2
  | Pin
  | Player
  | RollableTable
  | TableItem
  | Text
  | Roll20Window;

export const CREATABLE_OBJECT_TYPES = [
  "ability",
  "attribute",
  "character",
  "graphic",
  "handout",
  "macro",
  "path",
  "rollabletable",
  "tableitem",
  "text",
] as const;

export const OBJECT_TYPES = [
  ...CREATABLE_OBJECT_TYPES,
  "card",
  "custfx",
  "deck",
  "door",
  "hand",
  "jukeboxtrack",
  "page",
  "pin",
  "player",
  "window",
] as const;

export type CreatableObjectType = (typeof CREATABLE_OBJECT_TYPES)[number];

export type ObjectType = (typeof OBJECT_TYPES)[number];
