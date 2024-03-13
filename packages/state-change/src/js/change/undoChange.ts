import { Unique } from "../util/unique";
import { getObjectFromChanges } from "./getObjectFromChanges";
import { toggleStateChange } from "./toggleChange";
import {
  ChangeHistoryEntry,
  StateAdd,
  StateChange,
  StateRemove,
} from "./types";

export function undoHistoryEntry<T extends Unique>(
  change: ChangeHistoryEntry<T>,
  object?: T
): T | undefined;
export function undoHistoryEntry<T extends Unique>(
  change: StateAdd<T>,
  object: T
): undefined;
export function undoHistoryEntry<T extends Unique>(
  change: StateRemove<T>,
  object?: T
): T;
export function undoHistoryEntry<T extends Unique>(
  change: StateChange<T, keyof T>,
  object: T
): T;
export function undoHistoryEntry<T extends Unique>(
  change: ChangeHistoryEntry<T>,
  object?: T
): T | undefined {
  if (change.type === "+") {
    return undefined;
  } else if (change.type === "-") {
    return change.oldValue!;
  }
  if (!object) {
    throw new Error(
      `Cannot undo state change ${change.id} (${change.object}) from missing object`
    );
  }
  return toggleStateChange("undo", change, object);
}

export function undoStateRemove<T extends Unique>(
  change: StateRemove<T>,
  changes: ChangeHistoryEntry<T>[]
): T {
  const { object: id } = change;
  const historyBeforeRemove = changes.slice(0, changes.indexOf(change));
  const object = getObjectFromChanges(id, { changes: historyBeforeRemove });
  if (!object) {
    throw new Error(`Object ${id} was removed more than once`);
  }
  return object as T;
}
