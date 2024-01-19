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
  const oldTurnIndex = state.turnIndex;
  const castMembers = getTurnOrder();
  const newTurnIndex = castMembers.findIndex(
    ({ id: castMemberId }) => castMemberId === id
  );
  if (newTurnIndex === -1) {
    console.warn(`Couldn't find cast member ${id} in turn order`);
    return;
  }
  setState("turnIndex", newTurnIndex);

  castMembers.forEach((castMember) => {
    castMember.conditions.forEach((condition) => {
      condition.endTurn(castMembers[oldTurnIndex]);
      condition.startTurn(castMembers[newTurnIndex]);
    });
  });

  return castMembers[state.turnIndex].id;
}

/**
 * If initiative is not provided, roll initiative for all cast members.
 * If initiative is provided, only update the intiative order for the passed cast members.
 * If a cast member's initiative value <=0, it will be rolled.
 */
export function rollInitiative(
  initiative?: Record<string, number>
): CastMember[] {
  let castMembers = Object.values(state.castMembers);
  castMembers.forEach((castMember) => {
    if (!initiative) {
      castMemberRollInitiative(castMember.id);
    } else {
      const manuallyRolledInitiative = initiative[castMember.id];
      if (manuallyRolledInitiative !== undefined) {
        if (manuallyRolledInitiative <= 0) {
          castMemberRollInitiative(castMember.id);
        } else {
          changeInitiativeOrder(castMember.id, manuallyRolledInitiative);
        }
      }
    }
  });
  castMembers = getTurnOrder();
  setState("turnIndex", 0);
  return castMembers;
}
