import { Id } from "./ids";
import { APIObject } from "./roll20Objects";
export interface Campaign extends APIObject {
  /**
   * A unique ID for this object. Globally unique across all objects in this game. Read-only.
   * @readonly
   */
  readonly id: "root";
  /**
   * A JSON string which contains data about the folder structure of the game. Read-only.
   * @readonly
   */
  readonly journalfolder: string;
  /**
   * A JSON string which contains data about the jukebox playlist structure of the game. Read-only.
   * @readonly
   */
  readonly jukeboxfolder: string;
  /**
   * Read only
   * @readonly
   */
  readonly type: "campaign";

  /**
   * When true, players will see objects on the foreground layer. When false, they will not.
   * Note: this is a global setting that affects all pages.
   * @default true.
   */
  foregroundLayerVisible: boolean;
  /**
   * ID of the page used for the tracker when the turn order window is open.
   * When set to false, the turn order window closes.
   * @default false.
   */
  initiativepage: false | Id;
  /**
   * ID of the page the player bookmark is set to. Players see this page by default,
   * unless overridden by playerspecificpages below.
   * @default false.
   */
  playerpageid: false | Id;
  /**
   * An object (NOT JSON STRING) of the format: {"player1_id": "page_id", "player2_id": "page_id" ... }
   * Any player set to a page in this object will override the playerpageid.
   * @default false.
   */
  playerspecificpages: false | Record<Id, Id>;
  /**
   * Valid values are 3 or 4 representing the number of token bubbles.
   * Available in the upgraded VTT Engine.
   * @default 3.
   */
  tokenBubbleMax: 3 | 4;
  /**
   * A JSON string of the turn order. See TurnOrder.
   * @default "".
   */
  turnorder: string;
}

declare global {
  /**
   * A function which returns the Campaign object. Since there is only one campaign, this global always points to the only campaign in the game. Useful for doing things like checking to see if an object is on the active page using Campaign().get("playerpageid").
   * @returns {_Campaign} The Campaign object. Since there is only one campaign, this global always points to the only campaign in the game. Useful for doing things like checking to see if an object is on the active page using Campaign().get("playerpageid").
   */
  function Campaign(): Campaign;
}
