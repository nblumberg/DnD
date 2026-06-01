import { AllObjects } from "./roll20Objects";

declare global {
  /**
   * Will execute the provided callback function on each object, and if the callback returns true, the object will be included in the result array. Currently, it is inadvisable to use filterObjs() for most purposes – due to the fact that findObjs() has some built-in indexing for better executing speed, it is almost always better to use findObjs() to get objects of the desired type first, then filter them using the native .filter() method for arrays.
   *
   * var results = filterObjs(function(obj) {
   *   if(obj.get("left") < 200 && obj.get("top") < 200) return true;
   *   else return false;
   * });
   * //Results is an array of all objects that are in the top-left corner of the tabletop.
   *
   * @param {(obj: AllObjects) => boolean} callback A function which will be executed on each object. If the function returns true, the object will be included in the result array.
   * @returns {AllObjects[]} An array of all objects for which the callback function returned true.
   * @deprecated Due to the fact that findObjs() has some built-in indexing for better executing speed, it is almost always better to use findObjs() to get objects of the desired type first, then filter them using the native .filter() method for arrays.
   */
  function filterObjs(callback: (obj: AllObjects) => boolean): AllObjects[];
}
