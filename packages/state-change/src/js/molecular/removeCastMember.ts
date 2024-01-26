import { CastMember } from "creature";
import { removeCastMemberChange } from "../atomic/removeCastMember";
import { StateRemove } from "../atomic/stateChange";
import { ChangeEvent, IChangeEvent, registerType } from "./event";

export class RemoveCastMember extends ChangeEvent {
  static type = "AddCastMember";

  castMember: CastMember;

  constructor(params: Partial<IChangeEvent> & { castMember: CastMember }) {
    super({
      type: RemoveCastMember.type,
      ...params,
      castMemberId: params.castMember.id,
    });

    this.castMember = params.castMember;

    if (!this.changes.length) {
      this.apply();
    }
  }

  protected override makeChanges(): StateRemove<CastMember>[] {
    return [removeCastMemberChange(this.castMember)];
  }

  change(castMember: CastMember): CastMember | undefined {
    this.castMember = castMember;
    return this.executeChanges();
  }
}

registerType(RemoveCastMember.type, RemoveCastMember);
