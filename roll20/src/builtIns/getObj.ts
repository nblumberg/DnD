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

declare global {
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
  function getObj(type: "ability", id: Id): Ability | undefined;
  function getObj(type: "attribute", id: Id): Attribute | undefined;
  function getObj(type: "card", id: Id): Card | undefined;
  function getObj(type: "character", id: Id): Character | undefined;
  function getObj(type: "custfx", id: Id): CustomFx | undefined;
  function getObj(type: "deck", id: Id): Deck | undefined;
  function getObj(type: "door", id: Id): Door | undefined;
  function getObj(type: "graphic", id: Id): Graphic | undefined;
  function getObj(type: "hand", id: Id): Hand | undefined;
  function getObj(type: "handout", id: Id): Handout | undefined;
  function getObj(type: "jukeboxtrack", id: Id): JukeboxTrack | undefined;
  function getObj(type: "macro", id: Id): Macro | undefined;
  function getObj(type: "page", id: Id): Page | undefined;
  function getObj(type: "pathv2", id: Id): Pathv2 | undefined;
  function getObj(type: "pin", id: Id): Pin | undefined;
  function getObj(type: "player", id: Id): Player | undefined;
  function getObj(type: "rollabletable", id: Id): RollableTable | undefined;
  function getObj(type: "tableitem", id: Id): TableItem | undefined;
  function getObj(type: "text", id: Id): Text | undefined;
  function getObj(type: "window", id: Id): Roll20Window | undefined;
}
