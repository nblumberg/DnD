import { CastMember } from "creature";
import { setState, state } from "../state";

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

export function startNextTurn(): string {
  setState("turnIndex", state.turnIndex + 1);
  return getTurnOrder()[state.turnIndex].id;
}
