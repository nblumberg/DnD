import { Color, ColorOrTransparent } from "./colors";
import { ControlledObject } from "./controlledObject";
import { Rect } from "./coordinateAndRect";
import { CreatableRoll20Object } from "./roll20Objects";

export interface Text extends CreatableRoll20Object, ControlledObject, Rect {
  /**
   * Read only
   */
  _type: "text";

  color: Color;

  /**
   * If this is not set, when later changing the value of the "text" property the font_size will shrink to 8. Possible values (Case is not important): "Arial", "Patrick Hand", "Contrail One", "Shadows Into Light", and "Candal". Specifying an invalid name results in an unnamed, monospaced serif font being used.
   * @default "Arial"
   */
  font_family: string;

  /**
   * For best results, stick to the preset sizes in the editing menu: 8, 10, 12, 14, 16, 18, 20, 22, 26, 32, 40, 56, 72, 100, 200, 300.
   * @default 16
   */
  font_size: number;

  stroke: ColorOrTransparent;

  text: string;
}

type _Text = Text;
declare global {
  type Text = _Text;
}
