import { ChangeEvent } from "./changeEvent";
import { cloneHistory } from "./cloneHistory";
import { dispatchHistoryChange } from "./historyListeners";
import { History } from "./types";

export function addEventToHistory(
  history: History,
  event: ChangeEvent
): History {
  const newHistory = cloneHistory(history);
  newHistory.events.push(event);
  dispatchHistoryChange({
    type: "+",
    events: [event],
    changes: event.getChanges(newHistory),
  });
  return newHistory;
}
