import { IncomingMessage, Server, ServerResponse } from 'http';
import { Server as WebSocketServer, WebSocket } from 'ws';
import { ServerSocketMessageHandler, ServerToBrowserSocketMessage } from '../dtos/socketTypes';

const handlers = new Map<string, ServerSocketMessageHandler>();

export function registerWebSocketHandler(type: string, handler: ServerSocketMessageHandler) {
  if (handlers.has(type)) {
    throw new Error(`Already registered a WebSocketHandler for ${type}`);
  }
  handlers.set(type, handler);
}

export function unregisterWebSocketHandler(type: string) {
  handlers.delete(type);
}

export function socketError(ws: WebSocket, rawError: string | Error, statusCode = 400) {
  const error = typeof rawError === 'string' ? rawError : rawError.message;
  const response: ServerToBrowserSocketMessage = {
    type: 'error',
    error,
    statusCode,
  };
  ws.send(JSON.stringify(response));
}

function message(ws: WebSocket, message: string) {
  try {
    const data = JSON.parse(message);
    const { type } = data;
    const handler = handlers.get(type);
    if (!handler) {
      return socketError(ws, `Unrecognized socket request type "${type}"`, 501);
    }
    const promise = handler(data, ws);
    if (promise) {
      promise.then(response => ws.send(JSON.stringify(response)));
    }
  } catch (e) {
    socketError(ws, e as Error, 400);
  }
}

export function addWebSockets(server: Server<typeof IncomingMessage, typeof ServerResponse>) {
  const wss = new WebSocketServer({ server });
  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', message.bind(null, ws));
  });
}
