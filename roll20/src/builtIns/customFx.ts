import { Roll20BaseObject } from "./roll20Objects";

export interface CustomFx extends Roll20BaseObject {
  _type: "custfx";

  /**
   * Javascript object describing the FX.
   * @default {}
   */
  definition: object;

  /**
   * The visible name for the FX in the FX Listing.
   * @default ""
   */
  name: string;
}
