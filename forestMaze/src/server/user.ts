import { WebSocket } from 'ws';
import { BrowserToServerSocketMessage, ServerToBrowserUserlessSocketMessage } from '../shared/socketTypes';
import { registerWebSocketHandler, socketError, unregisterWebSocketHandler } from './serverSockets';
import { getState } from './serverState';
import { addLocationsListener, getLocations } from './serverLocations';
import { Location } from '../locations';
import { addEncountersListener, getEncounters } from './serverEncounters';
import { Encounter } from '../encounters';
import { getHistory } from './serverHistory';

interface UserChannel {
  (response: ServerToBrowserUserlessSocketMessage): void;
}

type CharacterStateValue = number | [string, number]; // damage or [effect, duration]
type CharacterState = Record<string, CharacterStateValue>;

interface User {
  channel: UserChannel;
  id: string;
  state: CharacterState;
}

export const DM = 'DM';

const allUsers = {
  Eaton: 'Ser Eaton Dorito',
  Harrow: 'Harrow Zinvaris',
  John: 'John Rambo McClane',
  Nacho: 'Nacho Chessier IV',
  Rhiannon: 'Rhiannon Fray',
  Throne: 'Throne',
  DM,
};

const activeUsers = new Map<string, User>();

function isValidUser(user: string): boolean {
  return Object.prototype.hasOwnProperty.call(allUsers, user);
}

function addUser(data: BrowserToServerSocketMessage, ws: WebSocket) {
  const { user: userId } = data as any as { user: string };
  if (!isValidUser(userId)) {
    return socketError(ws, `${userId} is not a recognized user`, 400);
  }
  const user: User = {
    channel: (response) => {
      response.user = userId; // add the user to make it a fully qualified ServerToBrowserSocketMessage
      ws.send(JSON.stringify(response));
    },
    id: userId,
    state: {},
  };
  activeUsers.set(userId, user);
  console.log(`${userId} joined`);
  user.channel({ type: 'state', state: getState() });
  user.channel({ type: 'locations', locations: getLocations() });
  user.channel({ type: 'encounters', encounters: getEncounters() });
  user.channel({ type: 'history', history: getHistory() });
  user.channel({ type: 'characterState', characterState: user.state });
  keepAlive(user);
}
registerWebSocketHandler('addUser', addUser);

/**
 * Every 30 seconds, ping the user to make sure they're still active
 */
function keepAlive(user: User): void {
  const intervalId = setInterval(() => {
    const callback = `${user.id}-${Date.now()}`;
    let checkedIn = false;
    registerWebSocketHandler(callback, () => {
      checkedIn = true;
    });
    user.channel({ type: 'ping', callback });
    setTimeout(() => {
      unregisterWebSocketHandler(callback);
      if (!checkedIn) {
        activeUsers.delete(user.id);
        console.log(`${user.id} timed out`);
        clearInterval(intervalId);
      }
    }, 3000);
  }, 30000);
}

function updateLocations(locations: Location[]): void {
  sendToAllUsers({ type: 'locations', locations });
}
addLocationsListener(updateLocations);

function updateEncounters(encounters: Encounter[]): void {
  sendToAllUsers({ type: 'encounters', encounters });
}
addEncountersListener(updateEncounters);

function userStatesEqual(state1: User['state'], state2: User['state']): boolean {
  return JSON.stringify(state1) === JSON.stringify(state2);
}

export function getAllUsers() {
  return allUsers;
}

export function getActiveUsers() {
  return Array.from(activeUsers.keys());
}

export function countdownStatusEffects(): void {
  const { travelTime } = getState();

  Object.values(activeUsers).forEach(user => {
    const { channel, state: oldState } = user;
    const newState = { ...oldState };
    Object.entries(newState).forEach(([key, value]) => {
      if (!Array.isArray(value)) {
        return;
      }
      let duration = value[1];
      duration -= travelTime;
      if (duration <= 0) {
        delete newState[key];
      } else {
        (newState[key] as [string, number])[1] = duration;
      }
    });
    if (!userStatesEqual(oldState, newState)) {
      user.state = newState;
      channel({ type: 'characterState', ...user.state });
    }
  });
}

export function sendToUser(userId: string, data: ServerToBrowserUserlessSocketMessage) {
  const user = activeUsers.get(userId);
  if (!user) {
    // TODO: throw error?
    return;
  }
  user.channel(data);
}

export function sendToAllUsers(data: ServerToBrowserUserlessSocketMessage) {
  for (const user of activeUsers.values()) {
    user.channel(data);
  }
}
