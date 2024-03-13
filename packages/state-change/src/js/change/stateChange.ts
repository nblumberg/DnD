import { CastMember } from "creature";
import { Unique, preExistingUniqueId } from "../util/unique";
import {
  ChangeHistoryEntry,
  HistoryEntryParam,
  StateAdd,
  StateChange,
  StateRemove,
} from "./types";

const histories = new Map<string, ChangeHistoryEntry<any>[]>();

export function getHistoryHandle<T extends Unique = CastMember>(type: string) {
  function _getHistory(): ChangeHistoryEntry<T>[] {
    let history = histories.get(type);
    if (!history) {
      history = [];
      histories.set(type, history);
    }
    return history as ChangeHistoryEntry<T>[];
  }

  function getHistory(): ChangeHistoryEntry<T>[] {
    return [..._getHistory()];
  }

  function setHistory(param: ChangeHistoryEntry<T>[] | string): void {
    let newHistory: ChangeHistoryEntry<T>[] =
      typeof param === "string"
        ? (JSON.parse(param) as ChangeHistoryEntry<T>[])
        : param;
    newHistory.forEach((entry) => {
      preExistingUniqueId(entry.id);
    });
    histories.set(type, newHistory);
  }

  function pushStateHistory(
    params: HistoryEntryParam<T> | HistoryEntryParam<T>[],
    insertIndex?: number
  ): ChangeHistoryEntry<T>[] {
    const history = _getHistory();
    const entries = (Array.isArray(params) ? params : [params]).map(
      (param, i): ChangeHistoryEntry<T> => ({
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

  function findStateHistoryIndex(
    entry: ChangeHistoryEntry<T> | string
  ): number {
    const id = typeof entry === "string" ? entry : entry.id;
    const history = _getHistory();
    return history.findIndex((change) => change.id === id);
  }

  function popStateHistory(
    entry: ChangeHistoryEntry<T> | string,
    replacements: ChangeHistoryEntry<T>[] = []
  ): void {
    const history = _getHistory();
    const index = findStateHistoryIndex(entry);
    if (index === -1) {
      history.push(...replacements);
    } else {
      history.splice(index, 1, ...replacements);
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
