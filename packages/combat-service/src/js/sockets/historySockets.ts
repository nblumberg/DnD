import { CastMember } from "creature";
import { Socket } from "socket.io";
import {
  getHistory,
  getHistoryHandle,
  getUniqueId,
  listenToHistory,
} from "state-change";
import {
  changeHistory,
  redoHistory,
  undoHistory,
} from "../actions/historyActions";
import { SocketServer } from "./initAndAccessSockets";

export function attachHistorySockets(io: SocketServer) {
  io.on("connection", (socket) => {
    syncHistory(socket);
  });

  io.of("/dm").on("connection", (socket) => {
    syncHistory(socket, true);

    socket.on("undoHistory", undoHistory);

    socket.on("redoHistory", redoHistory);

    socket.on("changeHistory", changeHistory);
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
