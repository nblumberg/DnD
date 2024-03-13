import { useEffect } from "react";
import { History } from "state-change";
import { useSocket } from "../api/sockets";
import { changeHistory } from "../reducers/changeHistory";
import { fullHistoryAction } from "../reducers/fullHistory";
import { fullUndoneHistoryAction } from "../reducers/fullUndoneHistory";
import { useAppState } from "./state";

const receivedSockets = new Set<string>();

export function useHistory(): History {
  const [state, dispatch] = useAppState();

  const { events, changes } = state;

  const io = useSocket();
  useEffect(() => {
    if (!io) {
      return;
    }
    io.on("fullHistory", (id, events, changes): void => {
      if (receivedSockets.has(id)) {
        return;
      }
      receivedSockets.add(id);

      fullHistoryAction(dispatch, events, changes);
    });
    io.on("changeHistory", (id, type, events, changes): void => {
      if (receivedSockets.has(id)) {
        return;
      }
      receivedSockets.add(id);

      console.log("dispatch changeHistory", id, type, events, changes);

      changeHistory(dispatch, type, events, changes);
    });
    io.on("fullUndoneHistory", (id, events, changes): void => {
      if (receivedSockets.has(id)) {
        return;
      }
      receivedSockets.add(id);
      fullUndoneHistoryAction(dispatch, events, changes);
    });
    () => {
      io.off("fullHistory");
      io.off("changeHistory");
      io.off("fullUndoneHistory");
    };
  }, [dispatch, io]);

  return { events, changes };
}
