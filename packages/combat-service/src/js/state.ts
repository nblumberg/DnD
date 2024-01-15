import { CastMember, CastMemberParams, CastMemberRaw } from "creature";
import { createEventEmitter } from "event-emitter";
import * as fs from "fs";
import * as path from "path";

const stateFile = path.join(__dirname, "..", "..", "state.json");

interface State {
  castMembers: Record<string, CastMember>;
  turnOrder: string[];
  turnIndex: number;
}

export const state: State = {
  castMembers: {},
  turnIndex: Infinity,
  turnOrder: [],
  ...JSON.parse(fs.readFileSync(stateFile, "utf8")),
};
for (const [id, castMember] of Object.entries(state.castMembers)) {
  state.castMembers[id] = new CastMember(castMember);
}

const { setData: updateState } = createEventEmitter(state);
const { setData: updateCastMembers } = createEventEmitter(state.castMembers);
const updateCastMember: Record<
  string,
  ReturnType<typeof createEventEmitter>["setData"]
> = {};

function onStateChange() {
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

export function setState<P extends keyof State>(prop: P, value: State[P]) {
  updateState({ [prop]: value });
  onStateChange();
}

export function addCastMember(rawCastMember: CastMemberParams): CastMember {
  const castMember = new CastMember(rawCastMember);
  const { setData: updateMe } = createEventEmitter(castMember);
  updateCastMember[castMember.id] = updateMe;
  updateCastMembers({ [castMember.id]: castMember });
  updateState({ castMembers: state.castMembers });
  onStateChange();
  return castMember;
}

export function removeCastMember(id: string) {
  delete updateCastMember[id];
  updateCastMembers(
    Object.fromEntries(
      Object.entries(state.castMembers).filter(([key]) => key !== id)
    )
  );
  updateState({ castMembers: state.castMembers });
  onStateChange();
}

export function setCastMemberState<P extends keyof CastMemberRaw>(
  id: string,
  prop: P,
  value: CastMemberRaw[P]
) {
  const updateMe = updateCastMember[id];
  updateMe({ [prop]: value });
  const castMember = state.castMembers[id];
  updateCastMembers({ [castMember.id]: castMember });
  updateState({ castMembers: state.castMembers });
  onStateChange();
}
