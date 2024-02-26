import { CastMember } from "creature";
import { useEffect } from "react";
import { HistoryEntry, IChangeEvent } from "state-change";
import { useSocket } from "../api/sockets";
import { changeHistory } from "../reducers/changeHistory";
import { fullHistoryAction } from "../reducers/fullHistory";
import { useAppState } from "./state";

const receivedSockets = new Set<string>();

interface HistoryContextValue {
  history: IChangeEvent[];
  changes: HistoryEntry<CastMember>[];
}

export function useHistory(): HistoryContextValue {
  const [state, dispatch] = useAppState();

  const { history, changes } = state;

  const io = useSocket();
  useEffect(() => {
    if (!io) {
      return;
    }
    io.on("fullHistory", (id, history, changes): void => {
      if (receivedSockets.has(id)) {
        return;
      }
      receivedSockets.add(id);

      fullHistoryAction(dispatch, history, changes);
    });
    io.on("changeHistory", (id, type, history, changes): void => {
      if (receivedSockets.has(id)) {
        return;
      }
      receivedSockets.add(id);

      console.log("dispatch changeHistory", id, type, history, changes);

      changeHistory(dispatch, type, history, changes);
    });
    () => {
      io.off("fullHistory");
      io.off("changeHistory");
    };
  }, [dispatch, io]);

  return { history, changes };
}
