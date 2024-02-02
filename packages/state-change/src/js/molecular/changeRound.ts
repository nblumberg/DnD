import { CastMember } from "creature";
import { StateChange } from "../atomic/stateChange";
import {
  CastMembers,
  ChangeEvent,
  IChangeEvent,
  addToHistory,
  registerType,
} from "./event";

export class ChangeRound extends ChangeEvent {
  static type = "ChangeRound";

  round: number;

  constructor(params: Partial<IChangeEvent> & { round: number }) {
    super({ type: ChangeRound.type, ...params });

    this.round = params.round;
    addToHistory(this);
  }

  protected override makeChanges(): StateChange<
    CastMember,
    keyof CastMember
  >[] {
    return [];
  }

  change(): CastMembers {
    console.warn("Can't change delaying initiative");
    return {};
  }

  override display(): string {
    return `Round ${this.round} starts`;
  }
}

registerType(ChangeRound.type, ChangeRound);
