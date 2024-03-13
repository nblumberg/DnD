import { CastMember } from "creature";
import { ChangeHistoryEntry } from "..";
import { dispatchHistoryChange } from "./historyListeners";
import { History, IChangeEvent } from "./types";

export function removeEventFromHistory(
  history: History,
  event: IChangeEvent,
  changes: ChangeHistoryEntry<CastMember>[]
): History {
  dispatchHistoryChange({ type: "-", events: [event], changes });
  const newHistory = {
    events: [...history.events],
    changes: [...history.changes],
  };
  newHistory.events.splice(
    newHistory.events.findIndex(({ id }) => id === event.id),
    1
  );
  return newHistory;
}
