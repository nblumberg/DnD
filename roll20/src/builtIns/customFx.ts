import { ColorAlphaStructure } from "./colors";
import { Coordinate } from "./coordinateAndRect";
import { Id } from "./ids";
import { Roll20BaseObject } from "./roll20Objects";

interface CustomFxDefinition {
  /** The type of particle emitter to place. 
   * For built-in effects, this should be "type-color", where type is one of 
   * bomb, bubbling, burn, burst, explode, glow, missile, or nova 
   * and color is one of 
   * acid, blood, charm, death, fire, frost, holy, magic, slime, smoke, or water. 
   * For custom effects, this should be the id of the FX Roll20 object.
   * @note: beam, breath, and splatter types cannot be used with spawnFx. See spawnFxBetweenPoints instead.
   */
  type?: SpawnFxBuiltInTypes | Id;

  maxParticles?: number;
  size?: number;
  sizeRandom?: number;
  lifeSpan?: number;
  lifeSpanRandom?: number;
  speed?: number;
  speedRandom?: number;
  gravity?: Coordinate;
  angle?: number;
  angleRandom?: number;
  emissionRate?: number;
  startColour?: ColorAlphaStructure;
  startColourRandom?: ColorAlphaStructure;
  endColour?: ColorAlphaStructure;
  endColourRandom?: ColorAlphaStructure;
}

/**
 * A Roll20 FX object, which defines a custom visual effect that can be spawned with spawnFx and spawnFxBetweenPoints.
 */
export interface CustomFx extends Roll20BaseObject {
  _type: "custfx";

  /**
   * Javascript object describing the FX.
   * @default {}
   */
  definition: CustomFxDefinition;

  /**
   * The visible name for the FX in the FX Listing.
   * @default ""
   */
  name: string;
}

/**
 * The type of particle emitter to place. 
 * For built-in effects, this should be "type-color", where color is one of 
 * acid, blood, charm, death, fire, frost, holy, magic, slime, smoke, or water. * 
 */
const COLORS = ["acid", "blood", "charm", "death", "fire", "frost", "holy", "magic", "slime", "smoke", "water"] as const;

/**
 * The type of particle emitter to place. 
 * For built-in effects, this should be "type-color", where type is one of 
 * bomb, bubbling, burn, burst, explode, glow, missile, or nova
 */
const SPAWNFX_TYPES = ["bomb", "bubbling", "burn", "burst", "explode", "glow", "missile", "nova"] as const;

/**
 * The type of particle emitter to place. 
 * For built-in effects, this should be "type-color"
 * @see SPAWNFX_TYPES
 * @see COLORS
 */
const SPAWNFX_TYPE_COMBINATIONS = SPAWNFX_TYPES.flatMap((type) => COLORS.map((color) => `${type}-${color}` as const));


const SPAWNFXBETWEENPOINTS_TYPES = ["beam", "breath", "splatter"] as const;

/**
 * The type of particle emitter to place. 
 * For built-in effects, this should be "type-color"
 * @see SPAWNFXBETWEENPOINTS_TYPES
 * @see COLORS
 */
const SPAWNFXBETWEENPOINTS_TYPE_COMBINATIONS = SPAWNFXBETWEENPOINTS_TYPES.flatMap((type) => COLORS.map((color) => `${type}-${color}` as const));

/**
 * The type of particle emitter to place. 
 * For built-in effects, this should be "type-color", where type is one of 
 * bomb, bubbling, burn, burst, explode, glow, missile, or nova 
 * and color is one of 
 * acid, blood, charm, death, fire, frost, holy, magic, slime, smoke, or water. 
 * For custom effects, this should be the id of the FX Roll20 object.
 * @note: beam, breath, and splatter types cannot be used with spawnFx. See spawnFxBetweenPoints instead.
 */
export type SpawnFxBuiltInTypes = typeof SPAWNFX_TYPE_COMBINATIONS[number];

/**
 * The type of particle emitter to place. 
 * For built-in effects, this should be "type-color", where type is one of 
 * bomb, bubbling, burn, burst, explode, glow, missile, or nova 
 * and color is one of 
 * acid, blood, charm, death, fire, frost, holy, magic, slime, smoke, or water. 
 * For custom effects, this should be the id of the FX Roll20 object.
 * @note: beam, breath, and splatter types cannot be used with spawnFx. See spawnFxBetweenPoints instead.
 */
export type SpawnFxBetweenPointsBuiltInTypes = typeof SPAWNFXBETWEENPOINTS_TYPE_COMBINATIONS[number];

type _CustomFx = CustomFx;
declare global {
  type CustomFx = _CustomFx;

  /**
   * Spawns a particle emitter at the specified coordinates.
   * Built-in types follow the format "type-color" (e.g. "bubbling-acid").
   * Cannot be used with beam, breath, or splatter types; use spawnFxBetweenPoints for those.
   * @param {number} left The x-coordinate.
   * @param {number} top The y-coordinate.
   * @param {SpawnFxBuiltInTypes | Id} type The effect type string in "type-color" format.
   * @param {Id} [pageId] The page to spawn the effect on. Defaults to the current player page.
   * @example spawnFx(1400, 1400, 'bubbling-acid');
   */
  function spawnFx(left: number, top: number, type: SpawnFxBuiltInTypes | Id, pageId?: Id): void;

  /**
   * Spawns a particle emitter that travels from a start point to an end point.
   * Supports beam, breath, and splatter types in addition to those supported by spawnFx.
   * @param {Coordinate} start The starting coordinate.
   * @param {Coordinate} end The ending coordinate.
   * @param {SpawnFxBetweenPointsBuiltInTypes | Id} type The effect type string in "type-color" format.
   * @param {Id} [pageId] The page to spawn the effect on. Defaults to the current player page.
   * @example spawnFxBetweenPoints({ x: 1400, y: 1400 }, { x: 2100, y: 2100 }, 'beam-acid');
   */
  function spawnFxBetweenPoints(
    start: Coordinate,
    end: Coordinate,
    type: SpawnFxBetweenPointsBuiltInTypes | Id,
    pageId?: Id
  ): void;

  /**
   * Spawns a custom particle emitter at the specified coordinates using a definition object.
   * @param {number} left The x-coordinate.
   * @param {number} top The y-coordinate.
   * @param {object} definition An object describing the custom particle emitter properties.
   * @param {Id} [pageId] The page to spawn the effect on. Defaults to the current player page.
   * @example
   * // these two are equivalent
   * spawnFx(1400, 1400, 'bubbling-acid');
   * spawnFxWithDefinition(1400, 1400, {
   *     maxParticles: 200,
   *     size: 15,
   *     sizeRandom: 3,
   *     lifeSpan: 20,
   *     lifeSpanRandom: 5,
   *     speed: 7,
   *     speedRandom: 2,
   *     gravity: { x: 0.01, y: 0.65 },
   *     angle: 270,
   *     angleRandom: 35,
   *     emissionRate: 1,
   *     startColour:       [0, 35, 10, 1],
   *     startColourRandom: [0, 10, 10, 0.25],
   *     endColour:         [0, 75, 30, 0],
   *     endColourRandom:   [0, 20, 20, 0]
   * });
   */
  function spawnFxWithDefinition(
    left: number,
    top: number,
    definition: object,
    pageId?: Id
  ): void;
}
