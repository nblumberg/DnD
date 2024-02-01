import { ActiveCondition, CastMember, Condition, idCastMember } from "creature";
import { Roll, RollHistory } from "roll";
import {
  AddCondition,
  DelayInitiative,
  IChangeEvent,
  ReadyAction,
  RemoveCondition,
  RollInitiative,
  StartTurn,
  StopDelayedAction,
  TriggerReadiedAction,
  getHistoryHandle,
} from "state-change";
import { onHistoryChange, setState, state } from "../state";
import { setCastMemberState } from "../state/castMemberState";
import { getTurnOrder } from "./initiativeActions";

function emitChanges(event: IChangeEvent): CastMember | undefined {
  onHistoryChange();

  const history = getHistoryHandle<CastMember>("CastMember").getHistory();
  let castMember: CastMember | undefined;
  event.changes.forEach((changeId) => {
    const change = history.find(({ id }) => id === changeId);
    if (!change) {
      throw new Error(`Couldn't find change ${changeId}`);
    }
    castMember = setCastMemberState(
      change.object,
      change.property,
      change.newValue
    );
  });
  return castMember;
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

  return initiativeChange(new RollInitiative({ castMemberId: id, roll }));
}

export function delayInitiative(id: string): CastMember | undefined {
  const castMember = getCachedCastMember(id);
  if (!castMember) {
    return;
  }
  console.log(`Cast member ${idCastMember(castMember)} is delaying initiative`);

  return emitChanges(new DelayInitiative({ castMemberId: id }));
}

export function readyAction(id: string): CastMember | undefined {
  const castMember = getCachedCastMember(id);
  if (!castMember) {
    return;
  }
  console.log(`Cast member ${idCastMember(castMember)} is readying an action`);

  return emitChanges(new ReadyAction({ castMemberId: id }));
}

export function startTurn(id: string): CastMember | undefined {
  const castMember = getCachedCastMember(id);
  if (!castMember) {
    return;
  }
  console.log(`Cast member ${idCastMember(castMember)} is starting their turn`);
  return emitChanges(new StartTurn({ castMemberId: id }));
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
  const castMember = emitChanges(event);
  setState(
    "turnOrder",
    getTurnOrder().map(({ id }) => id)
  );
  return castMember;
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
  return emitChanges(
    new AddCondition({
      castMemberId: id,
      condition: activeCondition,
    })
  );
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
  return emitChanges(new RemoveCondition({ castMemberId: id, condition }));
}
