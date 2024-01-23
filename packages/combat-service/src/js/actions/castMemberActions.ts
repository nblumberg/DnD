import { CastMember, Condition } from "creature";
import { setState, state } from "../state";
import { removeCastMember, setCastMemberState } from "../state/castMemberState";
import { getTurnOrder } from "./initiativeActions";

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
  return initiativeChange(castMember, initiativeOrder);
}

export function rollInitiative(
  id: string,
  manuallyRolledInitiative?: number
): CastMember | undefined {
  if (manuallyRolledInitiative) {
    return changeInitiativeOrder(id, manuallyRolledInitiative);
  }
  const castMember = getCastMember(id);
  if (!castMember) {
    return;
  }
  const initiativeOrder = castMember.initiative.roll();
  return initiativeChange(castMember, initiativeOrder);
}

function initiativeChange(
  castMember: CastMember,
  initiativeOrder: number
): CastMember {
  setCastMemberState(castMember.id, "initiativeOrder", initiativeOrder);
  setState(
    "turnOrder",
    getTurnOrder().map(({ id }) => id)
  );
  return castMember;
}

export function addConditionToCastMember(
  id: string,
  condition: Condition,
  onSave = false,
  source?: CastMember,
  onTurnStart?: CastMember,
  onTurnEnd?: CastMember
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
  castMember.addCondition({
    condition,
    owner: castMember,
    onSave,
    source: source?.id,
    onTurnStart: onTurnStart?.id,
    onTurnEnd: onTurnEnd?.id,
  });
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

  if (!castMember.conditions.find(({ condition: c }) => c === condition)) {
    console.warn(
      `${castMember.nickname ?? castMember.name} lacks condition ${condition}`
    );
    return;
  }
  castMember.removeCondition(condition);
  setCastMemberState(id, "conditions", castMember.conditions);
}
