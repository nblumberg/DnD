import { CastMember, castMemberDoSomething, idCastMember } from "creature";
import { removeConditionChange } from "../atomic/expireCondition";
import { StateChange } from "../atomic/stateChange";
import { ChangeEvent, IChangeEvent, registerType } from "./event";

export class RemoveCondition extends ChangeEvent {
  static type = "RemoveCondition";

  condition: string;

  constructor(params: Partial<IChangeEvent> & { condition: string }) {
    super({ type: RemoveCondition.type, ...params });
    this.condition = params.condition;

    if (!this.changes.length) {
      this.apply();
    }
  }

  protected override makeChanges(): StateChange<CastMember, "conditions">[] {
    const castMember = this.getCastMember();
    if (!castMember) {
      throw new Error("Can't remove condition for missing cast member");
    }

    const condition = castMember.conditions[this.condition];
    if (!condition) {
      throw new Error(
        `Can't find condition ${this.condition} on cast member ${idCastMember(
          castMember
        )}`
      );
    }

    castMemberDoSomething(castMember, `stops being ${condition.condition}`);

    return [removeConditionChange(castMember, condition)];
  }

  change(condition: string): CastMember | undefined {
    this.condition = condition;
    return this.executeChanges();
  }

  override display(): string {
    const castMember = this.getCastMember();
    const changes = this.getChanges();
    if (!changes.length) {
      throw new Error("No changes to display");
    }
    const [change] = changes as StateChange<CastMember, "conditions">[];
    if (!change.oldValue) {
      throw new Error("Changes lacks old value");
    }
    const conditions = Object.values(change.oldValue);
    const [condition] = conditions;
    if (!condition) {
      throw new Error("No conditions to display");
    }
    return `${idCastMember(castMember)} stops being ${condition.condition}`;
  }
}

registerType(RemoveCondition.type, RemoveCondition);
