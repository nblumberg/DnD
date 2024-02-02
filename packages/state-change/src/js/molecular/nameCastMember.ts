import { CastMember } from "creature";
import { nameCastMemberChange } from "../atomic/nameCastMember";
import { StateChange } from "../atomic/stateChange";
import { CastMembers, ChangeEvent, IChangeEvent, registerType } from "./event";

export class NameCastMember extends ChangeEvent {
  static type = "NameCastMember";

  name: string;

  constructor(params: Partial<IChangeEvent> & { name: string }) {
    super({ type: NameCastMember.type, ...params });

    this.name = params.name;

    if (!this.changes.length) {
      this.apply();
    }
  }

  protected override makeChanges(): StateChange<
    CastMember,
    keyof CastMember
  >[] {
    return [nameCastMemberChange(this.getCastMember()!, this.name)];
  }

  change(name: string): CastMembers {
    this.name = name;
    return this.executeChanges();
  }

  override display(): string {
    const castMember = this.getCastMember();
    return `${castMember.name} changes their name to ${this.name}`;
  }
}

registerType(NameCastMember.type, NameCastMember);
