import { getCharacter, getMonster } from "compendium-service/client";
import {
  Auditioner,
  CastMember,
  CastMemberParams,
  Condition,
  CreatureParams,
} from "creature";
import { setState, state } from "../state";
import {
  addCastMember,
  removeCastMember,
  setCastMemberState,
} from "../state/castMemberState";
import { getTurnOrder } from "./initiativeActions";

export async function castActor(auditioner: Auditioner): Promise<CastMember> {
  console.log(`Casting ${auditioner.name}`);

  let creatureParams: CreatureParams;
  if (auditioner.character) {
    creatureParams = await getCharacter(auditioner.name);
  } else {
    creatureParams = await getMonster(auditioner.name);
  }
  const castMemberParams: CastMemberParams = {
    ...creatureParams,
    ...auditioner,
  };
  return addCastMember(castMemberParams);
}

export function getCastMember(id: string): CastMember | undefined {
  const castMember = state.castMembers[id];
  if (!castMember) {
    console.error(`CastMember ${id} not found`);
    return;
  }
  return castMember;
}

export function fireActor(id: string): void {
  const castMember = getCastMember(id);
  if (!castMember) {
    return;
  }

  console.log(`Firing ${castMember.nickname ?? castMember.name}`);
  removeCastMember(id);
}

export function delayInitiative(id: string): CastMember | undefined {
  const castMember = getCastMember(id);
  if (!castMember) {
    return;
  }
  console.log(
    `Cast member ${
      castMember.nickname ?? castMember.name
    } is delaying initiative`
  );
  setCastMemberState(castMember.id, "delayInitiative", true);
  return castMember;
}

export function changeInitiativeOrder(
  id: string,
  initiativeOrder: number
): CastMember | undefined {
  const castMember = getCastMember(id);
  if (!castMember) {
    return;
  }
  castMember.initiative.add(initiativeOrder);
  setCastMemberState(castMember.id, "initiativeOrder", initiativeOrder);
  setState(
    "turnOrder",
    getTurnOrder().map(({ id }) => id)
  );
  return castMember;
}

export function addConditionToCastMember(
  id: string,
  condition: Condition
): void {
  const castMember = getCastMember(id);
  if (!castMember) {
    return;
  }

  console.log(
    `Adding condition ${condition} to ${castMember.nickname ?? castMember.name}`
  );

  if (castMember.conditions.find(({ condition: c }) => c === condition)) {
    console.warn(
      `${
        castMember.nickname ?? castMember.name
      } already has condition ${condition}`
    );
    return;
  }
  castMember.addCondition({ condition });
  setCastMemberState(id, "conditions", castMember.conditions);
}

export function removeConditionFromCastMember(
  id: string,
  condition: Condition
): void {
  const castMember = getCastMember(id);
  if (!castMember) {
    return;
  }

  console.log(
    `Removing condition ${condition} from ${
      castMember.nickname ?? castMember.name
    }`
  );

  if (castMember.conditions.find(({ condition: c }) => c === condition)) {
    console.warn(
      `${castMember.nickname ?? castMember.name} lacks condition ${condition}`
    );
    return;
  }
  castMember.removeCondition(condition);
  setCastMemberState(id, "conditions", castMember.conditions);
}
