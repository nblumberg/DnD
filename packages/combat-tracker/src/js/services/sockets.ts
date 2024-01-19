import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "combat-service/client";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { awaitLogin, emailToCharacters } from "../auth";

type MySocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: MySocket | undefined;

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
