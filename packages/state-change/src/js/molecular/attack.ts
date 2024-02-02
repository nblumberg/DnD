import {
  Action,
  Attack as AttackDescription,
  CastMember,
  castMemberDoSomething,
  idCastMember,
} from "creature";
import { Roll, RollHistory } from "roll";
import { StateChange } from "../atomic/stateChange";
import { affectTarget } from "../util/affectTarget";
import { attackTarget } from "../util/attackTarget";
import { CastMembers, IChangeEvent, registerType } from "./event";
import { HasTargets } from "./hasTargets";

export class Attack extends HasTargets {
  static type = "Attack";

  attack: string;
  toHit: RollHistory;
  damage: RollHistory[];

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

    if (!this.changes.length) {
      this.apply();
    }
  }

  private validateAttack(attacker?: CastMember) {
    if (!attacker) {
      throw new Error(`Attacker ${this.castMemberId} not found`);
    }
    const attackerName = idCastMember(attacker);
    const action: Action | undefined = Object.values(attacker?.actions ?? {})
      .flat()
      .find(({ name }) => name === this.attack);
    if (!action) {
      throw new Error(`Attack ${this.attack} not found on ${attackerName}`);
    }
    if (!("toHit" in action)) {
      throw new Error(
        `Action ${this.attack} on ${attackerName} is not an attack`
      );
    }
    const attack = action as AttackDescription;
    const onHit = attack.onHit;
    if (!onHit) {
      throw new Error(`Attack ${action.name} has no onHit`);
    }
    return { attacker, attack, onHit };
  }

  protected override makeChanges(): StateChange<
    CastMember,
    keyof CastMember
  >[] {
    const changes: StateChange<CastMember, keyof CastMember>[] = [];
    const { attacker, attack, onHit } = this.validateAttack(
      this.getCastMember()
    );

    const output = `'s ${attack.name} attack `;

    const targets = this.getTargets();
    targets.forEach((target) => {
      const { hit, changes: damageChanges } = attackTarget(
        attacker,
        `${attack.name} attack`,
        this.toHit,
        this.damage,
        onHit.damage,
        target
      );
      changes.push(...damageChanges);
      if (!hit) {
        return;
      }

      const { effects } = onHit;
      if (!effects) {
        return;
      }

      effects.forEach((effect) => {
        changes.push(
          ...affectTarget(
            attacker,
            target,
            effect,
            this.targetSaves[this.targets.indexOf(target.id)],
            (message) => {
              castMemberDoSomething(attacker, `${output}${message}`);
            }
          )
        );
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
  }): CastMembers {
    this.attack = params.attack;
    this.toHit = params.toHit;
    this.damage = params.damage;
    this.targets = params.targets;
    this.targetSaves = params.targetSaves ?? [];
    return this.executeChanges();
  }

  override display(): string {
    const { attacker, attack } = this.validateAttack(this.getCastMember());
    const targets = this.getTargets();
    const extra =
      attack.toHit.modifier === "∞" ? Infinity : attack.toHit.modifier;
    const toHitRoll = new Roll({ dieCount: 1, dieSides: 20, extra });
    toHitRoll.add(this.toHit.total, this.toHit.dice);
    const hits: CastMember[] = [];
    const misses: CastMember[] = [];
    targets.forEach((target) => {
      if (this.toHit.total >= target.ac) {
        hits.push(target);
      } else {
        misses.push(target);
      }
    });
    const targeting = `${idCastMember(attacker)} makes ${
      attack.name
    } attack against ${targets.map(idCastMember)} (${toHitRoll.breakdown()})${
      misses.length ? `, misses ${misses.map(idCastMember)}` : ""
    }${hits.length ? `, hits ${hits.map(idCastMember)}` : ""}`;
    return targeting;
  }
}

registerType(Attack.type, Attack);
