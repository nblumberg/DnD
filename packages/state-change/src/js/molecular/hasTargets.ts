import { CastMember } from "creature";
import { RollHistory } from "roll";
import { ChangeEvent, IChangeEvent, getCastMembers } from "./event";

export abstract class HasTargets extends ChangeEvent {
  targets: string[];
  targetSaves: RollHistory[];

  constructor(
    params: Partial<IChangeEvent> & {
      targets: string[];
      targetSaves?: RollHistory[];
    }
  ) {
    super({ ...params });

    this.targets = params.targets;
    this.targetSaves = params.targetSaves ?? [];
  }

  protected getTargets(): CastMember[] {
    const castMembers = getCastMembers(this.getHistoryBefore());
    const targets = this.targets.map((targetId) => {
      const target = castMembers.find(({ id }) => id === targetId);
      if (!target) {
        throw new Error(`Target ${targetId} not found`);
      }
      return target;
    });
    return targets;
  }
}
