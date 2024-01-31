import { CastMember } from "creature";
import { Socket } from "socket.io";
import { getObjectState, HistoryEntry, IChangeEvent } from "state-change";
import { addStatePropertyListener, state, updateState } from "../state";
import { replaceCastMember } from "../state/castMemberState";
import { serializeSocketUsers, SocketServer } from "./initAndAccessSockets";

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
      updateState({
        history: state.history,
        changes: state.changes,
      });
      const castMember = getObjectState<CastMember>(
        change.castMemberId,
        state.changes
      );
      if (!castMember) {
        throw new Error(`Couldn't find cast member ${change.castMemberId}`);
      }
      replaceCastMember(castMember);
    });
  });
}

function historyMessage(): [IChangeEvent[], HistoryEntry<CastMember>[]] {
  const { history = [], changes = [] } = state;
  return [history, changes];
}

function syncHistory(socket: Socket, _isDM = false): void {
  const users = serializeSocketUsers(socket);
  console.log(`History logic connected for ${users}`);

  const message = historyMessage();
  if (message) {
    socket.emit("history", ...message);
  }

  addStatePropertyListener("history", () => {
    console.log(`${users} detected history change`);
    const message = historyMessage();
    if (message) {
      socket.emit("history", ...message);
    }
  });
}
