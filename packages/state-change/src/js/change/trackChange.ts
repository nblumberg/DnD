import { Unique } from "../util/unique";
import {
  ChangeHistory,
  ChangeHistoryEntry,
  HistoryEntryParam,
  StateAdd,
  StateChange,
  StateRemove,
} from "./types";

interface TrackResult<T extends Unique> extends ChangeHistory<T> {
  newlyTracked: ChangeHistoryEntry<T>[];
}
interface TrackAdd<T extends Unique> extends ChangeHistory<T> {
  newlyTracked: StateAdd<T>;
}
interface TrackRemove<T extends Unique> extends ChangeHistory<T> {
  newlyTracked: StateRemove<T>;
}
interface TrackPropertyChange<T extends Unique, P extends keyof T>
  extends ChangeHistory<T> {
  newlyTracked: StateChange<T, P>;
}

export function trackChanges<T extends Unique>(
  oldChangeHistory: ChangeHistory<T>,
  params: HistoryEntryParam<T> | HistoryEntryParam<T>[] | undefined,
  insertIndex?: number
): TrackResult<T> {
  if (!params || (Array.isArray(params) && !params.length)) {
    return { changes: oldChangeHistory.changes, newlyTracked: [] };
  }
  const changes = [...oldChangeHistory.changes];
  const newlyTracked = (Array.isArray(params) ? params : [params]).map(
    (param, i): ChangeHistoryEntry<T> => ({
      id: `${changes.length + i}`,
      type: param.type,
      action: param.action,
      object: param.object,
      property: param.property,
      oldValue: param.oldValue,
      newValue: param.newValue,
    })
  );
  if (insertIndex === undefined || insertIndex === -1) {
    changes.push(...newlyTracked);
  } else {
    changes.splice(insertIndex, 0, ...newlyTracked);
  }
  return { changes, newlyTracked };
}

export function trackAdd<T extends Unique>(
  oldChangeHistory: ChangeHistory<T>,
  object: T,
  action: string,
  insertIndex?: number
): TrackAdd<T> {
  const { changes, newlyTracked } = trackChanges(
    oldChangeHistory,
    [
      {
        type: "+",
        action,
        object: object.id,
        newValue: object,
      },
    ],
    insertIndex
  );
  return { changes, newlyTracked: newlyTracked[0] as StateAdd<T> };
}

export function trackRemove<T extends Unique>(
  oldChangeHistory: ChangeHistory<T>,
  object: T,
  action: string,
  insertIndex?: number
): TrackRemove<T> {
  const { changes, newlyTracked } = trackChanges(
    oldChangeHistory,
    [
      {
        type: "-",
        action,
        object: object.id,
        newValue: object,
      },
    ],
    insertIndex
  );
  return { changes, newlyTracked: newlyTracked[0] as StateRemove<T> };
}

export function trackPropertyChange<T extends Unique>(
  oldChangeHistory: ChangeHistory<T>,
  object: T,
  action: string,
  property: keyof T,
  oldValue?: T[keyof T],
  newValue?: T[keyof T],
  insertIndex?: number
): TrackPropertyChange<T, keyof T> {
  const { changes, newlyTracked } = trackChanges(
    oldChangeHistory,
    [
      {
        type: "c",
        action,
        object: object.id,
        property,
        oldValue,
        newValue,
      },
    ],
    insertIndex
  );
  return { changes, newlyTracked: newlyTracked[0] as StateChange<T, keyof T> };
}
