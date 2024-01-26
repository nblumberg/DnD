import { CastMember, castMemberDoSomething } from "creature";
import {
  AddToState,
  StateAdd,
  createStateAdd,
  getHistoryHandle,
} from "./stateChange";

const { pushStateAdd } = getHistoryHandle<CastMember>("CastMember");

export const addCastMember: AddToState<CastMember> = (castMember) => {
  castMemberDoSomething(castMember, "joins the game");
  pushStateAdd(castMember, "addCastMember");
  return { ...castMember };
};

export function addCastMemberChange(
  castMember: CastMember
): StateAdd<CastMember> {
  return createStateAdd(castMember, "addCastMember");
}
