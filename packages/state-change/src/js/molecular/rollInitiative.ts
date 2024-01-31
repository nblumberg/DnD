import { CastMember, idCastMember } from "creature";
import { Roll, RollHistory } from "roll";
import { delayInitiativeChange } from "../atomic/delayInitiative";
import { setInitiativeChange } from "../atomic/setInitiative";
import { StateChange } from "../atomic/stateChange";
import { createChangeable } from "../util/changeable";
import { ChangeEvent, IChangeEvent, registerType } from "./event";

export class RollInitiative extends ChangeEvent {
  static type = "RollInitiative";

  roll: RollHistory;

  constructor(params: Partial<IChangeEvent> & { roll: RollHistory }) {
    super({ type: RollInitiative.type, ...params });
    this.roll = params.roll;

    if (!this.changes.length) {
      this.apply();
    }
  }

  protected override makeChanges(): StateChange<
    CastMember,
    keyof CastMember
  >[] {
    let castMember = this.getCastMember();
    if (!castMember) {
      throw new Error("Can't roll initiative for missing cast member");
    }

    const changes: StateChange<CastMember, keyof CastMember>[] = [];
    if (castMember.delayInitiative) {
      changes.push(delayInitiativeChange(castMember, false));
    }

    if (this.roll.total > new Roll(`1d20+${castMember.initiative}`).max()) {
      console.warn(
        `Roll [${this.roll.total}] is higher than max initiative for ${castMember.id}`
      );
    }
    changes.push(setInitiativeChange(castMember, this.roll.total));
    return changes;
  }

  change(roll: RollHistory): CastMember | undefined {
    this.roll = roll;
    return this.executeChanges();
  }

  override display(html = false): string {
    const castMember = this.getCastMember();
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
