import { WebSocket } from 'ws';

export interface BrowserToServerSocketMessage extends Record<string, any> {
  type: string;
}

export interface ServerToBrowserSocketMessage extends BrowserToServerSocketMessage {
  error?: string;
  statusCode: number;
}

export interface ServerSocketMessageHandler {
  (data: BrowserToServerSocketMessage, ws: WebSocket): Promise<ServerToBrowserSocketMessage> | void;
}

export interface BrowserSocketMessageHandler {
  (data: ServerToBrowserSocketMessage): Promise<BrowserToServerSocketMessage> | void;
}
