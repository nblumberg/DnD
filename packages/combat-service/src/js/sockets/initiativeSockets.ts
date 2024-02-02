import { RollHistory } from "roll";
import { Socket } from "socket.io";
import { rollInitiative, startTurn } from "../actions/initiativeActions";
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
  const { castMembers, currentTurn } = state;
  if (!currentTurn) {
    return;
  }
  const currentTurnCastMember = castMembers[currentTurn];
  if (!currentTurnCastMember) {
    console.warn(`Couldn't find cast member for turn ${currentTurn}`);
    return;
  }
  return currentTurn;
}

function syncInitiative(socket: Socket, isDM = false): void {
  const users = serializeSocketUsers(socket);
  // console.log(`Initiative logic connected for ${users}`);

  const message = turnMessage();
  if (message) {
    socket.emit("turn", message);
  }

  addStatePropertyListener("currentTurn", () => {
    // console.log(`${users} detected turn change`);
    const message = turnMessage();
    if (message) {
      socket.emit("turn", message);
    }
  });

  socket.on("rollInitiative", (initiative?: Record<string, RollHistory>) => {
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
      if (!users.includes(state.currentTurn ?? "")) {
        console.warn(`${users} tried to end turn for ${id}`);
        return;
      }
    }
    startTurn(id);
  });
}
