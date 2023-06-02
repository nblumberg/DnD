import { addSocketListener } from './browser/browserSockets.js';
import { addEventHandlers } from './browser/eventHandlers.js';
import './browser/browserState.js';
import './browser/howDoIGetTo.js';
import './browser/showCharacterState.js';
import './browser/showDirections.js';
import './browser/showEncounter.js';
import './browser/showTide.js';

addSocketListener();
addEventHandlers();
