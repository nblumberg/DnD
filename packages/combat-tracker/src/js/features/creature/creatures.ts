import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Creature } from "creature";

type Creatures = Record<string, Creature>;

const initialState: Creatures = {};

export interface RelativeRootState {
  creatures: Creatures;
}

type CreatureAction = CaseReducer<Creatures, PayloadAction<Creature>>;

export function selectCreatures(state: RelativeRootState): Creatures {
  return state.creatures;
}

const add: CreatureAction = (state, { payload: creature }) => {
  const { name } = creature;
  if (!state[name]) {
    state[name] = creature;
  }
};

export const creaturesSlice = createSlice({
  name: "creatures",
  initialState,
  reducers: {
    addCreature: add,
  },
});

export const { addCreature } = creaturesSlice.actions;
export const creatures = creaturesSlice.reducer;
