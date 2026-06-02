import { ColorAlphaStructure } from "./colors";
import { Coordinate } from "./coordinateAndRect";
import { Id } from "./ids";
import { Roll20BaseObject } from "./roll20Objects";

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

const ALL_TYPES = [...SPAWNFX_TYPES, ...SPAWNFXBETWEENPOINTS_TYPES] as const;

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

interface Emitter {
  /**
   * 0 is for when you want a subEmitter attached to a particle, 1 indicates that it'll spawn at the end of a particle's life cycle
   */
  type: 0 | 1;

  /**
   * Set the +Y direction of the sub emitter equal to the direction the particle is/was heading true or false
   */
  inheritDirection: boolean;

  /**
   * determines how much of the existing particles speed should be added to the emitter particles
   */
  inheritedVelocityAmount: number;

  /**
   * other emitters you may be targeting by name. This will randomly choose one of these emitters when running on a particle
   */
  emitterNames: string[];
}
interface Gradient {
  gradient: number;
  factor: number;
}

/**
 * These properties (attributes of particle emission patterns) are shared between our Classic Tabletop custom Effects feature, and the new tabletop engine.
 */
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

  /**
   * Only available with the latest VTT Engine
   * 
   * This property is used in conjunction with the rulerType and denotes how much faster the effect should produce particles the longer the range of the effect is.
   */
  additionalEmissinRatePerPixel?: number;

  /**
   * Only available with the latest VTT Engine
   * 
   * This forces the alignment of each particle to match the angle it was fired upon.
   */
  alignParticles?: boolean; 

  /**
   * This is the angle at which the particle are ejected from the spawn point (your cursor). 
   * The angle is measured in degrees starting with 0 pointing to the right, 
   * so 90 is straight down, 180 is to the left, 270 is straight up. 
   * If you enter -1 for this value the system will ask you to "aim" it every time you use it. 
   * This is useful when you want to fire an effect in a different direction each time you use it.
   */
  angle?: number;

  /**
   * How much the particles spread from the original angle to either side. 
   * An angleRandom of 45 would result in a 90 degree fire arc centered on the original angle.
   */
  angleRandom?: number;

  /**
   * Only available with the latest VTT Engine
   * 
   * Name of an existing effect to base a new effect off of. You get all the properties of the baseEffect and you can additionally override other properties to add custom effects. For example our "Rocket" effect is based off of our "Missile" effect with an additional explosion onDeath.
   * @example
   * {
   * "name": "Rocket",
   * "baseEffect": "missile",
   * "onDeath": "explode",
   * }
   */
  baseEffect?: { name: string; } & Partial<CustomFxDefinition>;

  /**
   * This is how long the effect will last, even if the mouse is held down. 
   * This is mostly used with, and required for (if it's not set, or is -1 it will be defaulted to 25), 
   * aimed and for onDeath effects, since the mouse can't be held down, so they will last for the duration. 
   * The max duration in these instances is 50, which is just about 2 seconds. 
   * It can also be useful if you want the effect just to be a single burst of particles, 
   * like in the Bomb and Nova effects where the duration is just 10. 
   * If you set the duration to -1 the effect will last as long as you hold down the mouse button, 
   * otherwise the effect will stop after the duration has finished even if you hold down the button.
   * @max 50
   * @default 25
   */
  duration?: number;

  /**
   * This is a measure of how quickly particles are created and fired from the origin. 
   * This attribute ties closely with the maxParticles attribute because if that limit is reached the system 
   * will stop creating particles, so make sure that you set the max hight enough to support your emission rate.
   */
  emissionRate?: number;

  /**
   * Only available with the latest VTT Engine
   * 
   * Emit Rate Gradients define how the emit rate of the effect changes over the life of the effect’s duration similarly to the sizeGradient changing the size of particles over the lifespan of the individual particles. In the below example the effect would fire a burst of particles at the beginning and then taper off over its duration.
   * @example
   * [
   *   { "gradient": 0, "factor": 1 },
   *   { "gradient": 0.25, "factor": 0.2 },
   *   { "gradient": 1, "factor": 0 }
   * ]
   */
  emitRateGradients?: Gradient[];

  /**
   * Only available with the latest VTT Engine
   * 
   * Determines the size of the emitter box. It will be 2x the value as a square.
   * A value of 5 would result in a 10x10 pixel emitter box.
   */
  emitterSize?: number;

  /**
   * start/endColour defines the color of the particle when it is created and right before it is destroyed, 
   * respectively, using an array [Red, Green, Blue, Alpha]. The colors, RGB, use values between 0-255 and 
   * the Alpha channel is a decimal between 0-1. If you're looking for a specific color you can look up 
   * "hex color picker" in your favorite search engine and that should give you the numbers you're looking for. 
   * The colors will fade from the start value to the end value over the course of their life span. 
   * Since all of the particles are piled on top of each other to begin with the colors tend to be much lighter, 
   * turning into a ball of white, than you expect so you will want to use darker colors at least in the 
   * startColour block. There are a bunch of color examples at the end of this page, if you're looking for inspiration.
   */
  endColour?: ColorAlphaStructure;

  /**
   * The start and end randoms determine how much difference there is in the color of the particles at the beginning and end of their lifespans. Example:
   * 
   * startColour: [220, 35, 0, 1],
   * startColourRandom: [62, 0, 0, 0.25]
   * 
   * an effect with these values will range from an RGBA of
   * 
   * [158, 35, 0, 0.75] to
   * [255, 35, 0, 1]
   * 
   * resulting in a more varied color range for your effect’s particles.
   */
  endColourRandom?: ColorAlphaStructure;

  /**
   * This attribute is the only one that has 2 "sub-attributes", x and y. 
   * It has these 2 options because you are able to have the "gravity" work in any direction. 
   * You cannot use the 0 value for either of these attributes, so use 0.01 for "no gravity". 
   * X and Y both accept positive and negative values, a positive Y would pull the particles down 
   * where as a negative value would pull the particles up and it works the same way with X and left and right.
   */
  gravity?: Coordinate;

  /** 
   * Only available with the latest VTT Engine
   * 
   * Determines if the Effect should move from the start to end while firing particles along the path, only usable with aimed Effects.
   */
  isPointToPoint?: boolean;

  /**
   * lifeSpan defines how long, in a measure of time, a particle will last before it disappears. 
   * This attribute, combined with speed, will decide how far the particle will fly before it is destroyed.
   */
  lifeSpan?: number;

  /**
   * How much variation there is in the lifespan of individual particles.
   * If an effect has a lifespan of 10 and a lifeSpanRandom of 5 the particles will be alive for a span of 5-15.
   */
  lifeSpanRandom?: number;

  /**
   * maxParticles defines the total number of particles, for that specific effect, that can be on the board at one time. 
   * Once this max is reached the particles will stop being generated until some of already existing particles reach the 
   * end of their "life".
   */
  maxParticles?: number;

  /**
   * This is the only value that accepts a string, so make sure if you use it to wrap the value in "quotes" or it won't 
   * let you save. This is used, like in the Burst effect, to spawn an additional effect as soon as the original one 
   * finishes. The Burst effect is basically just the Burn effect with "onDeath": "explosion", so the Burn effect lasts 
   * until you let go of the mouse, after which it will spawn the Explosion effect at the same location. This the effect 
   * that is spawned in the onDeath sequence cannot be an "aimed" effect and must have a duration. If it has a -1 for 
   * either of these it will either be given a default or not work as intended. This also only works for other Custom FX, 
   * if multiple FX have the same name you are referencing it will only select the first one on the list.
   */
  onDeath?: typeof ALL_TYPES[number] | Id;

  /**
   * Only available with the latest VTT Engine
   * 
   * Determines how fast particles should spin, default is no spin.
   */
  rotationSpeed?: number;

  /**
   * Only available with the latest VTT Engine
   * 
   * This defines what the aiming interface presents as and supports
   */
  rulerType?: "cone" | "line" | "beam";

  /**
   * Only available with the latest VTT Engine
   * 
   * Determines how much wider the particles should be, is a multiplier to the base size.
   */
  scaleX?: number;

  /**
   * Only available with the latest VTT Engine
   * 
   * Determines how much taller the particles should be, is a multiplier to the base size.
   */
  scaleY?: number;

  /**
   * size defines the relative size of the particles that are created.
   */
  size?: number;

  /**
   * Only available with the latest VTT Engine
   * 
   * Size gradients allow for the particles in the effect to grow and shrink over the lifetime of the particle. “gradient” is used to denote where in the life span the size should be at “factor” which is a multiplier for the base size of the particle. In the below example the particles in the effect would start at 75% size then grow to normal size over the first 20% of the particle’s lifespan then it would grow to 1.5x its base size over the rest of its life.
   * @example
   * [
   *   { "gradient": 0, "factor": 0.75 },
   *   { "gradient": 0.2, "factor": 1 },
   *   { "gradient": 1, "factor": 1.5 }
   * ]
   */
  sizeGradient?: Gradient[];

  /**
   * How much variation in size there is in the particles of the effect.
   * If an effect has a size of 10 and a sizeRandom of 5 the particles will have a size of 5-15.
   */
  sizeRandom?: number;

  /**
   * speed defines the speed at which the particles will move away from the origin.
   */
  speed?: number;

  /**
   * How much variation in speed there is in the particles of the effect.
   * If an effect has a speed of 10 and a speedRandom of 5 the particles will have a speed of 5-15.
   */
  speedRandom?: number;

  /**
   * start/endColour defines the color of the particle when it is created and right before it is destroyed, 
   * respectively, using an array [Red, Green, Blue, Alpha]. The colors, RGB, use values between 0-255 and 
   * the Alpha channel is a decimal between 0-1. If you're looking for a specific color you can look up 
   * "hex color picker" in your favorite search engine and that should give you the numbers you're looking for. 
   * The colors will fade from the start value to the end value over the course of their life span. 
   * Since all of the particles are piled on top of each other to begin with the colors tend to be much lighter, 
   * turning into a ball of white, than you expect so you will want to use darker colors at least in the 
   * startColour block. There are a bunch of color examples at the end of this page, if you're looking for inspiration.
   */
  startColour?: ColorAlphaStructure;

  /**
   * The start and end randoms determine how much difference there is in the color of the particles at the beginning and end of their lifespans. Example:
   * 
   * startColour: [220, 35, 0, 1],
   * startColourRandom: [62, 0, 0, 0.25]
   * 
   * an effect with these values will range from an RGBA of
   * 
   * [158, 35, 0, 0.75] to
   * [255, 35, 0, 1]
   * 
   * resulting in a more varied color range for your effect’s particles.
   */
  startColourRandom?: ColorAlphaStructure;

  /**
   * Only available with the latest VTT Engine
   * 
   * subEmitters has a list of emitters.
   */
  subEmitters?: { emitters: Emitter[] };

  /**
   * Only available with the latest VTT Engine
   * 
   * Velocity Gradients define how the particles change their speed over their lifetime.
   * In the above example the particles would fire out much faster than their base speed and then rapidly slow down to 20% of base speed over the first 60% of its lifespan, then slowing to a stop over the remaining 40%.
   * @example
   * [
   *   { "gradient": 0, "factor": 3 },
   *   { "gradient": 0.6, "factor": 0.2 },
   *   { "gradient": 1, "factor": 0 }
   * ]
   */
  velocityGradients?: Gradient[];
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

type _CustomFx = CustomFx;
declare global {
  type CustomFx = _CustomFx;

  /**
   * Spawns a brief particle emitter effect at the location at x,y of type. If you omit the pageid or pass 'undefined', then the page the players are currently on ('playerpageid' in the Campaign object) will be used by default.
   * Built-in types follow the format "type-color" (e.g. "bubbling-acid").
   * Cannot be used with beam, breath, or splatter types; use spawnFxBetweenPoints for those.
   * @param {number} left The x-coordinate.
   * @param {number} top The y-coordinate.
   * @param {SpawnFxBuiltInTypes | Id} type The effect type string in "type-color" format.
   * @param {Id} [pageId] The page to spawn the effect on. Defaults to the current player page. If you omit the pageid or pass 'undefined', then the page the players are currently on ('playerpageid' in the Campaign object) will be used by default.
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
