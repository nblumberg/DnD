import { Id } from "./ids";
import { RollPart } from "./roll";

/**
 * The message type:
 * - `"general"` — standard chat message
 * - `"rollresult"` — public dice roll; `content` is a JSON string, parse with `JSON.parse()` to get `ParsedRollResult`
 * - `"gmrollresult"` — GM-only dice roll; same `content` format as `"rollresult"`
 * - `"emote"` — `/me` emote
 * - `"whisper"` — private message; includes `target` and `target_name`
 * - `"desc"` — `/desc` narrative text
 * - `"api"` — API command (starts with `!`); may include `selected`
 */
export type ChatMessageType =
  | "general"
  | "rollresult"
  | "gmrollresult"
  | "emote"
  | "whisper"
  | "desc"
  | "api";

/** 
 * An inline roll embedded in a message with `[[expression]]` syntax 
 */
export interface InlineRoll {
  expression: string;
  results: ParsedRollResult;
  rollid: Id;
  signature?: string;
}

/** A token that was selected when an API command was entered */
export interface SelectedToken {
  /** @readonly */
  id: Id;
  /** @readonly */
  type: "graphic";
}

/**
 * A chat message delivered to the `chat:message` event handler.
 *
 * @see https://help.roll20.net/hc/en-us/articles/360037256754-API-Chat
 *
 * @example
 * on("chat:message", function(msg) {
 *   if (msg.type === "api" && msg.content.startsWith("!mycommand")) {
 *     // handle API command
 *   }
 * });
 */
export interface ChatMessage {
  /** 
   * Display name of the sender (player name or character name) 
   * @default ""
   */
  who: string;

  /** 
   * ID of the player who sent the message 
   */
  playerid: Id;

  /**
   * @default "general"
   */
  type: ChatMessageType;

  /**
   * The contents of the chat message. If type is "rollresult", this will be a JSON string of data about the roll.
   * For `"rollresult"` and `"gmrollresult"` types this is a JSON
   * string — call `JSON.parse(msg.content)` to obtain a `ParsedRollResult`.
   */
  content: string;

  /** 
   * Inline rolls embedded in the message via `[[expression]]` syntax 
   * (content contains one or more inline rolls only) An array of objects containing information about all inline rolls in the message.
   */
  inlinerolls?: InlineRoll[];

  /** Name of the roll template used, if any */
  rolltemplate?: string;

  [key: string]: unknown;
}

/**
 * Chat Event Example (Implementing Custom Roll Type)
 * on("chat:message", function(msg) {
 *   //This allows players to enter !sr <number> to roll a number of d6 dice with a target of 4.
 *   if(msg.type == "api" && msg.content.indexOf("!sr ") !== -1) {
 *     var numdice = msg.content.replace("!sr ", "");
 *     sendChat(msg.who, "/roll " + numdice + "d6>4");
 *   }
 * });
 */
interface ApiChatMessage extends ChatMessage {
  type: "api";

  /** Tokens selected when the API command was entered */
  selected: SelectedToken[];
}
interface WhisperChatMessage extends ChatMessage {
  type: "whisper";

  /**
   * (type "whisper" only) The player ID of the person the whisper is sent to. If the whisper was sent to the GM without using his or her display name (ie, "/w gm text" instead of "/w Riley text" when Riley is the GM), or if the whisper was sent to a character without any controlling players, the value will be "gm".
   */
  target: Id | "gm";

  /**
   * (type "whisper" only) The display name of the player or character the whisper was sent to.
   */
  target_name: string;
}

interface RollResultMessage extends ChatMessage {
  type: "rollresult" | "gmrollresult";
  /** 
   * (type "rollresult" or "gmrollresult" only) The original text of the roll, 
   * eg: "2d10+5 fire damage" when the player types "/r 2d10+5 fire damage". 
   * This is equivalent to the use of content on messages with types other than "rollresult" or "gmrollresult".
   * @example "2d10+5 fire damage"
   */
  origRoll: string;
  /** Name of the roll template used, if any */
  rolltemplate?: string;
}

/**
 * The parsed roll result, obtained by calling JSON.parse() on `content` for
 * "rollresult" and "gmrollresult" messages.
 */
export interface ParsedRollResult {
  /** Always "V" (validated roll) — the root container */
  type: "V";
  rolls: RollPart[];
  resultType: "sum" | "success";
  total: number;
}



export type AllChatMessages = ApiChatMessage | WhisperChatMessage | RollResultMessage | ChatMessage;

export type InputHtmlTag ="code" | "span" | "div" | "label" | "a" | "br" | "p" | "b" | "i" | "del" | "strike" | "u" | "img" | "blockquote" | "mark" | "cite" | "small" | "ul" | "ol" | "li" | "hr" | "dl" | "dt" | "dd" | "sup" | "sub" | "big" | "pre" | "figure" | "figcaption" | "strong" | "em" | "table" | "tr" | "td" | "th" | "tbody" | "thead" | "tfoot" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

