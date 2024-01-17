import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "combat-service/client";
import type { Socket } from "socket.io-client";

type MySocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const { io } = window as unknown as {
  io: { connect: (uri: string) => MySocket };
};
const socket: MySocket = io.connect(":6677/dm");

socket.onAny((event, ...args) => {
  console.log("Socket event", event, args);
});

export function getSocket(): MySocket {
  return socket;
}
