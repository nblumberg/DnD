export const LEFT_2_RIGHT = 0 as const;
export const TOP_LEFT_2_BOTTOM_RIGHT = 1 as const;
export const TOP_2_BOTTOM = 2 as const;
export const TOP_RIGHT_2_BOTTOM_LEFT = 3 as const;
export const RIGHT_2_LEFT = 4 as const;
export const BOTTOM_RIGHT_2_TOP_LEFT = 5 as const;
export const BOTTOM_2_TOP = 6 as const;
export const BOTTOM_LEFT_2_TOP_RIGHT = 7 as const;
export type Direction =
  | typeof LEFT_2_RIGHT
  | typeof TOP_LEFT_2_BOTTOM_RIGHT
  | typeof TOP_2_BOTTOM
  | typeof TOP_RIGHT_2_BOTTOM_LEFT
  | typeof RIGHT_2_LEFT
  | typeof BOTTOM_RIGHT_2_TOP_LEFT
  | typeof BOTTOM_2_TOP
  | typeof BOTTOM_LEFT_2_TOP_RIGHT;
