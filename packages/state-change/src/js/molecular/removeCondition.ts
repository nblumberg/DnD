import { ActiveCondition, CastMember, castMemberDoSomething } from "creature";
import { StateChange } from "..";
import { removeConditionChange } from "../atomic/expireCondition";
import { ChangeEvent, IChangeEvent, registerType } from "./event";

export class RemoveCondition extends ChangeEvent {
  static type = "RemoveCondition";

  condition: ActiveCondition;

  constructor(params: Partial<IChangeEvent> & { condition: ActiveCondition }) {
    super({ type: RemoveCondition.type, ...params });
    this.condition = params.condition;

    if (!this.changes.length) {
      this.apply();
    }
  }

  protected override makeChanges(): StateChange<CastMember, "conditions">[] {
    let castMember = this.getCastMember();
    if (!castMember) {
      throw new Error("Can't remove condition for missing cast member");
    }

    castMemberDoSomething(
      castMember,
      `stops being ${this.condition.condition}`
    );

    return [removeConditionChange(castMember, this.condition)];
  }

  change(condition: ActiveCondition): CastMember | undefined {
    this.condition = condition;
    return this.executeChanges();
  }
}

registerType(RemoveCondition.type, RemoveCondition);
