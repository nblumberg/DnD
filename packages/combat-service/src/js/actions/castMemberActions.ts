import { ActiveCondition, CastMember, Condition, idCastMember } from "creature";
import { Roll, RollHistory } from "roll";
import {
  AddCondition,
  Attack,
  DelayInitiative,
  HistoryEntry,
  IChangeEvent,
  ReadyAction,
  RemoveCondition,
  RollInitiative,
  StartTurn,
  StopDelayedAction,
  TriggerReadiedAction,
} from "state-change";
import { setState, state } from "../state";
import { setCastMemberState } from "../state/castMemberState";
import { clearUndoneHistory } from "./historyActions";
import { getTurnOrder } from "./initiativeActions";

function emitChanges(event: IChangeEvent): Record<string, CastMember> {
  clearUndoneHistory();
  const castMembers: Record<string, CastMember> = {};
  event.getChanges().forEach((change: HistoryEntry<CastMember>) => {
    if (change.type === "-") {
      castMembers[change.object] = change.newValue;
    } else if (
      change.type === "c" ||
      change.type === "c+" ||
      change.type === "c-"
    ) {
      const castMember = setCastMemberState(
        change.object,
        change.property,
        change.newValue as CastMember[keyof CastMember] | undefined
      );
      castMembers[castMember.id] = castMember;
    } else {
      delete castMembers[change.object];
    }
  });
  return castMembers;
}

export function getCachedCastMember(id: string): CastMember | undefined {
  const castMember = state.castMembers[id];
  if (!castMember) {
    console.error(`CastMember ${id} not found`);
    return;
  }
  return castMember;
}

export function rollInitiative(
  id: string,
  manuallyRolledInitiative?: RollHistory
): CastMember | undefined {
  const castMember = getCachedCastMember(id);
  if (!castMember) {
    return;
  }

  let roll = manuallyRolledInitiative;
  if (!roll) {
    if (!castMember) {
      throw new Error(`Can't roll initiative for missing cast member ${id}`);
    }
    const die = new Roll({
      dieCount: 1,
      dieSides: 20,
      extra: castMember.initiative,
    });
    die.roll();
    roll = die.getLastRoll();
  }

  console.log(`CastMember ${id} rolled ${roll.total} for initiative`);

  return initiativeChange(new RollInitiative({ castMemberId: id, roll }));
}

export function delayInitiative(id: string): CastMember | undefined {
  const castMember = getCachedCastMember(id);
  if (!castMember) {
    return;
  }
  console.log(`Cast member ${idCastMember(castMember)} is delaying initiative`);

  const castMembers = emitChanges(new DelayInitiative({ castMemberId: id }));
  return castMembers[id];
}

export function readyAction(id: string): CastMember | undefined {
  const castMember = getCachedCastMember(id);
  if (!castMember) {
    return;
  }
  console.log(`Cast member ${idCastMember(castMember)} is readying an action`);

  const castMembers = emitChanges(new ReadyAction({ castMemberId: id }));
  return castMembers[id];
}

export function startTurn(id: string): CastMember | undefined {
  const castMember = getCachedCastMember(id);
  if (!castMember) {
    return;
  }
  console.log(`Cast member ${idCastMember(castMember)} is starting their turn`);
  const castMembers = emitChanges(new StartTurn({ castMemberId: id }));
  return castMembers[id];
}

export function stopDelayedAction(
  id: string,
  initiativeOrder: number
): CastMember | undefined {
  let castMember = getCachedCastMember(id);
  if (!castMember) {
    return;
  }
  console.log(`Cast member ${idCastMember(castMember)} is delaying initiative`);

  return initiativeChange(
    new StopDelayedAction({
      castMemberId: id,
      initiativeOrder,
    })
  );
}

export function triggerReadiedAction(
  id: string,
  initiativeOrder: number
): CastMember | undefined {
  const castMember = getCachedCastMember(id);
  if (!castMember) {
    return;
  }
  console.log(
    `Cast member ${idCastMember(castMember)} is triggering a readied action`
  );

  return initiativeChange(
    new TriggerReadiedAction({
      castMemberId: id,
      initiativeOrder,
    })
  );
}

function initiativeChange(event: IChangeEvent): CastMember | undefined {
  emitChanges(event);
  const castMembers = getTurnOrder();
  console.log("castMembers", state.castMembers);
  setState(
    "turnOrder",
    castMembers.map(({ id }) => id)
  );
  return castMembers.find(({ id }) => event.castMemberId === id);
}

export function addConditionToCastMember(
  id: string,
  condition: Partial<ActiveCondition> & { condition: Condition },
  source?: CastMember,
  onTurnStart?: CastMember,
  onTurnEnd?: CastMember
): CastMember | undefined {
  const castMember = getCachedCastMember(id);
  if (!castMember) {
    return;
  }

  console.log(`Adding condition ${condition} to ${idCastMember(castMember)}`);

  const activeCondition: ActiveCondition = {
    id: "tmp",
    duration: Number.MAX_SAFE_INTEGER,
    ...condition,
    source: source?.id ?? "dm",
    onTurnStart: onTurnStart?.id,
    onTurnEnd: onTurnEnd?.id ?? id,
  };
  const castMembers = emitChanges(
    new AddCondition({
      castMemberId: id,
      condition: activeCondition,
    })
  );
  return castMembers[id];
}

export function removeConditionFromCastMember(
  id: string,
  condition: string
): CastMember | undefined {
  const castMember = getCachedCastMember(id);
  if (!castMember) {
    return;
  }

  console.log(
    `Removing condition ${condition} from ${idCastMember(castMember)}`
  );
  const castMembers = emitChanges(
    new RemoveCondition({ castMemberId: id, condition })
  );
  return castMembers[id];
}

export function attack({
  id: attackerId,
  attack: attackName,
  toHit,
  damage,
  targets: targetIds,
  targetSaves,
}: {
  id: string;
  attack: string;
  toHit: RollHistory;
  damage: RollHistory[];
  targets: string[];
  targetSaves?: RollHistory[];
}): void {
  const attacker = getCachedCastMember(attackerId);
  if (!attacker) {
    console.warn(`Cast member ${attackerId} not found`);
    return;
  }
  const possibleTargets = targetIds.map(getCachedCastMember);
  const missing = possibleTargets
    .filter((target) => !target)
    .map((_target, i) => targetIds[i]);
  if (missing.length) {
    console.warn(
      `Some targets not found for cast member ${idCastMember(
        attacker
      )}'s ${attackName} attack: $${missing.join(", ")}`
    );
    return;
  }
  const targets = possibleTargets as CastMember[];

  console.log(
    `Cast member ${idCastMember(attacker)} is attacking ${targets
      .map(idCastMember)
      .join(", ")} with it's ${attackName} attack, rolling ${
      toHit.total
    } to hit and ${damage.map(({ total }) => total).join(" + ")} damage`
  );

  new Attack({
    castMemberId: attacker.id,
    attack: attackName,
    toHit,
    damage,
    targets: targetIds,
    targetSaves,
  });
}
