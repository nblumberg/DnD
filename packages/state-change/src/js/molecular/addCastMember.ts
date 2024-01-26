import { CastMember } from "creature";
import { addCastMemberChange } from "../atomic/addCastMember";
import { StateAdd } from "../atomic/stateChange";
import { ChangeEvent, IChangeEvent, registerType } from "./event";

export class AddCastMember extends ChangeEvent {
  static type = "AddCastMember";

  castMember: CastMember;

  constructor(params: Partial<IChangeEvent> & { castMember: CastMember }) {
    super({
      type: AddCastMember.type,
      ...params,
      castMemberId: params.castMember.id,
    });

    this.castMember = params.castMember;

    if (!this.changes.length) {
      this.apply();
    }
  }

  protected override makeChanges(): StateAdd<CastMember>[] {
    return [addCastMemberChange(this.castMember)];
  }

  change(castMember: CastMember): CastMember | undefined {
    this.castMember = castMember;
    return this.executeChanges();
  }
}

registerType(AddCastMember.type, AddCastMember);
