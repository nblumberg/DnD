export type Color = "transparent" | string; // #RRGGBB

export type ColorAlpha = "transparent" | string; // #RRGGBBAA

export type ColorAlphaStructure = [number, number, number, number]; // red (0-255), green (0-255), blue (0-255), alpha (0-1)

export type ColorOrTransparent = "transparent" | Color;
