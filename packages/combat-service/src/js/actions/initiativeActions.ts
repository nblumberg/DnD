import { CastMember } from "creature";
import { RollHistory } from "roll";
import { StartTurn } from "state-change";
import { setState, state } from "../state";
import { rollInitiative as castMemberRollInitiative } from "./castMemberActions";

export function getTurnOrder(): CastMember[] {
  return Object.values(state.castMembers).sort(
    ({ initiativeOrder: a, dex: aDex }, { initiativeOrder: b, dex: bDex }) => {
      if (a === b) {
        return bDex - aDex;
      }
      return b - a;
    }
  );
}

export function startTurn(id: string): string | undefined {
  const castMembers = getTurnOrder();
  const oldTurnIndex = castMembers.findIndex((castMember) => castMember.myTurn);
  const newTurnCastMember = state.castMembers[id];
  const newTurnIndex = castMembers.findIndex(
    ({ id: castMemberId }) => castMemberId === id
  );
  if (!newTurnCastMember || newTurnIndex === -1) {
    console.warn(`Couldn't find cast member ${id} in turn order`);
    return;
  }

  new StartTurn({ castMemberId: id });

  setState("currentTurn", id);

  if (newTurnIndex === (oldTurnIndex + 1) % castMembers.length) {
    // Normal turn transition
    if (newTurnIndex < oldTurnIndex) {
      setState("round", state.round + 1);
    }
  }

  return newTurnCastMember.id;
}

/**
 * If initiative is not provided, roll initiative for all cast members.
 * If initiative is provided, only update the intiative order for the passed cast members.
 * If a cast member's initiative value <=0, it will be rolled.
 */
export function rollInitiative(
  initiative?: Record<string, RollHistory>
): CastMember[] {
  let castMembers = Object.values(state.castMembers);
  castMembers.forEach((castMember) => {
    if (!initiative) {
      castMemberRollInitiative(castMember.id);
    } else {
      const manuallyRolledInitiative = initiative[castMember.id];
      if (manuallyRolledInitiative !== undefined) {
        if (manuallyRolledInitiative.total <= 0) {
          castMemberRollInitiative(castMember.id);
        } else {
          castMemberRollInitiative(castMember.id, manuallyRolledInitiative);
        }
      }
    }
  });
  castMembers = getTurnOrder();
  // setState("currentTurn", castMembers[0]?.id);
  return castMembers;
}
