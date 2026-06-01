import { Id, IdList } from "./ids";
import { Roll20BaseObject } from "./roll20Objects";

type DarknessEffect = "none" | "darkfog" | "lightfog";

/**
 * One of "foure", "pythagorean" (Euclidean), "threefive", or "manhattan".
 * @default "foure"
 */
type DiagonalType = "foure" | "pythagorean" | "threefive" | "manhattan";

type ExplorerMode = "off" | "basic";

/**
 * One of "square", "hex", or "hexr". (hex corresponds to Hex(V), and hexr corresponds to Hex(H)).
 * @default "square"
 */
type GridType = "square" | "hex" | "hexr";

/**
 * Controls the Page Play on Load. Options include ‘nonestopall’ or the id-of-the-track
 */
type JukeboxTrigger = "nonestopall" | Id;

export interface Page extends Roll20BaseObject {
  /**
   * Read only
   */
  _type: "page";

  /**
   * Comma-delimited list of IDs specifying the ordering of objects on the page. toFront and toBack (and their associated context menu items) can re-order this list. Read-only.
   * @default ""
   */
  _zorder: IdList;

  /**
   * Hexadecimal color of the map background.
   * @default "#FFFFFF"
   */
  background_color: string;

  /**
   * Whether daylight mode is enabled.
   * @default false
   */
  daylight_mode_enabled: boolean;

  /**
   * The opacity of the daylight mode.
   * @default 1
   */
  daylightModeOpacity: number;

  /**
   * The effect of the darkness. Options include "none", "darkfog", "lightfog".
   * @default "none"
   */
  darknessEffect: DarknessEffect;

  /**
   * One of "foure", "pythagorean" (Euclidean), "threefive", or "manhattan".
   * @default "foure"
   */
  diagonaltype: DiagonalType;

  /**
   * Whether dynamic lighting is enabled.
   * @default false
   */
  dynamic_lighting_enabled: boolean;

  /**
   * Opacity of the fog of war for the GM.
   * @default 0.35
   */
  fog_opacity: number;

  /**
   * The mode of the explorer. Options include "off" or "basic".
   * @default "off"
   */
  explorer_mode: ExplorerMode;

  /**
   * Whether the page has been put into archive storage.
   * @default false
   */
  archived: boolean;

  /**
   * Opacity of the grid lines.
   * @default 0.5
   */
  grid_opacity: number;

  /**
   * Hexadecimal color of the grid lines.
   * @default "#C0C0C0"
   */
  gridcolor: string;

  /**
   * Show grid labels for hexagonal grid.
   * @default false
   */
  gridlabels: boolean;

  /**
   * One of "square", "hex", or "hexr". (hex corresponds to Hex(V), and hexr corresponds to Hex(H)).
   * @default "square"
   */
  grid_type: GridType;

  /**
   * If true anywhere a token can "see" it is assumed there is bright light present.
   * @default false
   */
  lightglobalillum: boolean;

  /**
   * Don't allow objects that have sight to move through Dynamic Lighting walls.
   * @default false
   */
  lightrestrictmove: boolean;

  /**
   * Enforce Line of Sight for objects.
   * @default false
   */
  lightenforcelos: boolean;

  /**
   * Only update Dynamic Lighting when an object is dropped.
   * @default false
   */
  lightupdatedrop: boolean;

  /**
   * Controls the Page Play on Load. Options include ‘nonestopall’ or the id-of-the-track.
   * @default ""
   */
  jukeboxtrigger: JukeboxTrigger;

  /**
   * Page's title.
   * @default ""
   */
  name: string;

  /**
   * The distance of one unit.
   * @default 5
   */
  scale_number: number;

  /**
   * The type of units to use for the scale.
   * @default "ft"
   */
  scale_units: string;

  /**
   * Show fog of war on the map.
   * @default false
   */
  showdarkness: boolean;

  /**
   * Show the grid on the map.
   * @default true
   */
  showgrid: boolean;

  /**
   * Use dynamic lighting.
   * @default false
   */
  showlighting: boolean;

  /**
   * Size of a grid space in units.
   * @default 1
   */
  snapping_increment: number;

  /**
   * Width in units.
   * @default 25
   */
  width: number;
}

type _Page = Page;
declare global {
  type Page = _Page;
}
