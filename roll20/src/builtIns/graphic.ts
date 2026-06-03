import { AvatarImgSrc } from "./avatarImgSrc";
import { BioGmNotesNotes } from "./bioGmNotesNotes";
import { Color, ColorOrTransparent } from "./colors";
import { ControlledObject } from "./controlledObject";
import { Rect } from "./coordinateAndRect";
import { Id } from "./ids";
import { CreatableRoll20Object } from "./roll20Objects";

type Angle = number | "";
type AuraOptions = "circle" | "square";
type BarLocation = "overlap_top" | "overlap_bottom" | "bottom" | "";
type SubType = "token" | "card";

/**
 * Token/Map/Card/Etc.
 *
 * Important Notes About Linked Characters + Tokens
 * Note that for tokens that are linked to Characters, the controlledby field on the token is overridden by the controlledby field on the Character.
 * For token bars (e.g. bar1_value and bar1_max) where the token is linked to an Attribute (e.g. bar1_link is set), setting a value to the bar will automatically update the underlying Attribute's current and/or max values as well, so you don't have to set both manually.
 * In addition, when the Attribute (or token bar) is modified in-game, you will hear a change:attribute (and property-specific, e.g. change:attribute:current) event, followed by a change:graphic (and change:graphic:bar1_value) event. You can choose to respond to either event, but the underlying bar values will not yet be updated when the attribute event fires, since it fires first.
 *
 * Important Notes About Status Markers
 * As of August 6, 2013 the way that status markers on tokens are handled has changed. The "statusmarkers" property of the Graphic object is now a comma-delimited list of all status marker colors/icons that should be active on the token. The format is as follows:
 * //Comma-delimited (use join to create or split to turn into an array).
 * //If a status icon/color is followed by an "@" symbol, the number after
 * //"@" will be shown as the badge on the icon
 * statusmarkers = "red,blue,skull,dead,brown@2,green@6"
 * While you can access the statusmarkers property directly, to maintain backward-compatibility with existing scripts, and to provide an easy way to work with the status markers without needing to write code to handle splitting up and parsing the string yourself, we provide a set of "virtual" properties on the object that you can set/get to work with the status markers. Each status marker has a "status_<markername>" property. For example:
 *
 * obj.get("status_red"); //Will return false if the marker is not active, true if it is, and a string (e.g. "2" or "5") if there is currently a badge set on the marker
 * obj.get('status_bluemarker'); //Is still supported for backwards compatability, and is equivalent to doing obj.get("status_blue");
 * obj.set("status_red", false); //would remove the marker
 * obj.set("status_skull", "2"); //would set a badge of "2" on the skull icon, and add it to the token if it's not already active.
 * Note that these virtual properties do not have events, so you must use change:graphic:statusmarkers to listen for changes to the status markers of a token, and for example change:graphic:status_red is NOT a valid event and will never fire.
 */
export interface Graphic extends ControlledObject, CreatableRoll20Object, Rect {
  /**
   * Read only
   * @readonly
   */
  readonly type: "graphic";
  /**
   * May be "token" (for tokens and maps) or "card" (for cards). Read-only.
   * @readonly
   */
  readonly subtype: SubType;
  /**
   * Set to an ID if the graphic is a card. Read-only.
   * @readonly
   */
  readonly cardid: Id;

  /**
   * The radius around a token where Advanced Fog of War is revealed.
   * @default ""
   */
  adv_fow_view_distance: number | "";

  /**
   * Color of the aura. Use the string "transparent" or a hex color as a string, for example "#000000".
   * @default "transparent"
   */
  aura1_color: Color | "";

  /**
   * Sets the shape of an aura. Valid options are "circle" or "square". Note: Kept in sync with "aura1_square"
   */
  aura1_options: AuraOptions;

  /**
   * Radius of the aura, using the units set in the page's settings. May be an integer or a float. Set to the empty string to clear the aura.
   * @default ""
   */
  aura1_radius: number | "";

  /**
   * Is the aura a circle or a square?
   */
  aura1_square: boolean;

  /**
   * Color of the aura. Use the string "transparent" or a hex color as a string, for example "#000000".
   * @default "transparent"
   */
  aura2_color: Color | "";

  /**
   * Sets the shape of an aura. Valid options are "circle" or "square". Note: Kept in sync with "aura2_square"
   */
  aura2_options: AuraOptions;

  /**
   * Radius of the aura, using the units set in the page's settings. May be an integer or a float. Set to the empty string to clear the aura.
   * @default ""
   */
  aura2_radius: number | "";

  /**
   * Is the aura a circle or a square?
   */
  aura2_square: boolean;

  /**
   * Set to an ID if Bar 1 is linked to a character.
   * @default ""
   */
  bar1_link: Id;

  /**
   * Maximum value of Bar 1. If _value and _max are both set, a bar may be displayed above the token showing the percentage of Bar 1.
   * @default ""
   */
  bar1_max: number;

  /**
   * Current value of Bar 1. This may be a number or text.
   * @default ""
   */
  bar1_value: number | string;

