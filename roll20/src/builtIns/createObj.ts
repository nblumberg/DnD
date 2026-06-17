import { Ability } from "./ability";
import { Attribute } from "./attribute";
import { Character } from "./character";
import { Graphic } from "./graphic";
import { Handout } from "./handout";
import { Macro } from "./macro";
import { Pathv2 } from "./pathV2";
import { RollableTable, TableItem } from "./rollableTable";
import { Text } from "./text";

declare global {
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
  function createObj(type: "ability", attributes: Partial<Ability>): Ability;
  function createObj(
    type: "attribute",
    attributes: Partial<Attribute>
  ): Attribute;
  function createObj(
    type: "character",
    attributes: Partial<Character>
  ): Character;
  function createObj(type: "graphic", attributes: Partial<Graphic>): Graphic;
  function createObj(type: "handout", attributes: Partial<Handout>): Handout;
  function createObj(type: "macro", attributes: Partial<Macro>): Macro;
  function createObj(type: "path", attributes: Omit<Partial<Pathv2>, "points"> & { path: string }): Pathv2;
  function createObj(
    type: "rollabletable",
    attributes: Partial<RollableTable>
  ): RollableTable;
  function createObj(
    type: "tableitem",
    attributes: Partial<TableItem>
  ): TableItem;
  function createObj(type: "text", attributes: Partial<Text>): Text;
}
