import { CastMember } from "creature";
import { useEffect, useState } from "react";
import { setLog } from "roll";
import {
  HistoryEntry,
  IChangeEvent,
  getHistoryHandle,
  setHistory as instantiateHistory,
} from "state-change";
import { awaitSocket, useSocket } from "../services/sockets";

setLog(() => {});

let cachedChanges: HistoryEntry<CastMember>[] = [];
let cachedHistory: IChangeEvent[] = [];

awaitSocket().then((io) => {
  io.on("history", (history: IChangeEvent[]) => {
    console.log("History changed");
    cachedHistory = history;
  });
});

export function useHistory(): IChangeEvent[] {
  const [history, setHistory] = useState<IChangeEvent[]>([...cachedHistory]);
  const io = useSocket();
  useEffect(() => {
    if (!io) {
      return;
    }
    io.on(
      "history",
      (history: IChangeEvent[], changes: HistoryEntry<CastMember>[]): void => {
        cachedChanges = changes;
        getHistoryHandle<CastMember>("CastMember").setHistory(cachedChanges);
        cachedHistory = instantiateHistory(history);
        setHistory(cachedHistory);
      }
    );
    () => {
      io.off("history");
    };
  }, [setHistory, io]);
  return history;
}
