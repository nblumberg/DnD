import { CastMember } from "creature";
import { StateChange } from "../../change";
import { nameCastMember } from "../../change/specific/nameCastMember";
import { ChangeEvent } from "../changeEvent";
import { registerType } from "../instantiateEvents";
import { ChangeEventParams, History, HistoryAndCastMembers } from "../types";

export class NameCastMember extends ChangeEvent {
  static type = "NameCastMember";

  name: string;

  constructor(params: ChangeEventParams & { name: string }) {
    super({ ...params, type: NameCastMember.type });

    this.name = params.name;

    this.applyAndUpdate(params);
  }

  protected override makeChanges(
    history: History
  ): StateChange<CastMember, keyof CastMember>[] {
    return [nameCastMember(this.getCastMember(history)!, this.name)];
  }

  change(history: History, name: string): HistoryAndCastMembers {
    this.name = name;
    return this.executeChanges(history);
  }

  override display(history: History): string {
    const castMember = this.getCastMember(history);
    return `${castMember.name} changes their name to ${this.name}`;
  }
}

registerType(NameCastMember.type, NameCastMember);
