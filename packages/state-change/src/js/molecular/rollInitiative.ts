import { CastMember } from "creature";
import { Roll, RollHistory } from "roll";
import { StateChange } from "..";
import { delayInitiativeChange } from "../atomic/delayInitiative";
import { setInitiativeChange } from "../atomic/setInitiative";
import { ChangeEvent, IChangeEvent, registerType } from "./event";

export class RollInitiative extends ChangeEvent {
  static type = "RollInitiative";

  roll: RollHistory;

  constructor(params: Partial<IChangeEvent> & { roll: RollHistory }) {
    super({ type: RollInitiative.type, ...params });
    this.roll = params.roll;

    if (!this.changes.length) {
      this.apply();
    }
  }

  protected override makeChanges(): StateChange<
    CastMember,
    keyof CastMember
  >[] {
    let castMember = this.getCastMember();
    if (!castMember) {
      throw new Error("Can't roll initiative for missing cast member");
    }

    const changes: StateChange<CastMember, keyof CastMember>[] = [];
    if (castMember.delayInitiative) {
      changes.push(delayInitiativeChange(castMember, false));
    }

    if (this.roll.total > new Roll(`1d20+${castMember.initiative}`).max()) {
      console.warn(
        `Roll [${this.roll.total}] is higher than max initiative for ${castMember.id}`
      );
    }
    changes.push(setInitiativeChange(castMember, this.roll.total));
    return changes;
  }

  change(roll: RollHistory): CastMember | undefined {
    this.roll = roll;
    return this.executeChanges();
  }
}

registerType(RollInitiative.type, RollInitiative);
