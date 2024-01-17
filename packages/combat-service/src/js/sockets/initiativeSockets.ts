import { Socket } from "socket.io";
import {
  getTurnOrder,
  rollInitiative,
  startTurn,
} from "../actions/initiativeActions";
import { addStatePropertyListener, state } from "../state";
import { SocketServer } from "./initAndAccessSockets";

export function attachInitiativeSockets(io: SocketServer) {
  io.on("connection", (socket) => {
    syncInitiative(socket);
  });

  io.of("/dm").on("connection", (socket) => {
    syncInitiative(socket);

    socket.on("rollInitiative", (initiative: Record<string, number>) => {
      rollInitiative(initiative);
    });
    socket.on("turn", (id: string) => {
      startTurn(id);
    });
  });
}

function turnMessage(): string | undefined {
  const castMembers = getTurnOrder();
  const currentTurn = castMembers[state.turnIndex]?.id;
  if (!currentTurn) {
    console.warn(`Couldn't find cast member for turn ${state.turnIndex}`);
    return;
  }
  return currentTurn;
}

function syncInitiative(socket: Socket): void {
  const playerDM = Array.from(socket.rooms.values()).toString();
  const userId = socket.handshake.address;
  console.log(`${playerDM} initiative logic connected from ${userId}`);

  const message = turnMessage();
  if (message) {
    socket.emit("turn", message);
  }

  addStatePropertyListener("turnIndex", () => {
    console.log(`${playerDM} ${userId} detected turn change`);
    const message = turnMessage();
    if (message) {
      socket.emit("turn", message);
    }
  });
}
