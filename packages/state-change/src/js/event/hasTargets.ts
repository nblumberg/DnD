import { CastMember } from "creature";
import { RollHistory } from "roll";
import { ChangeEvent } from "./changeEvent";
import { getCastMembers } from "./getCastMembers";
import { ChangeEventParams, History } from "./types";

export abstract class HasTargets extends ChangeEvent {
  targets: string[];
  targetSaves: RollHistory[];

  constructor(
    params: ChangeEventParams & {
      type: string;
      targets: string[];
      targetSaves?: RollHistory[];
    }
  ) {
    super({ ...params });

    this.targets = params.targets;
    this.targetSaves = params.targetSaves ?? [];
  }

  protected getTargets(history: History): CastMember[] {
    const castMembers = getCastMembers({
      changes: this.getChangesBefore(history),
    });
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
