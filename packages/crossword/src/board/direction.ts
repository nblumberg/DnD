export const ACROSS = 0 as const;
export const DOWN = 1 as const;
export type Direction = typeof ACROSS | typeof DOWN;
export type DirectionNumber = [Direction, number];
