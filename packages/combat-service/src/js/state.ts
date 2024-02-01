import { CastMember } from "creature";
import { createEventEmitter } from "event-emitter";
import * as fs from "fs";
import * as path from "path";
import {
  HistoryEntry,
  IChangeEvent,
  getHistory,
  getHistoryHandle,
  setHistory,
} from "state-change";
import { initializeCastMembersState } from "./state/castMemberState";

const stateFile = path.join(__dirname, "..", "..", "state.json");

export interface State {
  castMembers: Record<string, CastMember>;
  history: IChangeEvent[];
  changes: HistoryEntry<CastMember>[];
  round: number;
  turnOrder: string[];
  currentTurn?: string;
}

const defaultState: State = {
  castMembers: {},
  history: [],
  changes: [],
  round: 0,
  currentTurn: undefined,
  turnOrder: [],
};
let tmp: State = {
  ...defaultState,
};
try {
  const json = fs.readFileSync(stateFile, "utf8");
  tmp = JSON.parse(json);

  getHistoryHandle<CastMember>("CastMember").setHistory(tmp.changes);
  tmp.history = setHistory(tmp.history);
} catch (e) {
  if (e && typeof e === "object" && "code" in e && e?.code !== "ENOENT") {
    throw e;
  }
  // Ignore the file not existing
}
export const state: State = {
  ...defaultState,
  ...tmp,
};

export const {
  addListener: addStateChangeListener,
  addPropertyListener: addStatePropertyListener,
  setData: updateState,
} = createEventEmitter(state);

export function resetGame(): void {
  console.log("Resetting game");
  const changes: HistoryEntry<CastMember>[] = [];
  const history: IChangeEvent[] = [];
  updateState({ ...defaultState, history, changes }, true);
  getHistoryHandle<CastMember>("CastMember").setHistory(changes);
  setHistory(history);
  onHistoryChange();
  onStateChange();
}

export function onHistoryChange(): void {
  updateState({ history: [...state.history], changes: state.changes });
}

export function onStateChange() {
  const changes = getHistoryHandle<CastMember>("CastMember").getHistory();
  const history = getHistory();
  const { round } = state;
  fs.writeFileSync(
    stateFile,
    JSON.stringify(
      {
        changes,
        history,
        round,
      },
      null,
      2
    )
  );
}

export function setState<P extends keyof State>(prop: P, value: State[P]) {
  updateState({ [prop]: value });
  onStateChange();
}

initializeCastMembersState(state);

onStateChange();
