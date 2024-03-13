import { Unique } from "../util/unique";
import { toggleStateChange } from "./toggleChange";
import {
  ChangeHistoryEntry,
  StateAdd,
  StateChange,
  StateRemove,
} from "./types";

export function applyHistoryEntry<T extends Unique, E extends StateAdd<T>>(
  entry: E,
  object?: T
): T;

export function applyHistoryEntry<T extends Unique, E extends StateRemove<T>>(
  entry: E,
  object: T
): undefined;

export function applyHistoryEntry<
  T extends Unique,
  E extends StateChange<T, keyof T>,
>(entry: E, object: T): T;

export function applyHistoryEntry<
  T extends Unique,
  E extends StateChange<T, keyof T>,
>(entry: E, object: T): T;

export function applyHistoryEntry<
  T extends Unique,
  E extends ChangeHistoryEntry<T>,
>(entry: E, object?: T): T | undefined {
  if (entry.type === "+") {
    return entry.newValue!;
  } else if (entry.type === "-") {
    return undefined;
  }
  if (!object) {
    throw new Error(
      `Cannot apply state change ${entry.id} (${entry.object}) to missing object`
    );
  }
  return toggleStateChange("apply", entry, object);
}
