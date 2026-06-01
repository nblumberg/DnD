import { AllObjects } from "./roll20Objects";

declare global {
  /**
   * Returns an array of all the objects in the Game (all types). Equivalent to calling filterObjs and just returning true for every object.
   * @returns {AllObjects[]} An array of all objects in the game.
   */
  function getAllObjs(): AllObjects[];
}
