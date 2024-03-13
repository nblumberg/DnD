import {
  ActiveCondition,
  CastMember,
  castMemberDoSomething,
  idCastMember,
} from "creature";
import { StateChange } from "../../change";
import { addCondition } from "../../change/specific/addCondition";
import { ChangeEvent } from "../changeEvent";
import { registerType } from "../instantiateEvents";
import { ChangeEventParams, History, HistoryAndCastMembers } from "../types";

export class AddCondition extends ChangeEvent {
  static type = "AddCondition";

  condition: ActiveCondition;

  constructor(params: ChangeEventParams & { condition: ActiveCondition }) {
    super({ ...params, type: AddCondition.type });
    this.condition = params.condition;

    this.applyAndUpdate(params);
  }

  protected override makeChanges(
    history: History
  ): StateChange<CastMember, "conditions">[] {
    let castMember = this.getCastMember(history);
    if (!castMember) {
      throw new Error("Can't add condition for missing cast member");
    }

    castMemberDoSomething(
      castMember,
      `starts being ${this.condition.condition}`
    );

    return [addCondition(castMember, this.condition)!];
  }

  change(history: History, condition: ActiveCondition): HistoryAndCastMembers {
    this.condition = condition;
    return this.executeChanges(history);
  }

  override display(history: History): string {
    const castMember = this.getCastMember(history);
    return `${idCastMember(castMember)} starts being ${
      this.condition.condition
    }`;
  }
}

registerType(AddCondition.type, AddCondition);
