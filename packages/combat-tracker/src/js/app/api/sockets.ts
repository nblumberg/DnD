import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "combat-service/client";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { emailToCharacters } from "../store";
import { awaitLogin } from "../utils/authPromise";

type MySocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: MySocket | undefined;

interface SocketHandler {
  type: keyof ServerToClientEvents;
  handler: (args: any) => void;
}

const socketHandlers: SocketHandler[] = [];

export async function awaitSocket(): Promise<MySocket> {
  if (socket) {
    return socket;
  }
  const profile = await awaitLogin();
  const users = emailToCharacters(profile.email);
  if (!users) {
    throw new Error("Unknown user, cannot connect to socket");
  }
  let path = "";
  if (users.includes("dm")) {
    path = "/dm";
  }
  socket = io(`:6677${path}`, {
    query: {
      users,
    },
  });
  socket.onAny((event, ...args) => {
    console.log("Socket event", event, args);
  });
  socketHandlers.forEach(({ type, handler }) => {
    attachSocketHandler(socket as MySocket, { type, handler });
  });
  return socket;
}

awaitSocket();

export function useSocket(): MySocket | undefined {
  const [s, setSocket] = useState(socket);
  useEffect(() => {
    if (s) {
      return;
    }
    awaitSocket().then((newSocket) => setSocket(newSocket));
  }, [s, setSocket]);
  return s;
}

function attachSocketHandler(
  socket: MySocket,
  socketHandler: SocketHandler
): void {
  socket.on(socketHandler.type, socketHandler.handler);
}

export function registerSocketHandler(
  type: keyof ServerToClientEvents,
  handler: (args: any) => void
): void {
  socketHandlers.push({ type, handler });
}
