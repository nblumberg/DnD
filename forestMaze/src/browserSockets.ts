import { BrowserToServerSocketMessage, BrowserSocketMessageHandler } from './dtos/socketTypes.js';
import { getUrlParam } from './getUrlParam.js';

let socket: WebSocket;

const handlers = new Map<string, BrowserSocketMessageHandler>();

export function registerWebSocketHandler(type: string, handler: BrowserSocketMessageHandler) {
  if (handlers.has(type)) {
    throw new Error(`Already registered a WebSocketHandler for ${type}`);
  }
  handlers.set(type, handler);
}

registerWebSocketHandler('ping', (data) => {
  const { callback } = data as any;
  return Promise.resolve({ type: callback });
});

export function unregisterWebSocketHandler(type: string) {
  handlers.delete(type);
}

export function send(data: BrowserToServerSocketMessage) {
  socket.send(JSON.stringify(data));
}

export function addSocketListener() {
  // Create WebSocket connection.
  const here = new URL(window.location.href);
  socket = new WebSocket(`ws://${here.hostname}${here.port ? `:${here.port}` : ''}`);

  // Connection opened
  socket.addEventListener('open', (event) => {
    const user = getUrlParam('name');
    send({ type: 'addUser', user });
  });

  // Listen for messages
  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    const handler = handlers.get(data.type);
    if (!handler) {
      return;
    }
    const promise = handler(data);
    if (promise) {
      promise.then(request => send(request));
    }
  });
}
