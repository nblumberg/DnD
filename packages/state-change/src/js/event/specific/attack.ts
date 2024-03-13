import {
  Action,
  CastMember,
  castMemberDoSomething,
  idCastMember,
} from "creature";
import { Roll, RollHistory } from "roll";
import { StateChange } from "../../change";
import { affectTarget } from "../../util/affectTarget";
import { attackTarget } from "../../util/attackTarget";
import { HasTargets } from "../hasTargets";
import { registerType } from "../instantiateEvents";
import { ChangeEventParams, History, HistoryAndCastMembers } from "../types";

export class Attack extends HasTargets {
  static type = "Attack";

  attack: string;
  toHit: RollHistory;
  damage: RollHistory[];

  constructor(
    params: ChangeEventParams & {
      attack: string;
      toHit: RollHistory;
      damage: RollHistory[];
      targets: string[];
      targetSaves?: RollHistory[];
    }
  ) {
    super({ ...params, type: Attack.type });

    this.attack = params.attack;
    this.toHit = params.toHit;
    this.damage = params.damage;

    this.applyAndUpdate(params);
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
    if (!("attack" in action) || !action.attack) {
      throw new Error(
        `Action ${this.attack} on ${attackerName} is not an attack`
      );
    }
    const attack = action.attack!;
    if (!("toHit" in attack)) {
      throw new Error(`Attack ${this.attack} on ${attackerName} has no toHit`);
    }
    const onHit = attack.onHit;
    if (!onHit) {
      throw new Error(`Attack ${action.name} has no onHit`);
    }
    return { attacker, attack, onHit };
  }

  protected override makeChanges(
    history: History
  ): StateChange<CastMember, keyof CastMember>[] {
    const changes: StateChange<CastMember, keyof CastMember>[] = [];
    const { attacker, attack, onHit } = this.validateAttack(
      this.getCastMember(history)
    );

    const output = `'s ${attack.name} attack `;

    const targets = this.getTargets(history);
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

  change(
    history: History,
    params: {
      attack: string;
      toHit: RollHistory;
      damage: RollHistory[];
      targets: string[];
      targetSaves: RollHistory[];
    }
  ): HistoryAndCastMembers {
    this.attack = params.attack;
    this.toHit = params.toHit;
    this.damage = params.damage;
    this.targets = params.targets;
    this.targetSaves = params.targetSaves ?? [];
    return this.executeChanges(history);
  }

  override display(history: History): string {
    const { attacker, attack } = this.validateAttack(
      this.getCastMember(history)
    );
    const targets = this.getTargets(history);
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
