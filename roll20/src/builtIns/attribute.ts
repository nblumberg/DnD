import { APIObject, CreatableRoll20Object } from "./roll20Objects";

/**
 *  Important: See the note below about working with Character Sheets for information on how Character Sheet default values affect the use of Attributes.
 */
export interface Attribute extends APIObject, CreatableRoll20Object {
  /**
   * Can be used to identify the object type or search for the object.
   * Read-only.
   * @default "attribute"
   * @readonly
   */
  type: "attribute";

  /**
   * ID of the character this attribute belongs to.
   * Read-only. Mandatory when using createObj.
   * @default ""
   * @readonly
   */
  characterid: string;

  /**
   * Name of the attribute.
   * @default "Untitled"
   */
  name: string;

  /**
   * The current value of the attribute.
   * Can be accessed in chat and macros with @{Character Name|Attribute Name}
   * or in abilities with @{Attribute Name}.
   * @default ""
   */
  current: string;

  /**
   * The max value of the attribute.
   * Can be accessed in chat and macros with @{Character Name|Attribute Name|max}
   * or in abilities with @{Attribute Name|max}.
   * @default ""
   */
  max: string;
}

type _Attribute = Attribute;
declare global {
  type Attribute = _Attribute;
}
