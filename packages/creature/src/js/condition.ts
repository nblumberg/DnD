import { Serializable } from "serializable";
import { CastMember } from ".";

export enum Condition {
  BLINDED = "blinded",
  CHARMED = "charmed",
  DEAD = "dead",
  DEAFENED = "deafened",
  EXHAUSTION_1 = "exhaustion level 1",
  EXHAUSTION_2 = "exhaustion level 2",
  EXHAUSTION_3 = "exhaustion level 3",
  EXHAUSTION_4 = "exhaustion level 4",
  EXHAUSTION_5 = "exhaustion level 5",
  FRIGHTENED = "frightened",
  GRAPPLED = "grappled",
  INCAPACITATED = "incapacitated",
  INVISIBLE = "invisible",
  PARALYZED = "paralyzed",
  PETRIFIED = "petrified",
  POISONED = "poisoned",
  PRONE = "prone",
  RESTRAINED = "restrained",
  STUNNED = "stunned",
  UNCONSCIOUS = "unconscious",
}

export interface ActiveConditionParam {
  owner: CastMember;
  condition: Condition;
  onSave?: boolean;
  duration?: number;
  onTurnStart?: string; // CastMember.id
  onTurnEnd?: string; // CastMember.id
  source?: string; // CastMember.id
}

export type ActiveConditionRaw = Omit<ActiveConditionParam, "owner">;

export class ActiveCondition
  extends Serializable<ActiveConditionRaw>
  implements ActiveConditionParam, ActiveConditionRaw
{
  owner: CastMember;
  condition: Condition;
  onSave?: boolean;
  duration?: number;
  onTurnStart?: string; // CastMember.id
  onTurnEnd?: string; // CastMember.id
  source?: string; // CastMember.id

  constructor({
    owner,
    condition,
    onSave,
    onTurnStart,
    onTurnEnd,
    duration = onTurnStart || onTurnEnd ? 1 : Infinity,
    source,
  }: ActiveConditionParam) {
    super();
    this.owner = owner;
    this.condition = condition;
    this.onSave = onSave;
    this.duration = duration;
    this.onTurnStart = onTurnStart;
    this.onTurnEnd = onTurnEnd;
    this.source = source;

    this.owner.doSomething(`starts being ${this.condition}`);
  }

  expire(): void {
    this.owner.conditions = this.owner.conditions.filter(
      (condition) => condition !== this
    );
    this.owner.doSomething(`stops being ${this.condition}`);
  }

  private tick(): void {
    if (this.duration) {
      this.duration--;
      if (this.duration <= 0) {
        this.expire();
      }
    }
  }

  startTurn(castMember: CastMember): void {
    if (this.onTurnStart === castMember.id) {
      this.tick();
    } else if (this.source === castMember.id) {
      this.tick();
    }
  }

  endTurn(castMember: CastMember): void {
    if (this.onTurnEnd === castMember.id) {
      this.tick();
    } else if (this.source === castMember.id) {
      this.tick();
    }
  }
}
