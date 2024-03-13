import { CastMember } from "creature";
import { addCastMember, StateAdd } from "../../change";
import { addEventToHistory } from "../addEventToHistory";
import { ChangeEvent } from "../changeEvent";
import { cloneHistory } from "../cloneHistory";
import { registerType } from "../instantiateEvents";
import { ChangeEventParams, History, HistoryAndCastMembers } from "../types";

export class AddCastMember extends ChangeEvent {
  static type = "AddCastMember";

  constructor(params: ChangeEventParams & { castMember: CastMember }) {
    super({
      ...params,
      type: AddCastMember.type,
    });

    const { castMember } = params;
    let newHistory = cloneHistory(params.history);

    // prevent serializable of castMember, only serialize it in the atomic change

    if (!this.changes.length) {
      if (!castMember) {
        throw new Error("Cast member is undefined");
      }
      const myChanges = [addCastMember(castMember)];
      const { events, changes } = this.pushChanges(newHistory, myChanges);
      newHistory = { events, changes };
      newHistory = addEventToHistory(newHistory, this);
      if (params.historyChange) {
        params.historyChange(newHistory);
      }
    }
  }

  override apply(_history: History): HistoryAndCastMembers {
    throw new Error("Cannot apply AddCastMember");
  }

  override display(history: History): string {
    const [
      {
        newValue: { name },
      },
    ] = this.getChanges(history);
    return `${name} joins the game`;
  }

  protected override makeChanges(_history: History): StateAdd<CastMember>[] {
    throw new Error("AddCastMember only makes changes in constructor");
  }

  change(_history: History): HistoryAndCastMembers {
    throw new Error("Can't change adding a cast member");
  }
}

registerType(AddCastMember.type, AddCastMember);
