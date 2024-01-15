import { setLog } from "roll";
import { ClassMembers } from "serializable";
import { AbilityRaw } from "./ability";
import { DamageType } from "./action";
import { Actor, toId } from "./actor";
import { AbilityCheck, AbilityCheckRaw, Check } from "./check";
import { Condition } from "./condition";
import { Creature, CreatureParams, CreatureRaw } from "./creature";

setLog(() => {});

interface ActiveConditionParam {
  condition: Condition;
  onSave?: boolean;
  duration?: number;
  onTurnStart?: CastMember;
  onTurnEnd?: CastMember;
  source?: CastMember;
}

export interface CastMemberParams extends CreatureParams {
  actor: Actor;
  id?: string;
  unique?: boolean;
  initiativeOrder?: number;
  nickname?: string;
  conditions?: ActiveConditionParam[];
  hpCurrent?: number;
  hpTemp?: number;
  delayInitiative?: boolean;
}

class ActiveCondition implements ActiveConditionParam {
  private owner: CastMember;
  condition: Condition;
  onSave?: boolean;
  duration?: number;
  onTurnStart?: CastMember;
  onTurnEnd?: CastMember;
  source?: CastMember;

  constructor({
    owner,
    condition,
    onSave,
    onTurnStart,
    onTurnEnd,
    duration = onTurnStart || onTurnEnd ? 1 : Infinity,
    source,
  }: {
    owner: CastMember;
    condition: Condition;
    onSave?: boolean;
    duration?: number;
    onTurnStart?: CastMember;
    onTurnEnd?: CastMember;
    source?: CastMember;
  }) {
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
    if (this.onTurnStart === castMember) {
      this.tick();
    } else if (this.source === castMember) {
      this.tick();
    }
  }

  endTurn(castMember: CastMember): void {
    if (this.onTurnEnd === castMember) {
      this.tick();
    } else if (this.source === castMember) {
      this.tick();
    }
  }
}

export class CastMember extends Creature {
  actor: Actor;
  id: string;
  unique: boolean;
  initiativeOrder: number;
  nickname?: string;

  override str: AbilityCheck;
  override dex: AbilityCheck;
  override con: AbilityCheck;
  override int: AbilityCheck;
  override wis: AbilityCheck;
  override cha: AbilityCheck;

  initiative: Check;
  delayInitiative: boolean;

  conditions: ActiveCondition[];
  hpCurrent: number;
  hpTemp: number;

  constructor(params: CastMemberParams | CastMemberRaw) {
    super(params);
    if (!params.actor) {
      throw new Error(`Actor required for CastMember ${this.name}`);
    }
    this.actor = params.actor;
    this.unique = !!params.unique;
    this.id = params.id ?? toId(this.name);
    this.nickname = params.nickname;

    function initAbilityCheck(
      owner: CastMember,
      param: number | AbilityRaw | AbilityCheckRaw
    ): AbilityCheck {
      if (typeof param === "number") {
        return new AbilityCheck(param, owner);
      }
      return new AbilityCheck(param.score, owner);
    }

    this.str = initAbilityCheck(this, params.str);
    this.dex = initAbilityCheck(this, params.dex);
    this.con = initAbilityCheck(this, params.con);
    this.int = initAbilityCheck(this, params.int);
    this.wis = initAbilityCheck(this, params.wis);
    this.cha = initAbilityCheck(this, params.cha);

    if (!params.initiative || typeof params.initiative === "number") {
      this.initiative = new Check(
        { extra: params.initiative ?? this.dex.modifier },
        this
      );
    } else {
      this.initiative = new Check({ extra: params.initiative.extra }, this);
    }
    this.initiative.roll = () => {
      this.initiativeOrder = Check.prototype.roll.call(this.initiative);
      return this.initiativeOrder;
    };

    this.initiativeOrder = params.initiativeOrder ?? 1;
    this.delayInitiative = params.delayInitiative ?? false;
    this.conditions =
      params.conditions?.map(
        (item) => new ActiveCondition({ ...item, owner: this })
      ) ?? [];
    this.hpCurrent = params.hpCurrent ?? params.hp;
    this.hpTemp = params.hpTemp ?? 0;
  }

  doSomething(something: string): void {
    console.log(`${this.nickname ?? this.name} ${something}`);
  }

  addCondition(condition: ActiveConditionParam): void {
    this.conditions.push(new ActiveCondition({ ...condition, owner: this }));
  }

  removeCondition(condition: Condition): void {
    this.conditions.find((c) => c.condition === condition)?.expire();
  }

  damage(amount: number, type: DamageType): void {
    let actualAmount = amount;
    if (this.damageImmunities.includes(type)) {
      this.doSomething(`is immune to ${type} damage`);
      return;
    } else if (this.damageResistances.includes(type)) {
      this.doSomething(`resists half ${type} damage`);
      actualAmount = Math.floor(amount / 2);
    } else if (this.damageVulnerabilities.includes(type)) {
      this.doSomething(`takes double ${type} damage`);
      actualAmount = amount * 2;
    }
    if (this.hpTemp > 0) {
      const tmpAmount = Math.min(this.hpTemp, actualAmount);
      this.doSomething(
        `takes ${tmpAmount} ${type} damage from temporary Hit Points`
      );
      actualAmount -= tmpAmount;
      this.hpTemp -= tmpAmount;
    }
    this.doSomething(`takes ${actualAmount} ${type} damage`);
    this.hpCurrent -= actualAmount;
  }

  heal(amount = this.hp): void {
    const actualAmount = Math.min(amount, this.hp - this.hpCurrent);
    this.doSomething(`heals ${actualAmount} damage`);
    this.hpCurrent += actualAmount;
  }

  gainTemporaryHitPoints(amount: number): void {
    if (amount <= this.hpTemp) {
      this.doSomething(`keeps ${this.hpTemp} temporary Hit Points`);
    } else {
      this.doSomething(`gains ${amount} temporary Hit Points`);
      this.hpTemp = amount;
    }
  }
}

export type CastMemberRaw = Omit<ClassMembers<CastMember>, keyof Creature> &
  CreatureRaw;
