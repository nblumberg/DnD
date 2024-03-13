import { CastMember, castMemberDoSomething, idCastMember } from "creature";
import { StateChange } from "../../change";
import { removeCondition } from "../../change/specific/expireCondition";
import { ChangeEvent } from "../changeEvent";
import { registerType } from "../instantiateEvents";
import { ChangeEventParams, History, HistoryAndCastMembers } from "../types";

export class RemoveCondition extends ChangeEvent {
  static type = "RemoveCondition";

  condition: string;

  constructor(params: ChangeEventParams & { condition: string }) {
    super({ ...params, type: RemoveCondition.type });
    this.condition = params.condition;

    this.applyAndUpdate(params);
  }

  protected override makeChanges(
    history: History
  ): StateChange<CastMember, "conditions">[] {
    const castMember = this.getCastMember(history);
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

    return [removeCondition(castMember, condition)];
  }

  change(history: History, condition: string): HistoryAndCastMembers {
    this.condition = condition;
    return this.executeChanges(history);
  }

  override display(history: History): string {
    const castMember = this.getCastMember(history);
    const changes = this.getChanges(history);
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
