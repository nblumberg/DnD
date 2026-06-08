import { Id } from "./ids";

/**
 * Turn Order
 * The turn order is a JSON string representing the current turn order listing. It is an array of objects. Currently, the turn order can only contain objects from one page at a time -- the current Page ID for the turn order is the "initiativepage" attribute. Be sure to keep them both in-sync or you may end up with strange results.
 *
 * To work with the turn order, you will want to use JSON.parse() to get an object representing the current turn order state (NOTE: Check to make sure it's not an empty string "" first...if it is, initialize it yourself with an empty array). Here's an example turn order object:
 *
 * [
 *     {
 *      "id":"36CA8D77-CF43-48D1-8682-FA2F5DFD495F", //The ID of the Graphic object. If this is set, the turn order list will automatically pull the name and icon for the list based on the graphic on the tabletop.
 *      "pr":"0", //The current value for the item in the list. Can be a number or text.
 *      "custom":"" //Custom title for the item. Will be ignored if ID is set to a value other than "-1".
 *     },
 *     {
 *      "id":"-1", //For custom items, the ID MUST be set to "-1" (note that this is a STRING not a NUMBER.
 *      "pr":"12",
 *      "custom":"Test Custom" //The name to be displayed for custom items.
 *     }
 * ]
 *
 * To modify the turn order, edit the current turn order object and then use JSON.stringify() to change the attribute on the Campaign. Note that the ordering for the turn order in the list is the same as the order of the array, so for example push() adds an item onto the end of the list, unshift() adds to the beginning, etc.
 *
 * var turnorder;
 * if(Campaign().get("turnorder") == "") turnorder = []; //NOTE: We check to make sure that the turnorder isn't just an empty string first. If it is treat it like an empty array.
 * else turnorder = JSON.parse(Campaign().get("turnorder"));
 *
 * //Add a new custom entry to the end of the turn order.
 * turnorder.push({
 *     id: "-1",
 *     pr: "15",
 *     custom: "Turn Counter"
 * });
 * Campaign().set("turnorder", JSON.stringify(turnorder));
 */
export interface TurnOrderEntry {
  /**
   * Custom title for the item.
   * The name to be displayed for custom items.
   * Will be ignored if ID is set to a value other than "-1".
   */
  custom: string;
  /**
   * The ID of the Graphic object.
   * If this is set, the turn order list will automatically pull the name and icon for the list based on the graphic on the tabletop.
   * For custom items, the ID MUST be set to "-1" (note that this is a STRING not a NUMBER.
   */
  id: Id;
  /**
   * The current value for the item in the list. Can be a number or text.
   */
  pr: number | string;
  /**
   * The ID of the page the entry is from.
   * Not actually part of the turn order entry, but we use it internally to keep track of which page the entry is from so that we can filter out entries from other pages when we read the turn order.
   */
  _pageid?: Id;
}

type _TurnOrderEntry = TurnOrderEntry;
declare global {
  type TurnOrderEntry = _TurnOrderEntry;
  type TurnOrder = _TurnOrderEntry[];
}
