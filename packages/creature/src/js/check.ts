import { Roll } from "roll";
import { ClassMembers } from "serializable";
import { CastMember } from ".";
import { Ability } from "./ability";

export class Check extends Roll {
  modifier: number;
  private owner: CastMember;

  constructor(
    params: Partial<CheckRaw> & { extra: number },
    owner: CastMember
  ) {
    super({
      ...params,
      dieCount: 1,
      dieSides: 20,
    });
    this.modifier = params.extra;
    this.owner = owner;
  }

  override roll(): number {
    const result = super.roll();
    console.log(
      `${this.owner.nickname ?? this.owner.name} rolled ${result} for ${
        Object.entries(this.owner).find(([, value]) => value === this)?.[0] ??
        "unknown"
      } check ${this.constructor.name} (${this.breakdown()})`
    );
    return result;
  }
}

export type CheckRaw = Omit<ClassMembers<Check>, "dieCount" | "dieSides">;

export class AbilityCheck extends Check implements Ability {
  score: number;

  declare raw: () => AbilityCheckRaw & CheckRaw;

  constructor(score: number, owner: CastMember) {
    const { modifier } = new Ability(score);
    super({ extra: modifier }, owner);
    this.score = score;
  }
}

export type AbilityCheckRaw = ClassMembers<AbilityCheck>;