  /**
   * Set to an ID if Bar 2 is linked to a character.
   * @default ""
   */
  bar2_link: Id;

  /**
   * Maximum value of Bar 2. If _value and _max are both set, a bar may be displayed above the token showing the percentage of Bar 2.
   * @default ""
   */
  bar2_max: number;

  /**
   * Current value of Bar 2. This may be a number or text.
   * @default ""
   */
  bar2_value: number | string;

  /**
   * Set to an ID if Bar 3 is linked to a character.
   * @default ""
   */
  bar3_link: Id;

  /**
   * Maximum value of Bar 3. If _value and _max are both set, a bar may be displayed above the token showing the percentage of Bar 3.
   * @default "".
   */
  bar3_max: number;

  /**
   * Current value of Bar 3. This may be a number or text.
   * @default ""
   */
  bar3_value: number | string;

  /**
   * Set to an ID if Bar 4 is linked to a character.
   * @default ""
   */
  bar4_link: Id;

  /**
   * Maximum value of Bar 4. If _value and _max are both set, a bar may be displayed above the token showing the percentage of Bar 4.
   * @default ""
   */
  bar4_max: number;

  /**
   * Current value of Bar 4. This may be a number or text.
   * @default ""
   */
  bar4_value: number | string;

  /**
   * Adjusts the location of the token bars. Options include ’overlap_top’, ‘overlap_bottom’,‘bottom’.
   */
  bar_location: BarLocation;

  /**
   * This valude dictates the initial Opacity of graphics. It is active on any layer, not just the Foreground layer.
   * @default 1.0
   */
  base_opacity: number;

  /**
   * Adjusts whether the bar is compact or not. Other option is compact.
   */
  compact_bar: boolean;

  /**
   * 	Disable graphic snapping to grid.
   * @default false
   */
  disableSnapping: boolean;

  /**
   * Disable graphic token menu settings (token bubbles and radial menu).
   * @default false
   */
  disableTokenMenu: boolean;

  /**
   * Flip horizontally.
   * @default false
   */
  fliph: boolean;

  /**
   * Flip vertically.
   * @default false
   */
  flipv: boolean;

  /**
   * Notes on the token only visible to the GM.
   *
   * @see BioGmNotesNotes
   * @default ""
   */
  gmnotes: BioGmNotesNotes;

  /**
   * The URL of the graphic's image. See the note about imgsrc and avatar restrictions below.
   * @see AvatarImgSrc
   */
  imgsrc: AvatarImgSrc;

  /**
   * This property is changed from the Advanced context menu.
   * @default false
   */
  isdrawing: boolean;

  /**
   * The last move of the token. It's a comma-delimited list of coordinates. For example, "300,400" would mean that the token started its last move at left=300, top=400. It's always assumed that the current top + left values of the token are the "ending point" of the last move. Waypoints are indicated by multiple sets of coordinates. For example, "300,400,350,450,400,500" would indicate that the token started at left=300, top=400, then set a waypoint at left=350, top=450, another waypoint at left=400, top=500, and then finished the move at its current top + left coordinates.
   * @default ""
   */
  lastmove: string;

  /**
   * Angle (in degrees) of the light's angle. For example, "180" means the light would show only for the front "half" of the "field of vision".
   * @default "360"
   */
  light_angle: Angle;

  /**
   * Start of dim light radius. If light_dimradius is the empty string, the token will emit bright light out to the light_radius distance. If light_dimradius has a value, the token will emit bright light out to the light_dimradius value, and dim light from there to the light_radius value.
   * @default ""
   */
  light_dimradius: number | "";

  /**
   * The light has "sight" for controlling players for the purposes of the "Enforce Line of Sight" setting. Default: false.
   * @default false
   */
  light_hassight: boolean;

  /**
   * Angle (in degrees) of the field of vision of the graphic (assuming that light_hassight is set to true). Default: "360".
   * @default "360"
   */
  light_losangle: Angle;

  /**
   * Multiplier on the effectiveness of light sources. A multiplier of two would allow the token to see twice as far as a token with a multiplier of one, with the same light source. Default: "1".
   * @default "1"
   */
  light_multiplier: number;

  /**
   * Show the token's light to all players.
   * @default false
   */
  light_otherplayers: boolean;

  /**
   * Dynamic lighting radius.
   * @default ""
   */
  light_radius: number | "";

  /**
   * Multiplier on the effectiveness of light sources. A multiplier of 200 would allow the token to see twice as far as a token with a multiplier of 100, with the same light source.
   * @default 100
   */
  light_sensitivity_multiplier: number;

  /**
   * An option to lock a Graphic in place. Boolean true or false value.
   * @default false
   */
  lockMovement: boolean;

  /**
   * The token's name.
   * @default ""
   */
  name: string;

  /**
   * Changes the Night Vision Effect. Other options include “Dimming” and “Nocturnal”.
   * @default ""
   */
  night_vision_effect: "Dimming" | "Nocturnal" | "";

