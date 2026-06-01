import { Color, ColorOrTransparent } from "./colors";
import { ControlledObject } from "./controlledObject";
import { Coordinate } from "./coordinateAndRect";
import { CreatableRoll20Object } from "./roll20Objects";

type BarrierType = "wall" | "oneWay" | "transparent";

/**
 * The shape property has the following values:
 * "pol" - Polyline. A straight line is drawn between each consecutive point. If the starting point and ending point are the same, it creates a closed shape.
 * "free" - Freehand. A curve is drawn using the points as guides. If the starting point and ending point are the same, it creates a closed shape.
 * "eli" - Ellipse. An ellipse is draw using the points to set a bounding box. Only the first two points are used.
 * "rec" - Rectangle. A rectangle is draw using the points to set a bounding box. Only the first two points are used.
 */
type Shape = "" | "pol" | "free" | "eli" | "rect";

export interface Pathv2
  extends CreatableRoll20Object,
    ControlledObject,
    Coordinate {
  /**
   * Can be used to identify the object type or search for the object. Read-only.
   */
  _type: "pathv2";

  /**
   * Dynamic Lighting Barrier type
   */
  barrierType: BarrierType;

  /**
   * Fill color. Use the string "transparent" or a hex color as a string, for example "#000000".
   * @default "transparent"
   */
  fill: ColorOrTransparent;

  oneWayReversed: boolean;

  /**
   * A JSON string containing and array of x,y points used to create the path.
   */
  points: string;

  /**
   * Determines if the path is displayed as a polyline, freehand, ellipse, or rectangle.
   */
  shape: Shape;

  /**
   * Stroke (border) color.
   * @default "#000000"
   */
  stroke: Color;

  stroke_width: number;
}

type _Pathv2 = Pathv2;
declare global {
  type Pathv2 = _Pathv2;
}
