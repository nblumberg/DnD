import { CreatableRoll20Object, Roll20BaseObject } from "./roll20Objects";

export interface Ability extends Roll20BaseObject, CreatableRoll20Object {
  /**
   * Can be used to identify the object type or search for the object.
   * Read-only.
   * @default "ability"
   */
  _type: "ability";

  /**
   * ID of the character this ability belongs to.
   * Read-only. Mandatory when using createObj.
   * @default ""
   */
  _characterid: string;

  /**
   * The text of the ability.
   * @default ""
   */
  action: string;

  /**
   * The description does not appear in the character sheet interface.
   * @default ""
   */
  description: string;

  /**
   * Name of the ability.
   * @default "Untitled_Ability"
   */
  name: string;

  /**
   * Is this ability a token action that should show up when tokens linked to its parent Character are selected?
   * @default false
   */
  istokenaction: boolean;
}

type _Ability = Ability;
declare global {
  type Ability = _Ability;
}
