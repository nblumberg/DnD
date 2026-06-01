export interface Coordinate {
  x: number;
  y: number;
}

export interface Rect {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

/**
 * The points property is a JSON string containing an array of points. Points are represented as a two position array of an x and y location. A triangle from (0,0) to (0,70) to (70,0), and back to (0,0) would be represented as "[[0,0],[0,70],[70,0],[0,0]]".
 */
export type Points = Array<[number, number]>;
