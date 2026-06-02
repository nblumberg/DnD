import { AllObjects } from "./roll20Objects";

declare global {
  /**
   * Pass this function a list of attributes, and it will return all objects that match as an array. Note that this operates on all objects of all types across all pages -- so you probably want to include at least a filter for _type and _pageid if you're working with tabletop objects.
   *
   * var currentPageGraphics = findObjs({
   *   _pageid: Campaign().get("playerpageid"),
   *   _type: "graphic",
   * });
   * _.each(currentPageGraphics, function(obj) {
   *   //Do something with obj, which is in the current page and is a graphic.
   * });
   * You can also pass in an optional second argument which contains an object with a list of options, including:
   * caseInsensitive (true/false): If true, string properties will be compared without regard for the case of the string
   * var targetTokens = findObjs({
   *     name: "target"
   * }, {caseInsensitive: true});
   * //Returns all tokens with a name of 'target', 'Target', 'TARGET', etc.
   *
   * @param {Record<string, unknown>} attributes An object containing a list of attributes to filter by. For example, if you want to find all graphics on the current page, you would pass in {_pageid: Campaign().get("playerpageid"), _type: "graphic"}.
   * @returns {AllObjects[]} An array of all objects that match the provided attributes.
   */
  function findObjs<T extends AllObjects>(attributes: Record<string, unknown>): T[];
}
