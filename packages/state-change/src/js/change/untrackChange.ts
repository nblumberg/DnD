import { Unique } from "../util/unique";
import { ChangeHistory, ChangeHistoryEntry } from "./types";

function findChangeByIdInChangeHistory<T extends Unique>(
  changeHistory: ChangeHistoryEntry<T>[],
  entry: ChangeHistoryEntry<T> | string
): number {
  const id = typeof entry === "string" ? entry : entry.id;
  return changeHistory.findIndex((change) => change.id === id);
}

export function untrackChange<T extends Unique>(
  oldChangeHistory: ChangeHistory<T>,
  entry: ChangeHistoryEntry<T> | string,
  replacements: ChangeHistoryEntry<T>[] = []
): ChangeHistory<T> {
  const changes = [...oldChangeHistory.changes];
  const index = findChangeByIdInChangeHistory(changes, entry);
  if (index === -1) {
    changes.push(...replacements);
  } else {
    changes.splice(index, 1, ...replacements);
  }
  return { changes };
}
