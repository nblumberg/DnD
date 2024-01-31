import { CastMember } from "creature";
import { Unique, getUniqueId } from "../util/unique";

export interface StateAdd<T extends Unique> extends Unique {
  type: "+";
  action: string;
  object: T["id"];
  newValue?: T;
}

export interface StateRemove<T extends Unique> extends Unique {
  type: "-";
  action: string;
  object: T["id"];
  oldValue?: T;
}

export interface StateChange<T extends Unique, P extends keyof T>
  extends Unique {
  type: "c" | "c+" | "c-";
  action: string;
  object: T["id"];
  property: P;
  oldValue?: T[P] | Partial<T[P]>;
  newValue?: T[P] | Partial<T[P]>;
}

type StateAddParam<T extends Unique> = Omit<StateAdd<T>, "id">;
type StateRemoveParam<T extends Unique> = Omit<StateRemove<T>, "id">;
type StateChangeParam<T extends Unique> = Omit<StateChange<T, keyof T>, "id">;
type HistoryEntryParam<T extends Unique> =
  | StateAddParam<T>
  | StateRemoveParam<T>
  | StateChangeParam<T>;

export type HistoryEntry<T extends Unique> =
  | StateAdd<T>
  | StateRemove<T>
  | StateChange<T, keyof T>;

export interface ChangeState<T extends Unique> {
  (startingState: T, ...args: any[]): T;
}

export interface AddToState<T extends Unique> extends ChangeState<T> {
  (startingState: T): T;
}

export interface RemoveFromState<T extends Unique> extends ChangeState<T> {
  (startingState: T): T;
}

export interface ApplyStateChange<T extends Unique, P extends keyof T> {
  (change: StateChange<T, P>, object: T): T;
}

export interface UndoStateChange<T extends Unique, P extends keyof T> {
  (change: StateChange<T, P>, object: T): T;
}

