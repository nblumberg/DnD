import { addCharacterStateListener, setCharacterState } from '../shared/characterState.js';
import { BrowserSocketMessageHandler, BrowserToServerUserlessSocketMessage } from '../shared/socketTypes.js';
import { getUrlParam } from './getUrlParam.js';

const user: string = getUrlParam('name')!; // required by server/page.ts

let socket: WebSocket;

const handlers = new Map<string, BrowserSocketMessageHandler>();

export function registerWebSocketHandler(type: string, handler: BrowserSocketMessageHandler) {
  if (handlers.has(type)) {
    throw new Error(`Already registered a WebSocketHandler for ${type}`);
  }
  handlers.set(type, handler);
}

registerWebSocketHandler('ping', (data) => {
  const { callback } = data;
  if (callback) {
    return Promise.resolve({ type: callback, user });
  }
});

export function unregisterWebSocketHandler(type: string) {
  handlers.delete(type);
}

export async function send(data: BrowserToServerUserlessSocketMessage) {
  data.user = user; // make it a fully qualified BrowserToServerSocketMessage
  if (socket.readyState === WebSocket.CLOSED) {
    await openSocket();
  }
  socket.send(JSON.stringify(data));
}

export function openSocket(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Create WebSocket connection.
    const here = new URL(window.location.href);
    socket = new WebSocket(`ws://${here.hostname}${here.port ? `:${here.port}` : ''}`);

    // Connection opened
    socket.addEventListener('open', () => {
      send({ type: 'addUser', user });
      resolve();
    });

    // Connection closed
    socket.addEventListener('close', openSocket);

    // Listen for messages
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'error') {
        console.error(`Received ${data.type} socket message from the server`, data);
      } else {
        console.log(`Received ${data.type} socket message from the server`, data);
      }
      const handler = handlers.get(data.type);
      if (!handler) {
        return;
      }
      const promise = handler(data);
      if (promise) {
        promise.then(request => {
          if (request) {
            send(request);
          }
        });
      }
    });
  });
}

registerWebSocketHandler('characterState', (message) => {
  setCharacterState(message.characterState);
});

addCharacterStateListener(characterState => {
  send({ type: 'characterState', characterState });
});
