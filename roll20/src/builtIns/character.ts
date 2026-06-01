import { AvatarImgSrc } from "./avatarImgSrc";
import { BioGmNotesNotes } from "./bioGmNotesNotes";
import { CreatableRoll20Object, Roll20BaseObject } from "./roll20Objects";

/**
 * Working with Character Sheets
 * The Character Sheets feature affects the usage of the Attributes object type, because the sheets have the capability of specifying a default value for each attribute on the sheet. However, if the attribute is set to the default value, there is not yet an actual Attribute object created in the game for that Character. We provide a convenience function which hides this complexity from you. You should use this function to get the value of an attribute going forward, especially if you know that a game is using a Character Sheet.
 *
 * getAttrByName(character_id, attribute_name, value_type)
 *
 * Simply specify the character's ID, the name (not ID) of the attribute (e.g. "HP" or "Str"), and then if you want the "current" or "max" for value_type. Here's an example:
 *
 * var character = getObj("character", "-JMGkBaMgMWiQdNDwjjS");
 * getAttrByName(character.id, "str"); // the current value of str, for example "12"
 * getAttrByName(character.id, "str", "max"); //the max value of str, for example "[[floor(@{STR}/2-5)]]"
 *
 * Note that fields which have auto-calculated values will return the formula rather than the result of the value. You can then pass that formula to sendChat() to use the dice engine to calculate the result for you automatically.
 *
 * Be sure to also look at the Character Sheet documentation for more information on how the Character Sheets interact with the API.
 *
 * getAttrByName will only get the value of the attribute, not the attribute object itself. If you wish to reference properties of the attribute other than "current" or "max", or if you wish to change properties of the attribute, you must use one of the other functions above, such as findObjs.
 *
 * In the case that the requested attribute does not exist, getAttrByName() will return undefined.
 */
export interface Character extends Roll20BaseObject, CreatableRoll20Object {
  /**
   * A JSON string that contains the data for the Character's default token if one is set. Note that this is a "blob" similar to "bio" and "notes", so you must pass a callback function to get(). Read-only.
   * @default ""
   */
  _defaulttoken: string;
  /**
   * Read only
   */
  _type: "character";

  /**
   * @default false
   */
  archived: boolean;

  /**
   * URL to an image used for the character. See the note about avatar and imgsrc restrictions below.
   * @see AvatarImgSrc
   * @default ""
   */
  avatar: AvatarImgSrc;

  /**
   * The character's biography. See the note below about accessing the Notes, GMNotes, and bio fields.
   * @see BioGmNotesNotes
   * @default ""
   */
  bio: BioGmNotesNotes;

  /**
   * Comma-delimited list of player IDs who can control and edit this character. Use "all" to give all players the ability to edit.
   * All Players is represented by having 'all' in the list.
   * @default ""
   */
  controlledby: string;

  /**
   * Notes on the character only viewable by the GM. See the note below about accessing the Notes, GMNotes, and bio fields.
   * @see BioGmNotesNotes
   * @default ""
   */
  gmnotes: BioGmNotesNotes;

  /**
   * Comma-delimited list of player IDs who can view this character. Use "all" to give all players the ability to view.
   * All Players is represented by having 'all' in the list.
   * @default ""
   */
  inplayerjournals: string;

  /**
   * @default ""
   */
  name: string;
}

type _Character = Character;
declare global {
  type Character = _Character;
}
