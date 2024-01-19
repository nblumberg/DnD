import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "combat-service/client";
import type { Socket } from "socket.io-client";
import { awaitLogin, emailToCharacter } from "../auth";

type MySocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const { io } = window as unknown as {
  io: { connect: (uri: string) => MySocket };
};
let socket: MySocket | undefined;

awaitLogin().then((profile) => {
  const user = emailToCharacter(profile.email);
  if (!user) {
    console.error("Unknown user, cannot connect to socket");
    return;
  }
  let path = "";
  if (user === "dm") {
    path = "/dm";
  }
  socket = io.connect(`:6677${path}`);
  socket.onAny((event, ...args) => {
    console.log("Socket event", event, args);
  });
});

export async function awaitSocket(): Promise<MySocket> {
  if (socket) {
    return socket;
  }
  const profile = await awaitLogin();
  const user = emailToCharacter(profile.email);
  if (!user) {
    throw new Error("Unknown user, cannot connect to socket");
  }
  let path = "";
  if (user === "dm") {
    path = "/dm";
  }
  socket = io.connect(`:6677${path}`);
  socket.onAny((event, ...args) => {
    console.log("Socket event", event, args);
  });
  return socket;
}

awaitSocket();

export function useSocket(): MySocket {
  if (!socket) {
    throw new Error("Socket not initialized");
  }
  return socket;
}
