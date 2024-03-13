import { CastMember } from "creature";
import { createContext, useMemo } from "react";
import { setLog } from "roll";
import { History, getCastMembers } from "state-change";

setLog(() => {});

let cachedCastMembers: CastMember[] = [];

export function useCastMembers(history: History): CastMember[] {
  console.log("useCastMembers", history);
  const castMembers = useMemo(() => {
    console.log("useCastMembers useMemo", history);
    cachedCastMembers = getCastMembers(history).sort(getTurnOrder);
    console.log("castMembers", cachedCastMembers);
    return cachedCastMembers;
  }, [history]);
  return castMembers;
  // return cachedCastMembers;
}

export const CastMemberContext = createContext<CastMember[]>([]);

function getTurnOrder(
  { initiativeOrder: a, dex: aDex }: CastMember,
  { initiativeOrder: b, dex: bDex }: CastMember
): number {
  if (a === b) {
    return bDex - aDex;
  }
  return b - a;
}
