import { CastMember } from "creature";
import { addCastMemberChange } from "../atomic/addCastMember";
import { StateAdd } from "../atomic/stateChange";
import {
  CastMembers,
  ChangeEvent,
  IChangeEvent,
  addToHistory,
  registerType,
} from "./event";

export class AddCastMember extends ChangeEvent {
  static type = "AddCastMember";

  constructor(params: Partial<IChangeEvent> & { castMember: CastMember }) {
    super({
      type: AddCastMember.type,
      ...params,
    });

    // prevent serializable of castMember, only serialize it in the atomic change

    if (!this.changes.length) {
      if (!params.castMember) {
        throw new Error("Cast member is undefined");
      }
      const changes = [addCastMemberChange(params.castMember)];
      this.pushChanges(changes);
      addToHistory(this);
    }
  }

  override apply(): CastMembers {
    throw new Error("Cannot apply AddCastMember");
  }

  override display(): string {
    const [
      {
        newValue: { name },
      },
    ] = this.getChanges();
    return `${name} joins the game`;
  }

  protected override makeChanges(): StateAdd<CastMember>[] {
    throw new Error("AddCastMember only makes changes in constructor");
  }

  change(): CastMembers {
    throw new Error("Can't change adding a cast member");
  }
}

registerType(AddCastMember.type, AddCastMember);
