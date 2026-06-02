import { Id } from "./ids";
import { APIObject } from "./roll20Objects";

export interface Player extends APIObject {
  /**
   * Can be used to identify the object type or search for the object. Read-only.
   */
  /**
   * User ID — site-wide. For example, the player's user page on the wiki is /User:ID, where ID is the same value stored in d20userid. Read-only.
   * @readonly
   */
  d20userid: string;

  /**
   * The player's current display name. May be changed from the user's settings page. Read-only.
   * @default ""
   * @readonly
   */
  displayname: string;

  /**
   * The page id of the last page the player viewed as a GM. This property is not updated for players or GMs that have joined as players. Read-only.
   * @default ""
   * @readonly
   */
  lastpage: string;

  /**
   * Comma-delimited string of the macros in the player's macro bar. Read-only.
   * @default ""
   * @readonly
   */
  macrobar: string;

  /**
   * Read-only.
   * @default false
   * @readonly
   */
  online: boolean;

  /**
   * Can be used to identify the object type or search for the object. Read-only.
   * @readonly
   */
  type: "player";

  /**
   * The color of the square by the player's name, as well as the color of their measurements on the map, their ping circles, etc.
   * @default "#13B9F0"
   */
  color: string;

  /**
   * Whether the player's macro bar is showing.
   * @default false
   */
  showmacrobar: boolean;

  /**
   * The player or character ID of who the player has selected from the "As" dropdown. When set to the empty string, the player is speaking as him- or herself. When set to a character, the value is "character|ID", where ID is the character's ID. When the GM is speaking as another player, the value is "player|ID", where ID is the player's ID.
   * @default ""
   */
  speakingas: string;

}

type _Player = Player;
declare global {
  type Player = _Player;

  /**
   *
   * @param {Id} playerId PLAYER_ID(String) The id of the player Roll20 object to check.
   * @returns {boolean} true if the player currently has GM permissions, or false otherwise.
   * @example
   * This function is especially useful for limiting Mod (API) commands to GM use.
   * on('chat:message', function(msg) {
   *     if (msg.type !== 'api') return;
   *
   *     if (msg.content.indexOf('!playercommand') === 0) {
   *         // ...
   *     } else if (msg.content.indexOf('!gmcommand') === 0) {
   *         if (!playerIsGM(msg.playerid)) return;
   *         // ...
   *     }
   * });
   */
  function playerIsGM(playerId: Id): boolean;
}
