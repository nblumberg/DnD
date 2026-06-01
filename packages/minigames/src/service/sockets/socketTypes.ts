export interface ServerToClientEvents {
  something: (args: string[]) => void;
}

export interface ClientToServerEvents {
  something: (args: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {}
