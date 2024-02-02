import { CastMember } from "creature";
import { createContext } from "react";
import { setLog } from "roll";
import { HistoryEntry, getCastMembers } from "state-change";

setLog(() => {});

let cachedCastMembers: CastMember[] = [];

export function useCastMembers(
  changes: HistoryEntry<CastMember>[]
): CastMember[] {
  console.log("useCastMembers", changes);
  // const castMembers = useMemo(() => {
  // console.log("useCastMembers useMemo", changes);
  cachedCastMembers = getCastMembers(changes).sort(getTurnOrder);
  console.log("castMembers", cachedCastMembers);
  //   return cachedCastMembers;
  // }, [changes]);
  // return castMembers;
  return cachedCastMembers;
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
