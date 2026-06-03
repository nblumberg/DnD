import { IdList } from "./ids";
import { Roll20Object } from "./roll20Objects";

/**
 * Current layer, one of "gmlayer", "objects", "map", "walls", or "foreground". The walls layer is used for dynamic lighting, and paths on the walls layer will block light.
 */
type Layer = "gmlayer" | "objects" | "map" | "walls" | "foreground";

export interface ControlledObject extends Roll20Object {
  /**
   * Comma-delimited list of player IDs who can control the path. Controlling players may delete the path. If the path was created by a player, that player is automatically included in the list.
   * All Players is represented by having 'all' in the list.
   */
  controlledby: IdList;
  /**
   * When true, the overlapping of a object layer graphic's inner bound with the foreground layer object will cause its opacity to become the value in fadeOpacity.
   * When false, it will remain at full opacity regardless of overlap.
   * @default true.
   */
  fadeOnOverlap: boolean;
  /**
   * This value dictates the opacity of the object when it is overlapped by a graphic on the object layer, and fadeOnOverlap is set to true.
   * @default 0.3.
   */
  fadeOpacity: number;
  /**
   * Current layer. The walls layer is used for dynamic lighting, and paths on the walls layer will block light.
   * @default "objects".
   */
  layer: Layer;
  /**
   * When this is set to true it will reset interactions on the object
   * @default false.
   */
  interactionManualReset: boolean;
  /**
   * Will get set to true when an interaction is triggered
   * @default false.
   */
  interactionTriggered: boolean;
  /**
   * When true, this object will be obscured by dynamic lighting and the Hide/Reveal Mask.
   * @default false.
   */
  renderAsScenery: boolean;
  /**
   * Rotation (in degrees).
   * @default 0.
   */
  rotation: number;
}
