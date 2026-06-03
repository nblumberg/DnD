export {};
declare global {
  /**
   * Generates a random integer between 1 and max (inclusive), using the same pseudorandom algorithm as Roll20's dice engine.
   * 
   * @param {number} max The maximum number to return, inclusive.
   * @returns {number} A random integer between 1 (inclusive) and max (inclusive). This function has better distribution than Math.random(), and is recommended over it. This function doesn't make use of the Quantum Roll feature used by the dice engine, but it does use the same pseudorandom algorithm that the dice engine will fall back on if Quantum Roll is unavailable.
   * @example
   * Because this function returns an integer from 1 to max, it is ideal for quickly generating a dice roll outcome if you don't need the full strength of Roll20's dice engine.
   * var d20Result = randomInteger(20); // roughly equivalent to rolling a 20-sided die
   */
  function randomInteger(max: number): number;
}