function toggleStateChange<T extends Unique, P extends keyof T>(
  action: "apply" | "undo",
  change: StateChange<T, P>,
  object: T
): T {
  if (change.object !== object.id) {
    throw new Error(
      `Attempting to ${action} state change ${change.id} (${change.object}) to object ${object.id}`
    );
  }
  const { property } = change;
  const value = action === "apply" ? change.newValue : change.oldValue;
  const type = typeof (object[property] ?? value);
  switch (type) {
    case "bigint":
    case "boolean":
    case "number":
    case "string":
    case "symbol":
    case "undefined":
      if (value === undefined) {
        return Object.fromEntries(
          Object.entries(object).filter(([key]) => key !== property)
        ) as T;
      }
      return {
        ...object,
        [property]: value,
      };
    case "object":
      if (Array.isArray(value)) {
        return {
          ...object,
          [property]: value,
        };
      } else if (!value) {
        if (change.type === "c+" || change.type === "c-") {
          return {
            ...object,
            [property]: Object.fromEntries(
              Object.entries(object[property]).filter(
                ([key]) =>
                  !Object.prototype.hasOwnProperty.call(
                    change.oldValue ?? change.newValue,
                    key
                  )
              )
            ),
          };
        } else {
          return Object.fromEntries(
            Object.entries(object).filter(([key]) => key !== property)
          ) as T;
        }
      }
      return {
        ...object,
        [property]: { ...object[property], ...value },
      };
    case "function":
    default:
      throw new Error(
        `Cannot ${action} state change ${change.id} (${
          change.object
        }) to object ${object.id} property ${String(property)} of type ${type}`
      );
  }
}

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
export function applyHistoryEntry<T extends Unique, E extends HistoryEntry<T>>(
  entry: E,
  object?: T
): T | undefined {
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

export function undoHistoryEntry<T extends Unique>(
  entry: StateAdd<T>,
  object: T
): undefined;
export function undoHistoryEntry<T extends Unique>(
  entry: StateRemove<T>,
  object?: T
): T;
export function undoHistoryEntry<T extends Unique>(
  entry: StateChange<T, keyof T>,
  object: T
): T;
export function undoHistoryEntry<T extends Unique>(
  entry: HistoryEntry<T>,
  object?: T
): T | undefined {
  if (entry.type === "+") {
    return undefined;
  } else if (entry.type === "-") {
    return entry.oldValue!;
  }
  if (!object) {
    throw new Error(
      `Cannot undo state change ${entry.id} (${entry.object}) from missing object`
    );
  }
  return toggleStateChange("undo", entry, object);
}

export function undoStateRemove<T extends Unique>(
  change: StateRemove<T>,
  history: HistoryEntry<T>[]
): T {
  const { object: id } = change;
  const historyBeforeRemove = history.slice(0, history.indexOf(change));
  const object = getObjectState(id, historyBeforeRemove);
  if (!object) {
    throw new Error(`Object ${id} was removed more than once`);
  }
  return object as T;
}

export function getObjectState<T extends Unique>(
  id: string,
  history: HistoryEntry<T>[],
  allowNeverAdded = false,
  getLastStateBeforeRemove = false
): T | undefined {
  const objectHistory = history.filter(({ object }) => object === id);
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

const histories = new Map<string, HistoryEntry<any>[]>();

export function getHistoryHandle<T extends Unique = CastMember>(type: string) {
  function _getHistory(): HistoryEntry<T>[] {
    let history = histories.get(type);
    if (!history) {
      history = [];
      histories.set(type, history);
    }
    return history as HistoryEntry<T>[];
  }

  function getHistory(): HistoryEntry<T>[] {
    return [..._getHistory()];
  }

  function setHistory(param: HistoryEntry<T>[] | string): void {
    let newHistory: HistoryEntry<T>[] =
      typeof param === "string"
        ? (JSON.parse(param) as HistoryEntry<T>[])
        : param;
    histories.set(type, newHistory);
  }

  function pushStateHistory(
    params: HistoryEntryParam<T> | HistoryEntryParam<T>[],
    insertIndex?: number
  ): HistoryEntry<T>[] {
    const history = _getHistory();
    const entries = (Array.isArray(params) ? params : [params]).map(
      (param, i): HistoryEntry<T> => ({
        id: `${history.length + i}`,
        type: param.type,
        action: param.action,
        object: param.object,
        property: param.property,
        oldValue: param.oldValue,
        newValue: param.newValue,
      })
    );
    if (insertIndex === undefined || insertIndex === -1) {
      history.push(...entries);
    } else {
      history.splice(insertIndex, 0, ...entries);
    }
    return entries;
  }

  function pushStateAdd(
    object: T,
    action: string,
    insertIndex?: number
  ): StateAdd<T> {
    return pushStateHistory(
      [
        {
          type: "+",
          action,
          object: object.id,
          newValue: object,
        },
      ],
      insertIndex
    )[0] as StateAdd<T>;
  }

  function pushStateRemove(
    object: T,
    action: string,
    insertIndex?: number
  ): StateRemove<T> {
    return pushStateHistory(
      [
        {
          type: "-",
          action,
          object: object.id,
          newValue: object,
        },
      ],
      insertIndex
    )[0] as StateRemove<T>;
  }

  function pushStateChange(
    object: T,
    action: string,
    property: keyof T,
    oldValue?: T[keyof T],
    newValue?: T[keyof T],
    insertIndex?: number
  ): StateChange<T, keyof T> {
    return pushStateHistory(
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
    )[0] as StateChange<T, keyof T>;
  }

  function findStateHistoryIndex(entry: HistoryEntry<T> | string): number {
    const id = typeof entry === "string" ? entry : entry.id;
    const history = _getHistory();
    return history.findIndex((change) => change.id === id);
  }

  function popStateHistory(
    entry: HistoryEntry<T> | string,
    replacements?: HistoryEntry<T>[]
  ): void {
    const history = _getHistory();
    const index = findStateHistoryIndex(entry);
    if (replacements) {
      if (index === -1) {
        history.push(...replacements);
      } else {
        history.splice(index, 1, ...replacements);
      }
    } else if (index === -1) {
      return;
    }
  }

  return {
    getHistory,
    setHistory,
    pushStateHistory,
    pushStateAdd,
    pushStateRemove,
    pushStateChange,
    popStateHistory,
  };
}

export function createStateAdd<T extends Unique>(
  object: T,
  action: string
): StateAdd<T> {
  return {
    id: getUniqueId(),
    type: "+",
    action,
    object: object.id,
    newValue: object,
  };
}

export function createStateRemove<T extends Unique>(
  object: T,
  action: string
): StateRemove<T> {
  return {
    id: getUniqueId(),
    type: "-",
    action,
    object: object.id,
    oldValue: object,
  };
}

export function createStateChange<T extends Unique, P extends keyof T>(
  object: T,
  action: string,
  property: P,
  oldValue?: T[P],
  newValue?: T[P],
  type: "c" | "c+" | "c-" = "c"
): StateChange<T, P> {
  return {
    id: getUniqueId(),
    type,
    action,
    object: object.id,
    property,
    oldValue,
    newValue,
  };
}
