import { CastMember, idCastMember } from "creature";
import { StateRemove } from "../../change";
import { removeCastMember } from "../../change/specific/removeCastMember";
import { ChangeEvent } from "../changeEvent";
import { registerType } from "../instantiateEvents";
import { ChangeEventParams, History, HistoryAndCastMembers } from "../types";

export class RemoveCastMember extends ChangeEvent {
  static type = "RemoveCastMember";

  constructor(params: ChangeEventParams) {
    super({
      ...params,
      type: RemoveCastMember.type,
    });

    this.applyAndUpdate(params);
  }

  protected override makeChanges(history: History): StateRemove<CastMember>[] {
    const castMember = this.getCastMember(history);
    if (!castMember) {
      throw new Error(`Cast member ${this.castMemberId} not found`);
    }
    return [removeCastMember(castMember)];
  }

  change(history: History, castMemberId: string): HistoryAndCastMembers {
    this.castMemberId = castMemberId;
    return this.executeChanges(history);
  }

  override display(history: History): string {
    const castMember = this.getCastMember(history);
    return `${idCastMember(castMember)} leaves the game`;
  }
}

registerType(RemoveCastMember.type, RemoveCastMember);
