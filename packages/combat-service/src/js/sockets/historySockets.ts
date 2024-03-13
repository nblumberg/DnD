import { Socket } from "socket.io";
import { getUniqueId, listenToHistory } from "state-change";
import {
  changeHistory,
  listenToUndoneHistory,
  redoHistory,
  undoHistory,
} from "../actions/historyActions";
import { state } from "../state";
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

  socket.emit("fullHistory", getUniqueId(), state.events, state.changes);

  listenToHistory(({ type, events, changes }) => {
    socket.emit("changeHistory", getUniqueId(), type, events, changes);
  });
  listenToUndoneHistory(({ events, changes }) => {
    socket.emit("fullUndoneHistory", getUniqueId(), events, changes);
  });
}
