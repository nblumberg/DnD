import {
  CaseReducer,
  Dispatch,
  PayloadAction,
  UnknownAction,
  createSlice,
} from "@reduxjs/toolkit";
import { Actor, CastMember, Creature } from "creature";
import { Character } from "../../data/Character";
import { getCharacter, getMonster } from "../../services/compendium";
import {
  RelativeRootState as CreaturesRelativeRootState,
  addCreature,
  selectCreatures,
} from "../creature/creatures";

type CastMembers = Record<string, CastMember>;

const initialState: CastMembers = {};

interface RelativeRootState extends CreaturesRelativeRootState {
  castMembers: CastMembers;
}

type CastingAction = CaseReducer<CastMembers, PayloadAction<CastMember>>;
type FullCastAction = CaseReducer<CastMembers, UnknownAction>;

export function selectCastMembers(state: RelativeRootState): CastMembers {
  return state.castMembers;
}

const add: CastingAction = (
  state,
  { payload: castMember }: PayloadAction<CastMember>
) => {
  const { id } = castMember;
  if (state[id]) {
    throw new Error(`${id} is already in the game`);
  }
  state[id] = castMember;
};

const remove: CastingAction = (
  state,
  { payload: { id } }: PayloadAction<CastMember>
) => {
  if (!state[id]) {
    throw new Error(`${id} is not in the game`);
  }
  delete state[id];
};

const initiative: FullCastAction = (state) => {
  const castMembers = Object.values(state);
  castMembers.forEach((castMember) => {
    state[castMember.id] = new CastMember(castMember as CastMember);
    state[castMember.id].initiative.roll();
  });
};

export const castMembersSlice = createSlice({
  name: "castMembers",
  initialState,
  reducers: {
    addCastMember: add,
    removeCastMember: remove,
    rollInitiative: initiative,
  },
});

export const { addCastMember, removeCastMember, rollInitiative } =
  castMembersSlice.actions;
export const castMembers = castMembersSlice.reducer;

// export function getCastMember(id: string): CastMember | undefined {
//   return _castMembers.get(id);
// }

export function checkCast(
  actor: Actor,
  castMembers: CastMembers
): CastMember[] {
  const { matches: existingCastMembers } = findUniqueId(actor.id, castMembers);
  return existingCastMembers;
}

// the outside "thunk creator" function
export function castActors(actors: Actor[]) {
  // the inside "thunk function"
  return async (dispatch: Dispatch, getState: () => {}) => {
    const state = getState() as unknown as RelativeRootState;
    const castMembers = selectCastMembers(state);
    for (const actor of actors) {
      const { id: originalId, unique } = actor;
      const { id, matches: existingCastMembers } = findUniqueId(
        originalId,
        castMembers
      );
      const [existingCastMember] = existingCastMembers;
      if (unique && existingCastMember) {
        // Can't add unique characters more than once
        continue;
      }
      let creature: Creature = existingCastMember;
      if (!existingCastMember) {
        const creatures = selectCreatures(state);
        if (creatures[actor.name]) {
          creature = creatures[actor.name].raw();
        } else if (actor instanceof Character) {
          creature = new Creature(await getCharacter(actor.name));
        } else {
          creature = new Creature(await getMonster(actor.name));
        }
      }
      dispatch(addCreature(creature));
      const castMember = new CastMember({
        ...creature.raw(),
        actor,
        id,
        unique,
      });
      dispatch(addCastMember(castMember));
    }
  };
}

// export function fireCastMember(id: string): void {
//   _castMembers.delete(id);
// }

export function findUniqueId<T extends { id: string }>(
  originalId: string,
  preExisting: Record<string, T>
): {
  id: string;
  matches: T[];
} {
  let id = originalId;
  let i = 2;
  const matches: T[] = [];
  while (preExisting[id]) {
    matches.push(preExisting[id]!);
    id = `${originalId}_${i++}`;
  }
  return { id, matches };
}
