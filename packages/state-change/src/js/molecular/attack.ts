import {
  Action,
  Attack as AttackDescription,
  CastMember,
  castMemberDoSomething,
} from "creature";
import { RollHistory } from "roll";
import { StateChange } from "..";
import { addConditionChange } from "../atomic/addCondition";
import { damageCastMemberChange } from "../atomic/damageCastMember";
import { ChangeEvent, IChangeEvent, registerType } from "./event";

export class Attack extends ChangeEvent {
  static type = "Attack";

  attack: string;
  toHit: RollHistory;
  damage: RollHistory[];
  targets: string[];
  targetSaves: RollHistory[];

  constructor(
    params: Partial<IChangeEvent> & {
      attack: string;
      toHit: RollHistory;
      damage: RollHistory[];
      targets: string[];
      targetSaves?: RollHistory[];
    }
  ) {
    super({ type: Attack.type, ...params });

    this.attack = params.attack;
    this.toHit = params.toHit;
    this.damage = params.damage;
    this.targets = params.targets;
    this.targetSaves = params.targetSaves ?? [];

    if (!this.changes.length) {
      this.apply();
    }
  }

  protected override makeChanges(): StateChange<
    CastMember,
    keyof CastMember
  >[] {
    const changes: StateChange<CastMember, keyof CastMember>[] = [];
    const castMembers = this.getCastMembers();
    const attacker = castMembers.find(({ id }) => id === this.castMemberId);
    if (!attacker) {
      throw new Error(`Attacker ${this.castMemberId} not found`);
    }
    const targets = this.targets.map((targetId) => {
      const target = castMembers.find(({ id }) => id === targetId);
      if (!target) {
        throw new Error(`Target ${targetId} not found`);
      }
      return target;
    });

    const action: Action | undefined = Object.values(attacker.actions)
      .flat()
      .find(({ name }) => name === this.attack);
    if (!action) {
      throw new Error(`Attack ${this.attack} not found on ${attacker.id}`);
    }
    if (!("toHit" in action)) {
      throw new Error(
        `Action ${this.attack} on ${attacker.id} is not an attack`
      );
    }
    const attack = action as AttackDescription;

    const output = `'s ${attack.name} attack `;

    targets.forEach((castMember) => {
      if (this.toHit.total < castMember.ac) {
        castMemberDoSomething(attacker, `${output}misses ${castMember.name}`);
        return;
      }

      const onHit = attack.onHit;
      if (!onHit) {
        throw new Error(`Attack ${attack.name} has no onHit`);
      }

      const damages = onHit.damage;

      damages.forEach((damage, i) => {
        const damageChanges = damageCastMemberChange(
          castMember,
          this.damage[i].total,
          damage.type
        );
        changes.push(...damageChanges);
        const tmpDamage =
          damageChanges.length === 2
            ? damageChanges[0]!.oldValue! - damageChanges[0]!.newValue!
            : 0;
        const damageIndex = damageChanges.length === 2 ? 1 : 0;
        const realDamage =
          damageChanges[damageIndex]!.oldValue! -
          damageChanges[damageIndex]!.newValue!;
        castMemberDoSomething(
          attacker,
          `${output}hits ${castMember.nickname ?? castMember.name} for ${
            tmpDamage ? `${tmpDamage} temporary hit point damage and ` : ""
          }${realDamage} ${damage.type} damage`
        );
      });

      const { effects } = onHit;
      if (!effects) {
        return;
      }

      effects.forEach((effect) => {
        const { dc, dcType } = effect;
        const onSave = dc && dcType ? { dc, dcType } : undefined;
        if (onSave) {
          if (
            this.targetSaves[this.targets.indexOf(castMember.id)]?.total >= dc!
          ) {
            castMemberDoSomething(
              attacker,
              `${output}does not affect ${
                castMember.nickname ?? castMember.name
              } who saves against ${effect.condition}`
            );
            return;
          }
          castMemberDoSomething(
            attacker,
            `${output}affects ${
              castMember.nickname ?? castMember.name
            } who fails to save against ${effect.condition}`
          );
        } else {
          castMemberDoSomething(
            attacker,
            `${output}affects ${castMember.nickname ?? castMember.name} with ${
              effect.condition
            }`
          );
        }
        let onTurnStart: string | undefined;
        if (effect.onTurnStart) {
          if (effect.onTurnStart === "attacker") {
            onTurnStart = attacker.id;
          } else {
            onTurnStart = castMember.id;
          }
        }
        let onTurnEnd: string | undefined;
        if (effect.onTurnEnd) {
          if (effect.onTurnEnd === "attacker") {
            onTurnStart = attacker.id;
          } else {
            onTurnStart = castMember.id;
          }
        }
        const change = addConditionChange(castMember, {
          condition: effect.condition,
          onSave,
          duration:
            typeof effect.duration === "number" ? effect.duration : undefined,
          onTurnStart,
          onTurnEnd,
          source: attacker.id,
        });
        changes.push(change);
      });
    });
    return changes;
  }

  change(params: {
    attack: string;
    toHit: RollHistory;
    damage: RollHistory[];
    targets: string[];
    targetSaves: RollHistory[];
  }): CastMember | undefined {
    this.attack = params.attack;
    this.toHit = params.toHit;
    this.damage = params.damage;
    this.targets = params.targets;
    this.targetSaves = params.targetSaves ?? [];
    return this.executeChanges();
  }
}

registerType(Attack.type, Attack);
