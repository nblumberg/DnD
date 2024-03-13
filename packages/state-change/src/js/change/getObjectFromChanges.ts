import { Unique } from "../util/unique";
import { applyHistoryEntry } from "./applyChange";
import { ChangeHistory } from "./types";

export function getObjectFromChanges<T extends Unique>(
  id: string,
  changeHistory: ChangeHistory<T>,
  allowNeverAdded = false,
  getLastStateBeforeRemove = false
): T | undefined {
  if (!changeHistory.changes.length) {
    throw new Error("No history to get object from");
  }
  const objectHistory = changeHistory.changes.filter(
    ({ object }) => object === id
  );
  if (!objectHistory.length) {
    if (allowNeverAdded) {
      return undefined;
    }
    throw new Error(`No history for object ${id}`);
  }
  const add = objectHistory.shift();
  if (add!.type !== "+") {
    throw new Error(`First history entry for object ${id} isn't an add`);
  }
  let object = { ...add!.newValue! };
  for (const change of objectHistory) {
    switch (change.type) {
      case "c":
      case "c+":
      case "c-":
        object = applyHistoryEntry(change, object);
        break;
      case "-":
        if (!getLastStateBeforeRemove) {
          return undefined;
        }
    }
  }
  return object;
}
