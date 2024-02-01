import { CastMember } from "creature";
import { StateChange } from "../atomic/stateChange";
import { ChangeEvent, IChangeEvent, registerType } from "./event";

export class ChangeRound extends ChangeEvent {
  static type = "ChangeRound";

  round: number;

  constructor(params: Partial<IChangeEvent> & { round: number }) {
    super({ type: ChangeRound.type, ...params });

    this.round = params.round;
  }

  protected override makeChanges(): StateChange<
    CastMember,
    keyof CastMember
  >[] {
    return [];
  }

  change(): CastMember | undefined {
    console.warn("Can't change delaying initiative");
    return this.getCastMember();
  }

  override display(): string {
    return `Round ${this.round} starts`;
  }
}

registerType(ChangeRound.type, ChangeRound);