declare global {
  /**
   * Sends a chat message.
   * 
   * If a callback is provided, the message is not posted to chat and instead the resulting message objects are passed to the callback.
   * @param {string | Id} speakingAs The name or identifier of the speaker. speakingAs can be one of: Any string, in which case that will be used as the name of the person who sent the message. E.g. "Riley". A player's ID, formatted as "player|-Abc123" where "-Abc123" is the ID of the player. If you do this it will automatically use the avatar and name of the player. A character's ID, formatted as "character|-Abc123". If you do this it will automatically use the avatar and name of the Character.
   * @param {string} input The message content. Should be any valid expression just like the ones used in the Roll20 App. You enter text to send a basic message, or use slash-commands such as "/roll", "/em", "/w", etc. In addition: You can use Character Attributes with the format @{CharacterName|AttributeName}. You can use Character Abilities with the format: %{CharacterName|AbilityName}. You cannot use macros. You can use the "/direct <msg>" command to send a message without any processing (e.g. autolinking of URLs), and you can use the following HTML tags in the message: InputHtmlTag
   * @param {null | (ops: AllChatMessages[]) => void} [callback] If provided, receives the resulting message objects instead of posting to chat. is an optional third parameter consisting of a callback function which will be passed the results of the sendChat() call instead of sending the commands to the game. Using sendChat() in this way is asynchronous. The results of the sendChat() command will be an ARRAY of operations, and each individual object will be just like an object you receive during a chat:message event (see above). f you want to adjust these options but do not want to use a callback parameter (third parameter--see above), you can simply pass null in it's place.
   * @param {{ noarchive?: boolean; use3d?: boolean }} [options] An optional fourth parameter to set options for how the message is handled. Options are specified as a javascript object with who's properties are the names of the options to set and whose values are the settings for them, generally true as they default to false.
   * @param {boolean} [options.noarchive] set this to true to prevent the message from being stored in the chat log. This is particularly useful for output that is not part of the story, such as Mod (API) Button menus and state information.
   * @param {boolean} [options.use3d] You can now generate 3D Dice rolls using the sendChat() function. The syntax is simply: sendChat("Name", "Rolling [[3d6]]", null, {use3d: true}); If you pass a player ID to the name parameter, such as sendChat("player|-ABC123",...) the player's color will be used for the dice. Otherwise a default white color will be used. 
   * @note Note: Clients can only show the result of one 3D roll at a time, so making a bunch of separate 3D rolls in a row is not useful. Also note that using 3D rolls does place a bit more strain on the QuantumRoll server, so use your judgement and don't perform 100 3D rolls in the space of a second. Use 3D rolls when the roll will "matter" to the player and make an impact on the game.
   * @example
   * sendChat('Example', 'This is a simple example.');
   * You can easily write code to send a message as the same player or character that triggered a chat:message event.
   * 
   * on('chat:message', function(msg) {
   *     var character = findObjs({ type: 'character', name: msg.who })[0],
   *         player = getObj('player', msg.playerid),
   *         message = ' said something';
   * 
   *     if (character) sendChat('character|'+character.id, character.get('name')+message);
   *     else sendChat('player|'+player.id, player.get('displayname')+message);
   * });
   * The callback parameter is useful if you need to leverage Roll20's dice engine. There is no particular need for a speakingAs value when using the callback, since the message won't appear in the chat anyway.
   * 
   * sendChat('', '/r 2d20k1+'+strengthMod, function(ops) {
   *     var msg = ops[0];
   *     // ...
   * });
   * options.noarchive is primarily designed for sending players menus made from API Command buttons without clogging their chat history.
   * 
   * sendChat('System', '[Clear changes](!clear)\n[Add tile](!add)\n[View sample](!view)\n[Save layout](!save)', null, { noarchive: true });
   * 
   * sendChat("God", "Sent as God");
   * sendChat("player|-Abc123", "Sent as me");
   * sendChat("character|-Abc123", "Sent as my character");
   * sendChat("character|-Abc123", "My AC is @{MyCharacterName|ac}");
   * sendChat("character|-Abc123", "My strength is @{MyCharacterName|strength}");
   * sendChat("character|-Abc123", "/r 1d20+@{MyCharacterName|strength} Attack!");
   * sendChat("character|-Abc123", "/em waves a hand mysteriously.");
   * sendChat("character|-Abc123", "/w gm Do I know what they said?");
   * sendChat("character|-Abc123", "/direct <a href="...">See here</a>");
   * 
   * // You can use this, for example, to perform a roll using the Roll20 roll engine, then get the results of the roll immediately. You could then perform additional modifications to the roll before sending it to the players in the game.
   * sendChat("Riley", "/roll 1d20+4", function(ops) {
   *     // ops will be an ARRAY of command results.
   *     var rollresult = ops[0];
   *     //Now do something with rollresult, just like you would during a chat:message event...
   * });
   * 
   * You can now generate 3D Dice rolls using the sendChat() function. The syntax is simply: 
   * <code>sendChat("Name", "Rolling [[3d6]]", null, {use3d: true});</code>
   * If you pass a player ID to the name parameter, such as 
   * <code>sendChat("player|-ABC123",...)</code>
   * the player's color will be used for the dice. Otherwise a default white color will be used.
   * 
   * sendChat("Status", "All players are logged in.", null, {noarchive:true} );
   */
  function sendChat(
    speakingAs: string,
    input: string,
    callback?: (ops: AllChatMessages[]) => void,
    options?: { noarchive?: boolean; use3d?: boolean }
  ): void;
}
