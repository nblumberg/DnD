import { CastMember, idCastMember } from "creature";
import { StateChange } from "../../change";
import { delayInitiative } from "../../change/specific/delayInitiative";
import { ChangeEvent, cantChange } from "../changeEvent";
import { registerType } from "../instantiateEvents";
import { ChangeEventParams, History, HistoryAndCastMembers } from "../types";

export class DelayInitiative extends ChangeEvent {
  static type = "DelayInitiative";

  constructor(params: ChangeEventParams) {
    super({ ...params, type: DelayInitiative.type });

    this.applyAndUpdate(params);
  }

  protected override makeChanges(
    history: History
  ): StateChange<CastMember, keyof CastMember>[] {
    return [delayInitiative(this.getCastMember(history)!, true)];
  }

  change(history: History): HistoryAndCastMembers {
    return cantChange("Can't change delaying initiative", history);
  }

  override display(history: History): string {
    const castMember = this.getCastMember(history);
    return `${idCastMember(castMember)} delays their action`;
  }
}

registerType(DelayInitiative.type, DelayInitiative);

export class ReadyAction extends DelayInitiative {
  static override type = "ReadyAction";

  constructor(params: ChangeEventParams) {
    super({ ...params, type: ReadyAction.type });

    this.applyAndUpdate(params);
  }

  override change(history: History): HistoryAndCastMembers {
    return cantChange("Can't change readying an action", history);
  }

  override display(history: History): string {
    const castMember = this.getCastMember(history);
    return `${idCastMember(castMember)} readies an action`;
  }
}

registerType(ReadyAction.type, ReadyAction);
