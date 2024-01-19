import { CastMember, CastMemberRaw } from "creature";
import { createEventEmitter } from "event-emitter";
import * as fs from "fs";
import * as path from "path";
import { initializeCastMembersState } from "./state/castMemberState";

const stateFile = path.join(__dirname, "..", "..", "state.json");

export interface State {
  castMembers: Record<string, CastMember>;
  round: number;
  turnOrder: string[];
  currentTurn?: string;
}

const defaultState: State = {
  castMembers: {},
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

export function onStateChange() {
  fs.writeFileSync(
    stateFile,
    JSON.stringify(
      {
        ...state,
        castMembers: Object.fromEntries(
          Object.entries(state.castMembers).map(([id, castMember]) => [
            id,
            castMember.raw(),
          ])
        ),
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

initializeCastMembersState(
  state as State & { castMembers: Record<string, CastMemberRaw> }
);

onStateChange();
