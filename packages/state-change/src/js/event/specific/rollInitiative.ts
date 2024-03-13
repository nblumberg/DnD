import { CastMember, idCastMember } from "creature";
import { Roll, RollHistory } from "roll";
import { StateChange } from "../../change";
import { setInitiative } from "../../change/specific/setInitiative";
import { createChangeable } from "../../util/changeable";
import { ChangeEvent } from "../changeEvent";
import { registerType } from "../instantiateEvents";
import { ChangeEventParams, History, HistoryAndCastMembers } from "../types";

export class RollInitiative extends ChangeEvent {
  static type = "RollInitiative";

  roll: RollHistory;

  constructor(params: ChangeEventParams & { roll: RollHistory }) {
    super({ ...params, type: RollInitiative.type });
    this.roll = params.roll;

    this.applyAndUpdate(params);
  }

  protected override makeChanges(
    history: History
  ): StateChange<CastMember, keyof CastMember>[] {
    let castMember = this.getCastMember(history);
    if (!castMember) {
      throw new Error("Can't roll initiative for missing cast member");
    }

    if (this.roll.total > new Roll(`1d20+${castMember.initiative}`).max()) {
      console.warn(
        `Roll [${this.roll.total}] is higher than max initiative for ${castMember.id}`
      );
    }
    return setInitiative(castMember, this.roll.total);
  }

  change(history: History, roll: RollHistory): HistoryAndCastMembers {
    this.roll = roll;
    return this.executeChanges(history);
  }

  override display(history: History, html = false): string {
    const castMember = this.getCastMember(history);
    const roll = new Roll({
      dieCount: 1,
      dieSides: 20,
      extra: castMember.initiative,
    });
    roll.add(this.roll.total, this.roll.dice);
    const prefix = `${idCastMember(castMember)} rolls `;
    const suffix = ` for initiative`;
    if (html) {
      return `${prefix}${createChangeable({
        attributes: {
          "data-type": "Roll",
          "data-roll": roll.toString(),
          title: roll.breakdown(),
        },
        innerText: `${this.roll.total}`,
      })}${suffix}`;
    } else {
      return `${idCastMember(castMember)} rolls ${
        this.roll.total
      } (${roll.breakdown()}) for initiative`;
    }
  }
}

registerType(RollInitiative.type, RollInitiative);
