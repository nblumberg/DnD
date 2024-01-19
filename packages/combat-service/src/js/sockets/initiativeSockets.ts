import { Socket } from "socket.io";
import {
  getTurnOrder,
  rollInitiative,
  startTurn,
} from "../actions/initiativeActions";
import { addStatePropertyListener, state } from "../state";
import { SocketServer, serializeSocketUsers } from "./initAndAccessSockets";

export function attachInitiativeSockets(io: SocketServer) {
  io.on("connection", (socket) => {
    syncInitiative(socket);
  });

  io.of("/dm").on("connection", (socket) => {
    syncInitiative(socket, true);
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

function syncInitiative(socket: Socket, isDM = false): void {
  const users = serializeSocketUsers(socket);
  console.log(`Initiative logic connected for ${users}`);

  const message = turnMessage();
  if (message) {
    socket.emit("turn", message);
  }

  addStatePropertyListener("turnIndex", () => {
    console.log(`${users} detected turn change`);
    const message = turnMessage();
    if (message) {
      socket.emit("turn", message);
    }
  });

  socket.on("rollInitiative", (initiative?: Record<string, number>) => {
    if (!isDM) {
      const notMyIds = Object.keys(initiative || {}).filter(
        (id) => !users.includes(id)
      );
      if (notMyIds.length) {
        console.warn(
          `${users} tried to roll initiative for ${notMyIds.join(", ")}`
        );
        return;
      }
    }
    rollInitiative(initiative);
  });
  socket.on("turn", (id: string) => {
    if (!isDM) {
      if (!users.includes(getTurnOrder()[state.turnIndex]?.id)) {
        console.warn(`${users} tried to end turn for ${id}`);
        return;
      }
    }
    startTurn(id);
  });
}
