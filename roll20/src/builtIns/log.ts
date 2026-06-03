export {};
declare global {
  /**
   * Logs a message to the Mod (API) console.
   * @param {unknown} message MESSAGE(varies) The message to post to the Mod (API) console. The message parameter will be transformed into a String with JSON.stringify.
   * @returns {void}
   * @example
   * on('chat:message', function(msg) {
   *     log('Message received from:');
   *     log(getObj('player', msg.playerid));
   * });
   * "Message received from:"
   * {"_d20userid":"123456","_displayname":"John Doe","speakingas":"","_online":true,"color":"#885b68","_macrobar":"-J16Z-dRU5tleKiKOg0X|-K3F_4q_b1p-Vdiwgn1t","showmacrobar":true,"_id":"-J16Z-dRU5tleKiKOc0X","_type":"player","_lastpage":""}
   */
  function log(message: unknown): void;
}
