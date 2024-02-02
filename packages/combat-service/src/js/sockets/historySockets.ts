import { CastMember } from "creature";
import { Socket } from "socket.io";
import {
  getHistory,
  getHistoryHandle,
  getUniqueId,
  listenToHistory,
} from "state-change";
import { state } from "../state";
import { SocketServer } from "./initAndAccessSockets";

export function attachHistorySockets(io: SocketServer) {
  io.on("connection", (socket) => {
    syncHistory(socket);
  });

  io.of("/dm").on("connection", (socket) => {
    syncHistory(socket, true);

    socket.on("changeHistory", (id: string, ...params: any[]) => {
      console.log(`DM changeHistory ${id} ${params}`);
      const change = state.history.find((entry) => entry.id === id);
      if (!change) {
        console.error(`Couldn't find change ${id}`);
        return;
      }
      change.change(...params);
    });
  });
}

function syncHistory(socket: Socket, _isDM = false): void {
  // const users = serializeSocketUsers(socket);
  // console.log(`History logic connected for ${users}`);

  socket.emit(
    "fullHistory",
    getUniqueId(),
    getHistory(),
    getHistoryHandle<CastMember>("CastMember").getHistory()
  );

  listenToHistory(({ type, history, changes }) => {
    // console.log(`${users} detected history change`);
    socket.emit("changeHistory", getUniqueId(), type, history, changes);
  });
}
