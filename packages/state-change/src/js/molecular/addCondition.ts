import { ActiveCondition, CastMember, castMemberDoSomething } from "creature";
import { StateChange } from "..";
import { addConditionChange } from "../atomic/addCondition";
import { ChangeEvent, IChangeEvent, registerType } from "./event";

export class AddCondition extends ChangeEvent {
  static type = "AddCondition";

  condition: ActiveCondition;

  constructor(params: Partial<IChangeEvent> & { condition: ActiveCondition }) {
    super({ type: AddCondition.type, ...params });
    this.condition = params.condition;

    if (!this.changes.length) {
      this.apply();
    }
  }

  protected override makeChanges(): StateChange<CastMember, "conditions">[] {
    let castMember = this.getCastMember();
    if (!castMember) {
      throw new Error("Can't add condition for missing cast member");
    }

    castMemberDoSomething(
      castMember,
      `starts being ${this.condition.condition}`
    );

    return [addConditionChange(castMember, this.condition)];
  }

  change(condition: ActiveCondition): CastMember | undefined {
    this.condition = condition;
    return this.executeChanges();
  }
}

registerType(AddCondition.type, AddCondition);
