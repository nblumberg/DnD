import { CastMember, idCastMember } from "creature";
import { removeCastMemberChange } from "../atomic/removeCastMember";
import { StateRemove } from "../atomic/stateChange";
import { CastMembers, ChangeEvent, IChangeEvent, registerType } from "./event";

export class RemoveCastMember extends ChangeEvent {
  static type = "RemoveCastMember";

  constructor(params: Partial<IChangeEvent>) {
    super({
      type: RemoveCastMember.type,
      ...params,
    });

    if (!this.changes.length) {
      this.apply();
    }
  }

  protected override makeChanges(): StateRemove<CastMember>[] {
    const castMember = this.getCastMember();
    if (!castMember) {
      throw new Error(`Cast member ${this.castMemberId} not found`);
    }
    return [removeCastMemberChange(castMember)];
  }

  change(castMemberId: string): CastMembers {
    this.castMemberId = castMemberId;
    return this.executeChanges();
  }

  override display(): string {
    const castMember = this.getCastMember();
    return `${idCastMember(castMember)} leaves the game`;
  }
}

registerType(RemoveCastMember.type, RemoveCastMember);
