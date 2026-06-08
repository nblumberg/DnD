import { PING_ME_API_PREFIX } from "./constants";

/**
 * API talks back to the player (token choice UI or error feedback)
 * @param {string} playerName
 * @param {string} message
 */
export function chatMessage(playerName: string, message: string) {
  sendChat(PING_ME_API_PREFIX, `/w ${playerName} ${message}`);
}
