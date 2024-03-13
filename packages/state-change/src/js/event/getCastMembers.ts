import { CastMember } from "creature";
import { ChangeHistory, getObjectFromChanges } from "../change";

export function getCastMember(
  castMemberId: string,
  history: ChangeHistory<CastMember>,
  allowNeverAdded = false,
  getLastStateBeforeRemove = false
): CastMember | undefined {
  return getObjectFromChanges<CastMember>(
    castMemberId,
    history,
    allowNeverAdded,
    getLastStateBeforeRemove
  );
}

export function getCastMembers(
  history: ChangeHistory<CastMember>
): CastMember[] {
  const castMembers = history.changes
    .filter(({ type }) => type === "+")
    .map(({ object }) => {
      return getObjectFromChanges<CastMember>(object, history);
    })
    .filter((castMember) => castMember !== undefined) as CastMember[];
  return castMembers;
}
