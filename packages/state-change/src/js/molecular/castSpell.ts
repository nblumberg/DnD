import {
  CastMember,
  Damage,
  SavingThrow,
  Spell,
  SpellLevels,
  castMemberDoSomething,
  idCastMember,
} from "creature";
import { Roll, RollHistory } from "roll";
import { StateChange } from "../atomic/stateChange";
import { affectTarget } from "../util/affectTarget";
import { attackTarget } from "../util/attackTarget";
import { damageTarget } from "../util/damageTarget";
import { CastMembers, IChangeEvent, registerType } from "./event";
import { HasTargets } from "./hasTargets";

export class CastSpell extends HasTargets {
  static type = "Attack";

  spell: Spell;
  toHit?: RollHistory;
  damage: RollHistory[];

  constructor(
    params: Partial<IChangeEvent> & {
      attack: Spell;
      toHit?: RollHistory;
      damage: RollHistory[];
      targets: string[];
      targetSaves?: RollHistory[];
    }
  ) {
    super({ type: CastSpell.type, ...params });

    this.spell = params.attack;
    this.toHit = params.toHit;
    this.damage = params.damage;

    if (!this.changes.length) {
      this.apply();
    }
  }

  private validateSpell(attacker?: CastMember) {
    // Validate that the cast member can cast the spell
    if (!attacker) {
      throw new Error(`Caster ${this.castMemberId} not found`);
    }
    if (!attacker.spells) {
      throw new Error(`Caster ${attacker.id} has no spells`);
    }
    let foundMatch = false;
    for (const level of SpellLevels) {
      if (attacker.spells[level].spells.includes(this.spell.name)) {
        foundMatch = true;
        break;
      }
    }
    if (!foundMatch) {
      throw new Error(`Spell ${this.spell.name} not found on ${attacker.id}`);
    }

    // Validate required spell parameters
    if (this.spell.resist === "melee" || this.spell.resist === "ranged") {
      if (!this.toHit) {
        throw new Error(`Caster ${attacker.id} hasn't rolled to hit`);
      }
    } else {
      const { spells: { dc } = {} } = attacker;
      if (!this.spell.resist?.dcType) {
        throw new Error(`Spell ${this.spell.id} has no spell DC type`);
      }
      if (typeof dc !== "number" || dc === -1) {
        throw new Error(`Caster ${attacker.id} has no spell DC`);
      }
    }
    if (this.spell.resist === "melee" || this.spell.resist === "ranged") {
      if (!this.toHit) {
        throw new Error(`${this.spell.id} expected a spell attack roll`);
      }
    }

    // Validate realistic damage
    if (this.spell.damage) {
      const damages = JSON.parse(JSON.stringify(this.spell.damage)) as Damage[];
      const casterLevel = attacker.spells.casterLevel;
      if (
        this.spell.level === 0 &&
        this.spell.cantripDamageIncrease &&
        casterLevel >= 5
      ) {
        if (casterLevel >= 17) {
          damages[0].amount = this.spell.cantripDamageIncrease[2].amount;
        } else if (casterLevel >= 11) {
          damages[0].amount = this.spell.cantripDamageIncrease[1].amount;
        } else if (casterLevel >= 5) {
          damages[0].amount = this.spell.cantripDamageIncrease[0].amount;
        }
      }
      for (let i = 0; i < damages.length; i++) {
        const damage = damages[i];
        const max = new Roll(damage.amount).max();
        const actual = this.damage[i].total;
        if (actual > max) {
          console.warn(
            `Spell ${this.spell.id} can do at most ${max} ${damage.type} damage, but the damage roll was ${actual}`
          );
        }
      }
    }
  }

  private castOnTarget(
    target: CastMember,
    attacker: CastMember,
    spellSavingThrow: SavingThrow,
    damageRolls?: RollHistory[],
    damageTypes?: Damage[]
  ): { hit: boolean; changes: StateChange<CastMember, keyof CastMember>[] } {
    const targetName = idCastMember(target);

    if (this.spell.resist === "melee" || this.spell.resist === "ranged") {
      throw new Error(`${this.spell.id} expected a spell attack roll`);
    }
    if (spellSavingThrow) {
      throw new Error(`${this.spell.id} expected a target saving throw`);
    }

    const targetSavingThrow = this.targetSaves[this.targets.indexOf(target.id)];
    if (!targetSavingThrow) {
      throw new Error(
        `${this.spell.id} expected a saving throw for ${targetName}`
      );
    }

    const output = `'s ${this.spell.name} spell `;

    const { dc, dcType, halfDamage } = spellSavingThrow;
    let makesSavingThrow = false;
    if (targetSavingThrow!.total >= dc) {
      makesSavingThrow = true;
      if (!halfDamage) {
        castMemberDoSomething(
          attacker,
          `${output}does not affect ${targetName} who saves against ${dcType}`
        );
        return { hit: false, changes: [] };
      }
    }

    let changes: StateChange<CastMember, keyof CastMember>[] = [];
    if (damageTypes?.length && damageRolls?.length) {
      const damageRollsToUse =
        makesSavingThrow && halfDamage
          ? damageRolls?.map((roll) => ({
              ...roll,
              total: Math.floor(roll.total / 2),
            }))
          : damageRolls;
      changes = damageTarget(
        target,
        damageRollsToUse!,
        damageTypes!,
        (message) => {
          castMemberDoSomething(attacker, message);
        }
      );
    }

    return { hit: !makesSavingThrow, changes };
  }

  protected override makeChanges(): StateChange<
    CastMember,
    keyof CastMember
  >[] {
    const changes: StateChange<CastMember, keyof CastMember>[] = [];

    const attacker = this.getCastMember();
    this.validateSpell(attacker);
    if (!attacker) {
      return [];
    }

    const output = `'s ${this.spell.name} spell `;

    const targets = this.getTargets();
    targets.forEach((target) => {
      if (this.spell.resist === "melee" || this.spell.resist === "ranged") {
        const { hit, changes: damageChanges } = attackTarget(
          attacker,
          `${this.spell.name} spell`,
          this.toHit!,
          this.damage,
          this.spell.damage ?? [],
          target
        );
        changes.push(...damageChanges);
        if (!hit) {
          return;
        }
      } else if (this.spell.resist) {
        const savingThrow: SavingThrow = {
          ...this.spell.resist,
          dc: attacker.spells!.dc,
        };
        const { hit, changes: damageChanges } = this.castOnTarget(
          target,
          attacker,
          savingThrow,
          this.damage,
          this.spell.damage
        );
        changes.push(...damageChanges);
        if (!hit) {
          return;
        }
      }

      const { effects } = this.spell;
      if (!effects) {
        return;
      }

      effects.forEach((effect) => {
        changes.push(
          ...affectTarget(attacker, target, effect, undefined, (message) => {
            castMemberDoSomething(attacker, `${output}${message}`);
          })
        );
      });
    });
    return changes;
  }

  change(params: {
    spell: Spell;
    toHit?: RollHistory;
    damage: RollHistory[];
    targets: string[];
    targetSaves?: RollHistory[];
  }): CastMembers {
    this.spell = params.spell;
    this.toHit = params.toHit;
    this.damage = params.damage;
    this.targets = params.targets;
    this.targetSaves = params.targetSaves ?? [];
    return this.executeChanges();
  }

  override display(): string {
    const castMember = this.getCastMember();
    return `${idCastMember(castMember)} casts ${this.spell.name}`;
    // TODO: outcome
  }
}

registerType(CastSpell.type, CastSpell);
