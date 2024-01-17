import { CastMember, CastMemberParams, CastMemberRaw } from "creature";
import {
  AddListener,
  AddPropertyListener,
  RemoveListener,
  SetData,
  createEventEmitter,
} from "event-emitter";
import { State, onStateChange, state, updateState } from "../state";

export let addCastMembersListener: AddListener<Record<string, CastMember>>;
let updateCastMembers: SetData<Record<string, CastMember>>;
const castMemberListeners: Record<
  string,
  {
    addListener: AddListener<CastMember>;
    addPropertyListener: AddPropertyListener<CastMember>;
    removeListener: RemoveListener<CastMember>;
    setData: SetData<CastMember>;
  }
> = {};

export function initializeCastMembersState(
  state: State & { castMembers: Record<string, CastMemberRaw> }
) {
  const castMembers: Record<string, CastMemberRaw> = state.castMembers;
  state.castMembers = {};
  const functions = createEventEmitter(state.castMembers);
  addCastMembersListener = functions.addListener;
  updateCastMembers = functions.setData;
  for (const [, castMember] of Object.entries(castMembers)) {
    _addCastMember(castMember);
  }
}

function getCastMember(id: string): CastMember | undefined {
  return state.castMembers[id];
}

function _addCastMember(
  castMemberParamsOrRaw: CastMemberParams | CastMemberRaw
): CastMember {
  const { id } = findUniqueId(castMemberParamsOrRaw);
  const castMember = new CastMember({ ...castMemberParamsOrRaw, id });
  castMemberListeners[castMember.id] = createEventEmitter(castMember);
  updateCastMembers({ [castMember.id]: castMember });
  updateState({ castMembers: state.castMembers });
  onStateChange();
  return castMember;
}

export function addCastMember(castMemberParams: CastMemberParams): CastMember {
  return _addCastMember(castMemberParams);
}

export function removeCastMember(id: string) {
  if (castMemberListeners[id]) {
    castMemberListeners[id].removeListener();
  }
  delete castMemberListeners[id];
  updateCastMembers(
    Object.fromEntries(
      Object.entries(state.castMembers).filter(([key]) => key !== id)
    ),
    true
  );
  updateState({ castMembers: state.castMembers });
  onStateChange();
}

export function setCastMemberState<P extends keyof CastMemberRaw>(
  id: string,
  prop: P,
  value: CastMemberRaw[P]
) {
  const castMember = getCastMember(id);
  if (!castMember) {
    throw new Error(`No cast member ${id}`);
  }
  if (!castMemberListeners[id]) {
    throw new Error(`No cast member ${id} listeners`);
  }
  castMemberListeners[id].setData({ [prop]: value });
  updateCastMembers({ [id]: castMember });
  updateState({ castMembers: state.castMembers });
  onStateChange();
}

export function addCastMemberStateListener(
  id: string,
  listener: (value: CastMember) => void
) {
  if (!castMemberListeners[id]) {
    throw new Error(`No cast member ${id} listeners`);
  }
  castMemberListeners[id].addListener(listener);
}

export function addCastMemberStatePropertyListener<P extends keyof CastMember>(
  id: string,
  property: P,
  listener: (value: CastMember[P]) => void
) {
  if (!castMemberListeners[id]) {
    throw new Error(`No cast member ${id} listeners`);
  }
  castMemberListeners[id].addPropertyListener(property, listener);
}

function findUniqueId(castMember: CastMemberParams | CastMemberRaw): {
  id: string;
  existingCastMembers: CastMember[];
} {
  const { castMembers } = state;
  if (castMember.id && !castMembers[castMember.id]) {
    return { id: castMember.id, existingCastMembers: [] };
  }

  const { id: originalId } = castMember.actor;
  let id = originalId;
  let i = 2;
  const existingCastMembers: CastMember[] = [];
  while (castMembers[id]) {
    existingCastMembers.push(castMembers[id]!);
    id = `${originalId}_${i++}`;
  }
  return { id, existingCastMembers };
}
