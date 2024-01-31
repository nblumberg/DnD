import { getCharacter, getMonster } from "compendium-service/client";
import {
  Auditioner,
  CastMember,
  CastMemberParams,
  CreatureParams,
  castMemberParamsToCastMember,
  idCastMember,
} from "creature";
import {
  AddListener,
  AddPropertyListener,
  RemoveListener,
  SetData,
  createEventEmitter,
} from "event-emitter";
import {
  AddCastMember,
  HistoryEntry,
  IChangeEvent,
  RemoveCastMember,
  getCastMembers,
  getHistory,
} from "state-change";
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
  state: State & {
    history: IChangeEvent[];
    changes: HistoryEntry<CastMember>[];
  }
) {
  const castMembers = getCastMembers();
  state.castMembers = castMembers.reduce(
    (acc, castMember) => ({ ...acc, [castMember.id]: castMember }),
    {}
  );
  const functions = createEventEmitter(state.castMembers);
  addCastMembersListener = functions.addListener;
  updateCastMembers = functions.setData;
  Object.values(state.castMembers).forEach((castMember) => {
    castMemberListeners[castMember.id] = createEventEmitter(castMember);
  });
  updateState({ castMembers: state.castMembers });
}

function getCastMember(id: string): CastMember | undefined {
  return state.castMembers[id];
}

export async function castActor(auditioner: Auditioner): Promise<CastMember> {
  let creatureParams: CreatureParams;
  if (auditioner.character) {
    creatureParams = await getCharacter(auditioner.name);
  } else {
    creatureParams = await getMonster(auditioner.name);
  }
  const castMemberParams: CastMemberParams = {
    ...creatureParams,
    ...auditioner,
  };
  const { id } = findUniqueId(castMemberParams);
  const castMember = castMemberParamsToCastMember({
    ...castMemberParams,
    id,
  });
  console.log(`Adding ${idCastMember(castMember)}`);

  const { history, changes } = state;

  new AddCastMember({ castMemberId: id, castMember });

  updateState({ history, changes });

  castMemberListeners[castMember.id] = createEventEmitter(castMember);
  updateCastMembers({ [castMember.id]: castMember });
  updateState({ castMembers: state.castMembers });
  onStateChange();
  return castMember;
}

export function fireCastMember(castMemberId: string) {
  console.log(`Firing ${idCastMember(state.castMembers[castMemberId])}`);
  new RemoveCastMember({ castMemberId });

  updateState({ history: getHistory() });

  if (castMemberListeners[castMemberId]) {
    castMemberListeners[castMemberId].removeListener();
  }
  delete castMemberListeners[castMemberId];
  updateCastMembers(
    Object.fromEntries(
      Object.entries(state.castMembers).filter(([key]) => key !== castMemberId)
    ),
    true
  );
  updateState({ castMembers: state.castMembers });
  onStateChange();
}

export function replaceCastMember(castMember: CastMember) {
  if (castMemberListeners[castMember.id]) {
    castMemberListeners[castMember.id].removeListener();
  }
  castMemberListeners[castMember.id] = createEventEmitter(castMember);
  updateCastMembers({ [castMember.id]: castMember });
  updateState({ castMembers: state.castMembers });
  onStateChange();
}

export function setCastMemberState<P extends keyof CastMember>(
  id: string,
  prop: P,
  value: CastMember[P]
): CastMember {
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
  return castMember;
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

function findUniqueId(castMember: CastMemberParams): {
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
