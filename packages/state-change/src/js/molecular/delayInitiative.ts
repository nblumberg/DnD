import { CastMember, idCastMember } from "creature";
import { delayInitiativeChange } from "../atomic/delayInitiative";
import { StateChange } from "../atomic/stateChange";
import { CastMembers, ChangeEvent, IChangeEvent, registerType } from "./event";

export class DelayInitiative extends ChangeEvent {
  static type = "DelayInitiative";

  constructor(params: Partial<IChangeEvent>) {
    super({ type: DelayInitiative.type, ...params });

    if (!this.changes.length) {
      this.apply();
    }
  }

  protected override makeChanges(): StateChange<
    CastMember,
    keyof CastMember
  >[] {
    return [delayInitiativeChange(this.getCastMember()!, true)];
  }

  change(): CastMembers {
    console.warn("Can't change delaying initiative");
    const castMember = this.getCastMember();
    return { [castMember.id]: castMember };
  }

  override display(): string {
    const castMember = this.getCastMember();
    return `${idCastMember(castMember)} delays their action`;
  }
}

registerType(DelayInitiative.type, DelayInitiative);

export class ReadyAction extends DelayInitiative {
  static override type = "ReadyAction";

  constructor(params: Partial<IChangeEvent>) {
    super({ type: ReadyAction.type, ...params });

    if (!this.changes.length) {
      this.apply();
    }
  }

  override change(): CastMembers {
    console.warn("Can't change readying an action");
    const castMember = this.getCastMember();
    return { [castMember.id]: castMember };
  }

  override display(): string {
    const castMember = this.getCastMember();
    return `${idCastMember(castMember)} readies an action`;
  }
}

registerType(ReadyAction.type, ReadyAction);
