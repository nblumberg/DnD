import { ColorAlpha } from "./colors";
import { Coordinate } from "./coordinateAndRect";
import { All, Id } from "./ids";
import { Roll20Object } from "./roll20Objects";

/**
 * Valid Icon Values
 */
type PinIcon =
  | "base-dot"
  | "base-castle"
  | "base-skullSimple"
  | "base-spartanHelm"
  | "base-radioactive"
  | "base-heart"
  | "base-star"
  | "base-startSign"
  | "base-pin"
  | "base-speechBubble"
  | "base-file"
  | "base-plus"
  | "base-circleCross"
  | "base-dartBoard"
  | "base-badge"
  | "base-flagPin"
  | "base-crosshair"
  | "base-scrollOpen"
  | "base-diamond"
  | "base-photo"
  | "base-fourStarShort"
  | "base-circleStar"
  | "base-lock"
  | "base-crown"
  | "base-leaf"
  | "base-signpost"
  | "base-beer"
  | "base-compass"
  | "base-video"
  | "base-key"
  | "base-chest"
  | "base-village"
  | "base-swordUp"
  | "base-house"
  | "base-house2"
  | "base-church"
  | "base-government"
  | "base-blacksmith"
  | "base-stable"
  | "base-gear"
  | "base-bridge"
  | "base-mountain"
  | "base-exclamation"
  | "base-question";

/**
 * The pin object represents Map Pins, interactive markers that appear directly on the map. Pins can display images, show tooltips, contain GM notes, and can be linked to handouts in your journal. They can be visible or hidden, allowing for dramatic reveals, shedding light on a discovered location, or can be used as information markers for more interactive play. Additional information on pins can be found in the Help Center.
 * Note1: If you intend to use custom content in pins (to override Handout's image, notes and GM Notes), you must set at least one of the desynced properties to  true (which will set all of them).
 */
export interface Pin extends Roll20Object, Coordinate {
  /**
   * Read only
   * @readonly
   */
  type: "pin";

  /**
   * Format for automatically generated notes. Valid values: "" (empty string), "blockquote".
   * @default ""
   */
  autoNotesType: "" | "blockquote";

  /**
   * Pin background color (hex or "transparent"). Supports HTML color strings of either #RRGGBB or #RRGGBBAA (translucence)
   */
  bgColor: ColorAlpha;

  /**
   * Determines whether the pin displays the icon or the pinImage. Set pinImage to a valid image URL when using customizationType: "image". Toggling customizationType between "icon" and "image" does not clear pinImage; the URL is preserved
   */
  customizationType: "icon" | "image";

  /**
   * GM notes content associated with the pin.
   * @default ""
   */
  gmNotes: string;

  /**
   * Whether the pin's GM notes are desynced from its linked object. Setting any desynced property sets all three to the same value.
   * @default false
   */
  gmNotesDesynced: boolean;

  /**
   * Controls who can see GM notes. Valid values: "all", "" (empty string).
   * @default "all"
   */
  gmNotesVisibleTo: All | "";

  /**
   * Built-in icon when customizationType is "icon".
   * @default "base-dot"
   */
  icon: PinIcon;

  /**
   * Text label (first 3 characters used) when useTextIcon is true.
   * @default ""
   */
  iconText: string;

  /**
   * Whether the pin's image is desynced from its linked object. Setting any desynced property sets all three to the same value.
   * @default false
   */
  imageDesynced: boolean;

  /**
   * Controls who can see the image. Valid values: "all", "" (empty string).
   * @default "all"
   */
  imageVisibleTo: All | "";

  /**
   * The ID of a handout or other object this pin links to.
   */
  link: Id;

  /**
   * The type of object linked. Valid values: "handout", "" (empty string).
   * @default ""
   */
  linkType: "handout" | "";

  /**
   * Controls who can see the nameplate. Valid values: "all", "" (empty string).
   * @default "all"
   */
  nameplateVisibleTo: All | "";

  /**
   * Notes content associated with the pin.
   * @default ""
   */
  notes: string;

  /**
   * Whether the pin's notes are desynced from its linked object. Setting any desynced property sets all three to the same value.
   * @default false
   */
  notesDesynced: boolean;

  /**
   * Controls who can see the notes. Valid values: "all", "" (empty string).
   * @default "all"
   */
  notesVisibleTo: All | "";

  /**
   * Image URL shown when customizationType is "image".
   * @default ""
   */
  pinImage: string;

  /**
   * Scale factor for the pin. Must be between 0.25 and 2.0.
   * @default 1.0
   */
  scale: number;

  /**
   * Pin shape. Defaults to "teardrop".
   */
  shape: "teardrop" | "circle" | "diamond" | "square";

  /**
   * A sub-link identifier, typically used for linking to specific sections.
   * @default ""
   */
  subLink: string;

  /**
   * The type of sub-link. Valid values: "headerPlayer", "headerGM", "" (empty string).
   * @default ""
   */
  subLinkType: "headerPlayer" | "headerGM" | "";

  /**
   * The title text displayed on the pin.
   * @default ""
   */
  title: string;

  /**
   * Roll20 image identifier for the tooltip image displayed on the pin.
   * @default ""
   */
  tooltipImage: Id;

  /**
   * Size of the image in the pin's tooltip. Defaults to "medium".
   */
  tooltipImageSize: "small" | "medium" | "large" | "xl";

  /**
   * Controls who can see the tooltip title. Valid values: "all", "" (empty string).
   * @default "all"
   */
  tooltipTitleVisibleTo: All | "";

  /**
   * Controls who can see the tooltip. Valid values: "all", "" (empty string).
   * @default "all"
   */
  tooltipVisibleTo: All | "";

  /**
   * When useTextIcon is true, the pin displays a text label instead of an icon or image. That label is taken from iconText; only the first 3 characters are shown.
   *
   * @default false
   */
  useTextIcon: boolean;

  /**
   * Controls overall visibility. Valid values: "all", "" (empty string).
   * @default ""
   */
  visibleTo: All | "";
}

type _Pin = Pin;
declare global {
  type Pin = _Pin;
}
