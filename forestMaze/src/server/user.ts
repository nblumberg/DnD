import { WebSocket } from 'ws';
import { BrowserToServerSocketMessage, ServerToBrowserSocketMessage } from '../dtos/socketTypes';
import { registerWebSocketHandler, socketError, unregisterWebSocketHandler } from './serverSockets';

interface UserChannel {
  (response: ServerToBrowserSocketMessage): void;
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

const activeUsers = new Map<string, UserChannel>();

function isValidUser(user: string): boolean {
  return Object.prototype.hasOwnProperty.call(allUsers, user);
}

function addUser(data: BrowserToServerSocketMessage, ws: WebSocket) {
  const { user } = data as any;
  if (!isValidUser(user)) {
    return socketError(ws, `${user} is not a recognized user`, 400);
  }
  const channel: UserChannel = (response: ServerToBrowserSocketMessage) => {
    ws.send(JSON.stringify(response));
  };
  activeUsers.set(user, channel);
  console.log(`${user} joined`);
  setInterval(() => {
    const callback = `${user}-${Date.now()}`;
    let checkedIn = false;
    registerWebSocketHandler(callback, () => {
      checkedIn = true;
    });
    channel({ type: 'ping', callback, statusCode: 200 });
    setTimeout(() => {
      unregisterWebSocketHandler(callback);
      if (!checkedIn) {
        activeUsers.delete(user);
        console.log(`${user} timed out`);
      }
    }, 3000);
  }, 30000); // every 30 seconds, ping the user to make sure they're still active
}

registerWebSocketHandler('addUser', addUser);

export function getUsers() {
  return allUsers;
}

export function sendToUser(user: string, data: ServerToBrowserSocketMessage) {
  const channel = activeUsers.get(user);
  if (!channel) {
    // TODO: throw error?
    return;
  }
  channel(data);
}
