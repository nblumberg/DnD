import { History } from "./types";

export function cloneHistory(history: History): History {
  return { events: [...history.events], changes: [...history.changes] };
}
