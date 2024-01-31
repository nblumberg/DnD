import { CastMember } from "creature";
import { RollHistory } from "roll";

export function hitTargets(
  toHit: RollHistory,
  targets: CastMember[],
  log?: (message: string) => void
): boolean[] {
  return targets.map((castMember) => {
    if (toHit.total < castMember.ac) {
      if (log) {
        log(`misses ${castMember.name}`);
      }
      return false;
    }

    return true;
  });
}
