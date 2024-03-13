import { CastMember } from "creature";
import { createEventEmitter } from "event-emitter";
import * as fs from "fs";
import * as path from "path";
import {
  ChangeEvent,
  ChangeHistoryEntry,
  History,
  instantiateEvents,
  listenToHistory,
} from "state-change";
import { getTurnOrder } from "./actions/initiativeActions";
import { castMembersFromHistory } from "./state/castMemberState";

const stateFile = path.join(__dirname, "..", "..", "state.json");

interface UndoHistory {
  event: ChangeEvent;
  changes: ChangeHistoryEntry<CastMember>[];
}

export interface State {
  castMembers: Record<string, CastMember>;
  events: ChangeEvent[];
  changes: ChangeHistoryEntry<CastMember>[];
  undoArray: UndoHistory[];
  round: number;
  turnOrder: string[];
  currentTurn?: string;
}

const defaultState: State = {
  castMembers: {},
  events: [],
  changes: [],
  undoArray: [],
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
  tmp.events = instantiateEvents(tmp.events, tmp);
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

/**
 * Update cached derivative state
 */
function deriveState(): void {
  const castMembersList = castMembersFromHistory();
  state.turnOrder = getTurnOrder().map((castMember) => castMember.id);
  state.round = state.events.filter(
    ({ type }) => type === "ChangeRound"
  ).length;
  state.currentTurn = castMembersList.find(({ myTurn }) => myTurn)?.id;
}
deriveState();

export function onStateChange() {
  const { events, changes, round } = state;
  fs.writeFileSync(
    stateFile,
    JSON.stringify(
      {
        round,
        events,
        changes,
      },
      null,
      2
    )
  );
}

export function resetGame(): void {
  console.log("Resetting game");
  const changes: ChangeHistoryEntry<CastMember>[] = [];
  const events: ChangeEvent[] = [];
  updateState({ ...defaultState, events, changes }, true);
}

export function historyChange({ events, changes }: History) {
  updateState({ events, changes });
  onStateChange();
}

export function setState<P extends keyof State>(prop: P, value: State[P]) {
  updateState({ [prop]: value });
  onStateChange();
}

castMembersFromHistory();

onStateChange();

// TODO: both historyChange and listenToHistory are notified of changes, pick one
listenToHistory(() => {
  deriveState();

  // Persist state to disk
  onStateChange();
});
