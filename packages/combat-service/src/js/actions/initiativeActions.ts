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
  const { castMembers, turnOrder, currentTurn } = state;
  const oldTurnCastMember = currentTurn ? castMembers[currentTurn] : undefined;
  const oldTurnIndex = currentTurn ? turnOrder.indexOf(currentTurn) : -1;
  const newTurnCastMember = castMembers[id];
  const newTurnIndex = turnOrder.indexOf(id);
  if (!newTurnCastMember || newTurnIndex === -1) {
    console.warn(`Couldn't find cast member ${id} in turn order`);
    return;
  }
  setState("currentTurn", id);

  if (newTurnIndex === (oldTurnIndex + 1) % turnOrder.length) {
    // Normal turn transition
    Object.values(castMembers).forEach((castMember) => {
      castMember.conditions.forEach((condition) => {
        if (oldTurnCastMember) {
          condition.endTurn(oldTurnCastMember);
        }
        condition.startTurn(newTurnCastMember);
      });
    });
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
  setState("currentTurn", castMembers[0]?.id);
  return castMembers;
}
