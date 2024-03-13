import { CastMember } from "creature";
import { ChangeHistoryEntry } from "..";
import { IChangeEvent } from "./types";

interface HistoryListenerEvent {
  type: "=" | "+" | "-" | "c";
  events: IChangeEvent[];
  changes: ChangeHistoryEntry<CastMember>[];
}
interface HistoryListener {
  (event: HistoryListenerEvent): void;
}

const listeners: HistoryListener[] = [];

export function listenToHistory(callback: HistoryListener): void {
  listeners.push(callback);
}

export function dispatchHistoryChange(event: HistoryListenerEvent): void {
  listeners.forEach((listener) => listener(event));
}
