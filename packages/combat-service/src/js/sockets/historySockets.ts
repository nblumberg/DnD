import { Socket } from "socket.io";
import { ChangeEvent, History, cloneHistory, getUniqueId } from "state-change";
import {
  changeHistory,
  listenToUndoneHistory,
  redoHistory,
  undoHistory,
} from "../actions/historyActions";
import { addStatePropertyListener, state } from "../state";
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

  let priorHistory = cloneHistory(state);
  addStatePropertyListener("events", (events) => {
    const added = events.filter(
      (newEvent) => !findEvent(newEvent.id, priorHistory)
    );
    if (added.length) {
      socket.emit(
        "changeHistory",
        getUniqueId(),
        "+",
        added,
        added.flatMap((event) => event.getChanges(state))
      );
    }
    const removed = priorHistory.events.filter(
      (oldEvent) => !findEvent(oldEvent.id, state)
    );
    if (removed.length) {
      socket.emit(
        "changeHistory",
        getUniqueId(),
        "-",
        removed,
        removed.flatMap((event) => event.getChanges(priorHistory))
      );
    }
    const changed = events.filter(
      (event) =>
        !equivalentArrays(
          event.changes,
          findEvent(event.id, priorHistory)?.changes ?? []
        )
    );
    if (changed.length) {
      socket.emit(
        "changeHistory",
        getUniqueId(),
        "c",
        changed,
        changed.flatMap((event) => event.getChanges(state))
      );
    }
    priorHistory = cloneHistory(state);
  });

  // listenToHistory(({ type, events, changes }) => {
  //   socket.emit("changeHistory", getUniqueId(), type, events, changes);
  // });
  listenToUndoneHistory(({ events, changes }) => {
    socket.emit("fullUndoneHistory", getUniqueId(), events, changes);
  });
}

function findEvent(id: string, history: History): ChangeEvent | undefined {
  return history.events.find((event) => event.id === id);
}

function equivalentArrays(array1: any[], array2: any[]): boolean {
  return (
    array1.length === array2.length &&
    array1.every((value, index) => value === array2[index])
  );
}
