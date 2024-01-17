import { CastMember } from "creature";
import { setState, state } from "../state";
import {
  rollInitiative as castMemberRollInitiative,
  changeInitiativeOrder,
} from "./castMemberActions";

export function getTurnOrder(): CastMember[] {
  return Object.values(state.castMembers).sort(
    (
      { initiativeOrder: a, dex: { score: aDex } },
      { initiativeOrder: b, dex: { score: bDex } }
    ) => {
      if (a === b) {
        return bDex - aDex;
      }
      return b - a;
    }
  );
}

export function startTurn(id: string): string | undefined {
  const castMembers = getTurnOrder();
  const newTurnIndex = castMembers.findIndex(
    ({ id: castMemberId }) => castMemberId === id
  );
  if (newTurnIndex === -1) {
    console.warn(`Couldn't find cast member ${id} in turn order`);
    return;
  }
  setState("turnIndex", newTurnIndex);
  return castMembers[state.turnIndex].id;
}

export function rollInitiative(
  initiative: Record<string, number>
): CastMember[] {
  let castMembers = Object.values(state.castMembers);
  castMembers.forEach((castMember) => {
    const manuallyRolledInitiative = initiative[castMember.id];
    if (manuallyRolledInitiative) {
      changeInitiativeOrder(castMember.id, manuallyRolledInitiative);
    } else {
      castMemberRollInitiative(castMember.id);
    }
  });
  castMembers = getTurnOrder();
  setState("turnIndex", 0);
  return castMembers;
}
