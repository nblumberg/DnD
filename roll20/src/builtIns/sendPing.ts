import { Id } from "./ids";

declare global {
  /**
   * Sends a ping at the specified coordinates, similar to holding the left mouse button.
   * @param {number} left The x-coordinate of the ping.
   * @param {number} top The y-coordinate of the ping.
   * @param {Id} pageId The ID of the page on which to send the ping.
   * @param {Id} [playerId] The ID of the player whose color to use. Defaults to yellow if omitted.
   * @param {boolean} [moveAll] If true, centers all players' views on the ping (GMs only).
   * @note Note: At this time, only GMs will have their views centered if moveAll is true. This behavior is documented here: https://app.roll20.net/forum/permalink/6718676/
   * @example
   * on('chat:message', function(msg) {
   *     var obj;
   *     if (msg.type === 'api' && msg.content.indexOf('!ping') === 0) {
   *         if (!msg.selected) return;
   *         obj = getObj(msg.selected[0]._type, msg.selected[0]._id);
   *         sendPing(obj.get('left'), obj.get('top'), obj.get('pageid'), msg.playerid, true); // center everyone on the selected token
   *     }
   * });
   */
  function sendPing(
    left: number,
    top: number,
    pageId: Id,
    playerId?: Id,
    moveAll?: boolean
  ): void;

}