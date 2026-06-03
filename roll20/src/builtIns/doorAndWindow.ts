import { Color } from "./colors";
import { Coordinate } from "./coordinateAndRect";
import { Roll20Object } from "./roll20Objects";

/**
 * Note: Window and Door use an inverted axis compared to other types of objects. For instance, a top variable that would be 100 for another object is y -100 for window or door.
 */
export interface Roll20Window extends Roll20Object, Coordinate {
  /**
   * Read only
   * @readonly
   */
  readonly type: "window";
  color: Color;
  /**
   * Prevents players from being able to interact with the door.
   */
  isLocked: boolean;
  /**
   * Determines whether a player can move through this door.
   */
  isOpen: boolean;
  path: {
    handle0: Coordinate;
    handle1: Coordinate;
  };
}

/**
 * Note: Window and Door use an inverted axis compared to other types of objects. For instance, a top variable that would be 100 for another object is y -100 for window or door.
 */
export interface Door extends Omit<Roll20Window, "type"> {
  /**
   * Read only
   * @readonly
   */
  readonly type: "door";
  /**
   * Removes a door icon from player view and functions as a barrier.
   */
  isSecret: boolean;
}

type _Door = Door;
type _Roll20Window = Roll20Window;
declare global {
  type Door = _Door;
  type Window = _Roll20Window;
}
