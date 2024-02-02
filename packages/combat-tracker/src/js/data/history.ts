import { CastMember } from "creature";
import { createContext, useEffect, useState } from "react";
import { setLog } from "roll";
import {
  HistoryEntry,
  IChangeEvent,
  getHistoryHandle,
  instantiateHistory,
  setHistory,
} from "state-change";
import { useSocket } from "../services/sockets";

setLog(() => {});

let cachedChanges: HistoryEntry<CastMember>[] = [];
let cachedHistory: IChangeEvent[] = [];

const receivedSockets = new Set<string>();

function handleChangeHistory(
  type: "=" | "+" | "-" | "c",
  history: IChangeEvent[],
  changes: HistoryEntry<CastMember>[]
): void {
  if (type === "=") {
    cachedChanges = changes;
    getHistoryHandle<CastMember>("CastMember").setHistory(cachedChanges);
    cachedHistory = setHistory(history);
  } else if (type === "+") {
    cachedChanges.push(...changes);
    const classes = instantiateHistory(history);
    classes.forEach((event) => {
      if (!cachedHistory.includes(event)) {
        // Protect against ChangeEvents instantiated from prior state that auto-add themselves to history
        cachedHistory.push(event);
      }
    });
  } else if (type === "-") {
    const removals = history.map(({ id }) => {
      const removal = cachedHistory.find((event) => event.id === id);
      if (!removal) {
        throw new Error(`Couldn't find ChangeEvent ${id} to remove`);
      }
      return removal;
    });
    removals.forEach((event) => {
      event.undo();
    });
  } else {
    history.forEach(({ id, changes: newChangeIds }) => {
      const cachedEvent = cachedHistory.find((event) => event.id === id);
      if (!cachedEvent) {
        throw new Error(`Couldn't find ChangeEvent ${id} to change`);
      }
      const oldChanges = cachedEvent.getChanges();
      const newChanges = newChangeIds.map((id) => {
        const newChange = changes.find((change) => change.id === id);
        if (!newChange) {
          throw new Error(`Couldn't find HistoryEntry ${id} to change`);
        }
        return newChange;
      });
      cachedChanges.splice(
        cachedChanges.indexOf(oldChanges[0]),
        oldChanges.length,
        ...newChanges
      );
    });
  }
}

interface HistoryContextValue {
  history: IChangeEvent[];
  changes: HistoryEntry<CastMember>[];
}

export function useHistory(): HistoryContextValue {
  const [_historyContext, setHistoryContext] = useState<HistoryContextValue>({
    history: [...cachedHistory],
    changes: [...cachedChanges],
  });
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
      cachedChanges = changes;
      getHistoryHandle<CastMember>("CastMember").setHistory(cachedChanges);
      cachedHistory = setHistory(history);

      setHistoryContext({
        history: cachedHistory,
        changes: cachedChanges,
      });

      console.log("fullHistory", cachedHistory, cachedChanges);
    });
    io.on("changeHistory", (id, type, history, changes): void => {
      if (receivedSockets.has(id)) {
        return;
      }
      receivedSockets.add(id);

      handleChangeHistory(type, history, changes);

      setHistoryContext({
        history: cachedHistory,
        changes: cachedChanges,
      });

      console.log("changeHistory", cachedHistory, cachedChanges);
    });
    () => {
      io.off("fullHistory");
      io.off("changeHistory");
    };
  }, [setHistoryContext, io]);

  return _historyContext;
}

export const HistoryContext = createContext<HistoryContextValue>({
  history: cachedHistory,
  changes: cachedChanges,
});
