import { openSocket } from './browser/browserSockets.js';
import './browser/browserState.js';
import { buttonBar } from './browser/elements.js';
import { addEventHandlers } from './browser/eventHandlers.js';
import './browser/howDoIGetTo.js';
import { isDM } from './browser/isDM.js';
import './browser/showCharacterState.js';
import './browser/showDirections.js';
import './browser/showEncounter.js';
import './browser/showTide.js';

openSocket();
addEventHandlers();

if (!isDM()) {
  buttonBar.style.display = 'none';
}