  /**
   * Allow controlling players to edit the token's Aura 1. Also shows Aura 1 to controlling players, even if showplayers_aura1 is false.
   * @default true
   */
  playersedit_aura1: boolean;

  /**
   * Allow controlling players to edit the token's Aura 2. Also shows Aura 2 to controlling players, even if showplayers_aura2 is false.
   * @default true
   */
  playersedit_aura2: boolean;

  /**
   * Allow controlling players to edit the token's Bar 1. Also shows Bar 1 to controlling players, even if showplayers_bar1 is false.
   * @default true
   */
  playersedit_bar1: boolean;

  /**
   * Allow controlling players to edit the token's Bar 2. Also shows Bar 2 to controlling players, even if showplayers_bar2 is false.
   * @default true
   */
  playersedit_bar2: boolean;

  /**
   * Allow controlling players to edit the token's Bar 3. Also shows Bar 3 to controlling players, even if showplayers_bar3 is false.
   * @default true
   */
  playersedit_bar3: boolean;

  /**
   * Allow controlling players to edit the token's Bar 4. Also shows Bar 4 to controlling players, even if showplayers_bar4 is false.
   * @default true
   */
  playersedit_bar4: boolean;

  /**
   * Allow controlling players to edit the token's name. Also shows the nameplate to controlling players, even if showplayers_name is false.
   * @default true
   */
  playersedit_name: boolean;

  /**
   * ID of the character this token represents.
   */
  represents: Id;

  /**
   * Whether the token's nameplate is shown.
   * @default false
   */
  showname: boolean;

  /**
   * Show Bar 1 to all players.
   * @default false
   */
  showplayers_bar1: boolean;

  /**
   * Show Bar 2 to all players.
   * @default false
   */
  showplayers_bar2: boolean;

  /**
   * Show Bar 3 to all players.
   * @default false
   */
  showplayers_bar3: boolean;

  /**
   * Show Bar 4 to all players.
   * @default false
   */
  showplayers_bar4: boolean;

  /**
   * Show Aura 1 to all players.
   * @default false
   */
  showplayers_aura1: boolean;

  /**
   * Show Aura 2 to all players.
   * @default false
   */
  showplayers_aura2: boolean;

  /**
   * Show the nameplate to all players.
   * @default false
   */
  showplayers_name: boolean;

  /**
   * A comma-delimited list of currently active statusmarkers. See StatusMarker.
   * @default ""
   * @see StatusMarker
   */
  statusmarkers: string;

  /**
   * Hexadecimal color, or "transparent". Will tint the color of the graphic.
   */
  tint_color: ColorOrTransparent;

  /**
   * A stringified JSON array containing an object for each token marker currently in the game:. You can find an example below.
   * @default ""
   */
  token_markers: string;
}

export type StatusMarker =
  | "red"
  | "blue"
  | "green"
  | "brown"
  | "purple"
  | "pink"
  | "yellow"
  | "dead"
  | "skull"
  | "sleepy"
  | "half-heart"
  | "half-haze"
  | "interdiction"
  | "snail"
  | "lightning-helix"
  | "spanner"
  | "chained-heart"
  | "chemical-bolt"
  | "death-zone"
  | "drink-me"
  | "edge-crack"
  | "ninja-mask"
  | "stopwatch"
  | "fishing-net"
  | "overdrive"
  | "strong"
  | "fist"
  | "padlock"
  | "three-leaves"
  | "fluffy-wing"
  | "pummeled"
  | "tread"
  | "arrowed"
  | "aura"
  | "back-pain"
  | "black-flag"
  | "bleeding-eye"
  | "bolt-shield"
  | "broken-heart"
  | "cobweb"
  | "broken-shield"
  | "flying-flag"
  | "radioactive"
  | "trophy"
  | "broken-skull"
  | "frozen-orb"
  | "rolling-bomb"
  | "white-tower"
  | "grab"
  | "screaming"
  | "grenade"
  | "sentry-gun"
  | "all-for-one"
  | "angel-outfit"
  | "archery-target";

type _Graphic = Graphic;
type _StatusMarker = StatusMarker;
declare global {
  type Graphic = _Graphic;
  type StatusMarker = _StatusMarker;

  /**
   * Moves a graphic object below all other graphics on the same tabletop layer.
   * @param {Graphic} obj The graphic to move.
   * @example
   * on('chat:message', function(msg) {
   *     if (msg.type === 'api' && msg.content === '!toback' && msg.selected) {
   *         _.each(msg.selected, (s) => {
   *             toBack(getObj(s._type, s._id));
   *         });
   *     }
   * });
   */
  function toBack(obj: Graphic): void;

  /**
   * Moves a graphic object above all other graphics on the same tabletop layer.
   * @param {Graphic} obj The graphic to move.
   * @example
   * on('ready', function() {
   *     on('add:graphic', function(obj) {
   *         toFront(obj);
   *     });
   * });
   */
  function toFront(obj: Graphic): void;
}
