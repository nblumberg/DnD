import { WebSocket } from 'ws';
import { Encounter } from '../encounters';
import { Location } from '../locations';
import { BrowserToServerSocketMessage, ServerToBrowserUserlessSocketMessage } from '../shared/socketTypes';
import { addStatePropertyListener } from '../shared/state';
import { addEncountersListener, getEncounters } from './serverEncounters';
import { getHistory } from './serverHistory';
import { addLocationsListener, getLocations } from './serverLocations';
import { registerWebSocketHandler, socketError, unregisterWebSocketHandler } from './serverSockets';
import { getState } from './serverState';

interface UserChannel {
  (response: ServerToBrowserUserlessSocketMessage): void;
}

type CharacterStateValue = number | [string, number]; // damage or [effect, duration]
type CharacterState = Record<string, CharacterStateValue>;

interface User {
  channel: UserChannel;
  ws: WebSocket;
  id: string;
  state: CharacterState;
  ping: {
    intervalId?: ReturnType<typeof setInterval>;
    timeoutId?: ReturnType<typeof setTimeout>;
  };
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
  if (activeUsers.has(userId)) {
    refreshSocket(activeUsers.get(userId)!, ws);
  } else {
    const { hours, minutes } = getState();
    const user: User = {
      ws,
      channel: (response) => {
        response.user = userId; // add the user to make it a fully qualified ServerToBrowserSocketMessage
        user.ws.send(JSON.stringify(response));
      },
      id: userId,
      state: { hours, minutes },
      ping: {},
    };
    activeUsers.set(userId, user);
    refreshSocket(user, ws, true);
  }
}
registerWebSocketHandler('addUser', addUser);

function refreshSocket(user: User, ws: WebSocket, force = false): void {
  if (user.ws !== ws || force) {
    user.ws = ws;
    clearPing(user);
    connectUser(user, !force);
  }
}

function checkUser(data: BrowserToServerSocketMessage, ws: WebSocket) {
  const { user: userId } = data as any as { user: string };
  if (isActiveUser(userId)) {
    refreshSocket(activeUsers.get(userId)!, ws);
  } else {
    addUser(data, ws);
  }
}
registerWebSocketHandler('checkUser', checkUser);

function connectUser(user: User, rejoined = false) {
  console.log(`${user.id} ${rejoined ? 're-' : ''}joined`);
  user.channel({ type: 'state', state: getState() });
  user.channel({ type: 'locations', locations: getLocations() });
  user.channel({ type: 'encounters', encounters: getEncounters() });
  user.channel({ type: 'history', history: getHistory() });
  user.channel({ type: 'characterState', characterState: user.state });
  keepAlive(user);
}

let pingCounter = 1;
function incrementPingCounter(): number {
  if (pingCounter === Number.MAX_SAFE_INTEGER) {
    pingCounter = 1;
  }
  return pingCounter++;
}

function clearPing(user: User): void {
  if (user.ping.intervalId) {
    clearInterval(user.ping.intervalId);
    delete user.ping.intervalId;
  }
  if (user.ping.timeoutId) {
    clearTimeout(user.ping.timeoutId);
    delete user.ping.timeoutId;
  }
}

/**
 * Every 30 seconds, ping the user to make sure they're still active
 */
function keepAlive(user: User): void {
  clearPing(user);
  const intervalId = setInterval(() => {
    const callback = `${user.id}-ping-${incrementPingCounter()}`;

    const timeoutId = setTimeout(() => {
      unregisterWebSocketHandler(callback);
      activeUsers.delete(user.id);
      console.log(`${user.id} timed out`);
      clearInterval(intervalId);
    }, 3000);
    user.ping.timeoutId = timeoutId;

    registerWebSocketHandler(callback, () => {
      clearTimeout(timeoutId);
    });
    user.channel({ type: 'ping', callback });
  }, 30000);
  user.ping.intervalId = intervalId;
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

export function isActiveUser(userId: string): boolean {
  return activeUsers.has(userId);
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
      channel({ type: 'characterState', characterState: user.state });
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

addStatePropertyListener('hours', (newHours: number) => {
  for (const user of activeUsers.values()) {
    user.channel({ type: 'characterState', characterState: { ...user.state, hours: newHours } });
  }
});
addStatePropertyListener('minutes', (newMinutes: number) => {
  for (const user of activeUsers.values()) {
    user.channel({ type: 'characterState', characterState: { ...user.state, minutes: newMinutes } });
  }
});
