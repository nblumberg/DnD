import { CastMember } from "packages/creature/dist/js";

interface Unique extends Record<string, any> {
  id: string;
}

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
        if (change.type === "c-") {
          return {
            ...object,
            [property]: Object.fromEntries(
              Object.entries(object[property]).filter(
                ([key]) =>
                  !Object.prototype.hasOwnProperty.call(change.oldValue, key)
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

export function applyStateChange<T extends Unique, P extends keyof T>(
  change: StateChange<T, P>,
  object: T
): T {
  return toggleStateChange("apply", change, object);
}

export function undoStateChange<T extends Unique, P extends keyof T>(
  change: StateChange<T, P>,
  object: T
): T {
  return toggleStateChange("undo", change, object);
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
  history: HistoryEntry<T>[]
): T | undefined {
  const objectHistory = history.filter(({ object }) => object === id);
  if (!objectHistory.length) {
    throw new Error(`No history for object ${id}`);
  }
  const add = objectHistory.shift();
  if (add!.type !== "+") {
    throw new Error(`First history entry for object ${id} isn't an add`);
  }
  let object = add!.newValue!;
  for (const change of objectHistory) {
    switch (change.type) {
      case "c":
      case "c+":
      case "c-":
        object = applyStateChange(change, object);
        break;
      case "-":
        return undefined;
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

  function setHistory(newHistory: HistoryEntry<T>[]): void {
    histories.set(type, newHistory);
  }

  function pushStateHistory(param: HistoryEntryParam<T>): HistoryEntry<T> {
    const history = _getHistory();
    const entry: HistoryEntry<T> = {
      type: param.type,
      action: param.action,
      object: param.object,
      ...param,
      id: `${history.length}`,
    };
    history.push(entry);
    return entry;
  }

  function pushStateAdd(object: T, action: string): StateAdd<T> {
    return pushStateHistory({
      type: "+",
      action,
      object: object.id,
      newValue: object,
    }) as StateAdd<T>;
  }

  function pushStateRemove(object: T, action: string): StateRemove<T> {
    return pushStateHistory({
      type: "-",
      action,
      object: object.id,
      newValue: object,
    }) as StateRemove<T>;
  }

  function pushStateChange(
    object: T,
    action: string,
    property: keyof T,
    oldValue?: T[keyof T],
    newValue?: T[keyof T]
  ): StateChange<T, keyof T> {
    return pushStateHistory({
      type: "c",
      action,
      object: object.id,
      property,
      oldValue,
      newValue,
    }) as StateChange<T, keyof T>;
  }

  function popStateHistory(entry: HistoryEntry<T>): void {
    const { id } = entry;
    const history = _getHistory();
    const index = history.findIndex((change) => change.id === id);
    if (index === -1) {
      return;
    }
    history.splice(index, 1);
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
