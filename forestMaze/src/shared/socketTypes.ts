import { WebSocket } from 'ws';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface BrowserToServerSocketMessage extends Record<string, any> {
  type: string;
  user: string;
}

export type BrowserToServerUserlessSocketMessage = PartialBy<BrowserToServerSocketMessage, 'user'>;

export interface ServerToBrowserSocketMessage extends BrowserToServerSocketMessage {
  callback?: string;
  error?: string;
  statusCode?: number;
}

export type ServerToBrowserUserlessSocketMessage = PartialBy<ServerToBrowserSocketMessage, 'user'>;

export interface ServerSocketMessageHandler {
  (data: BrowserToServerSocketMessage, ws: WebSocket): Promise<ServerToBrowserSocketMessage> | void;
}

export interface BrowserSocketMessageHandler {
  (data: ServerToBrowserSocketMessage): Promise<BrowserToServerSocketMessage> | Promise<void> | void;
}
