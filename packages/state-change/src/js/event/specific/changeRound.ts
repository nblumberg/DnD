import { CastMember } from "creature";
import { StateChange } from "../../change";
import { addEventToHistory } from "../addEventToHistory";
import { ChangeEvent, cantChange } from "../changeEvent";
import { registerType } from "../instantiateEvents";
import { ChangeEventParams, History, HistoryAndCastMembers } from "../types";

export class ChangeRound extends ChangeEvent {
  static type = "ChangeRound";

  round: number;

  constructor(params: ChangeEventParams & { round: number }) {
    super({ ...params, type: ChangeRound.type });

    this.round = params.round;
    const newHistory = addEventToHistory(params.history, this);
    if (params.historyChange) {
      params.historyChange(newHistory);
    }
  }

  protected override makeChanges(
    _history: History
  ): StateChange<CastMember, keyof CastMember>[] {
    return [];
  }

  change(history: History): HistoryAndCastMembers {
    return cantChange("Can't change the round number", history);
  }

  override display(_history: History): string {
    return `Round ${this.round} starts`;
  }
}

registerType(ChangeRound.type, ChangeRound);
