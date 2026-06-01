import { Direction } from "./direction";

export interface Coordinates {
  x: number;
  y: number;
}

export interface Position extends Coordinates {
  direction: Direction;
}
