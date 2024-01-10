import { Creature } from "creature";
import { setLog } from "roll";
import { getCharacter, getMonster } from "../services/compendium";
import { Actor, toId } from "./Actor";
import { Character } from "./Character";

setLog(() => {});

export class CastMember extends Creature {
  actor: Actor;
  id: string;
  unique: boolean;
  initiativeOrder: number;
  nickname?: string;

  constructor(
    creature: Creature,
    actor?: Actor,
    id?: string,
    unique?: boolean
  ) {
    super(creature);
    if (creature instanceof CastMember) {
      this.actor = creature.actor;
      this.unique = creature.unique;
      this.id = creature.id;
      this.initiativeOrder = creature.initiativeOrder;
    } else {
      if (!actor) {
        throw new Error(`Actor required for CastMember ${this.name}`);
      }
      this.actor = actor;
      this.unique = !!unique;
      this.id = id ?? toId(this.name);
      this.initiativeOrder = 1;
    }
  }

  rollInitiative() {
    this.initiativeOrder = this.initiative.roll();
    console.log(
      `${this.nickname ?? this.name} rolled ${
        this.initiativeOrder
      } for initiative (${this.initiative.breakdown()})`
    );
  }
}

const castMembers: Map<string, CastMember> = new Map();

export function getCastMember(id: string): CastMember | undefined {
  return castMembers.get(id);
}

export function checkCast(actor: Actor): CastMember[] {
  const { existingCastMembers } = findUniqueId(actor.id);
  return existingCastMembers;
}

export async function castActor(actor: Actor): Promise<CastMember> {
  const { id: originalId } = actor;
  const { id, existingCastMembers } = findUniqueId(originalId);
  const [existingCastMember] = existingCastMembers;
  let creature: Creature = existingCastMember;
  let unique = false;
  if (!existingCastMember) {
    if (actor instanceof Character) {
      creature = await getCharacter(actor.name);
      unique = true;
    } else {
      creature = await getMonster(actor.name);
    }
  }
  const castMember = new CastMember(creature, actor, id, unique);
  castMembers.set(id, castMember);
  return castMember;
}

export function fireCastMember(id: string): void {
  castMembers.delete(id);
}

function findUniqueId(originalId: string): {
  id: string;
  existingCastMembers: CastMember[];
} {
  let id = originalId;
  let i = 2;
  const existingCastMembers: CastMember[] = [];
  while (castMembers.get(id)) {
    existingCastMembers.push(castMembers.get(id)!);
    id = `${originalId}_${i++}`;
  }
  return { id, existingCastMembers };
}
