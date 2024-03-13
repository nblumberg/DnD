import { CastMember, idCastMember } from "creature";
import {
  StateChange,
  delayInitiative,
  endTurn,
  setInitiative,
  startTurn,
  tickCondition,
} from "../../change";
import { ChangeEvent, cantChange } from "../changeEvent";
import { getCastMembers } from "../getCastMembers";
import { registerType } from "../instantiateEvents";
import { ChangeEventParams, History, HistoryAndCastMembers } from "../types";

function makeChanges(
  action: string,
  castMembers: CastMember[],
  currentCastMember?: CastMember,
  initiativeOrder?: number
): StateChange<CastMember, keyof CastMember>[] {
  const turnOrder = castMembers.sort(
    ({ initiativeOrder: a, dex: aDex }, { initiativeOrder: b, dex: bDex }) => {
      if (a === b) {
        return bDex - aDex;
      }
      return b - a;
    }
  );
  if (!currentCastMember) {
    throw new Error(`Can't ${action} for missing cast member`);
  }

  const changes: StateChange<CastMember, keyof CastMember>[] = [];

  let normalTurnProgression = true;

  if (initiativeOrder !== undefined) {
    changes.push(...setInitiative(currentCastMember, initiativeOrder));
  }

  const previousCastMember = castMembers.find((c) => c.myTurn);
  if (previousCastMember) {
    changes.push(endTurn(previousCastMember));

    if (
      turnOrder.indexOf(previousCastMember) + 1 !==
      turnOrder.indexOf(currentCastMember)
    ) {
      normalTurnProgression = false;
    }

    if (normalTurnProgression) {
      castMembers.forEach((castMember) => {
        Object.values(castMember.conditions).forEach((condition) => {
          if (condition.onTurnEnd === previousCastMember.id) {
            const change = tickCondition(previousCastMember, condition);
            if (change) {
              changes.push(change);
            }
          }
        });
      });
    }
  }

  if (currentCastMember.delayInitiative) {
    changes.push(delayInitiative(currentCastMember, false));
  }
  changes.push(startTurn(currentCastMember));

  if (normalTurnProgression) {
    castMembers.forEach((castMember) => {
      Object.values(castMember.conditions).forEach((condition) => {
        if (condition.onTurnStart === currentCastMember.id) {
          const change = tickCondition(currentCastMember, condition);
          if (change) {
            changes.push(change);
          }
        }
      });
    });
  }

  return changes;
}

export class StartTurn extends ChangeEvent {
  static type = "StartTurn";

  constructor(params: ChangeEventParams) {
    super({ ...params, type: StartTurn.type });

    this.applyAndUpdate(params);
  }

  protected override makeChanges(
    history: History
  ): StateChange<CastMember, keyof CastMember>[] {
    return makeChanges(
      "start turn",
      getCastMembers(history),
      this.getCastMember(history)
    );
  }

  change(history: History): HistoryAndCastMembers {
    return cantChange("Can't change start turn", history);
  }

  override display(history: History): string {
    const castMember = this.getCastMember(history);
    return `${idCastMember(castMember)} starts their turn`;
  }
}

registerType(StartTurn.type, StartTurn);

export class TriggerReadiedAction extends ChangeEvent {
  static type = "TriggerReadiedAction";

  initiativeOrder: number;

  constructor(params: ChangeEventParams & { initiativeOrder: number }) {
    super({ ...params, type: TriggerReadiedAction.type });
    this.initiativeOrder = params.initiativeOrder;

    this.applyAndUpdate(params);
  }

  protected override makeChanges(
    history: History
  ): StateChange<CastMember, keyof CastMember>[] {
    return makeChanges(
      "trigger readied action",
      getCastMembers(history),
      this.getCastMember(history)
    );
  }

  change(history: History, initiativeOrder: number): HistoryAndCastMembers {
    this.initiativeOrder = initiativeOrder;
    return this.executeChanges(history);
  }

  override display(history: History): string {
    const castMember = this.getCastMember(history);
    return `${idCastMember(
      castMember
    )} triggers their readied action and starts their turn`;
  }
}

registerType(TriggerReadiedAction.type, TriggerReadiedAction);

export class StopDelayedAction extends ChangeEvent {
  static type = "StopDelayedAction";

  initiativeOrder: number;

  constructor(params: ChangeEventParams & { initiativeOrder: number }) {
    super({ ...params, type: StopDelayedAction.type });
    this.initiativeOrder = params.initiativeOrder;

    this.applyAndUpdate(params);
  }

  protected override makeChanges(
    history: History
  ): StateChange<CastMember, keyof CastMember>[] {
    return makeChanges(
      "stop delayed action",
      getCastMembers(history),
      this.getCastMember(history),
      this.initiativeOrder
    );
  }

  change(history: History, initiativeOrder: number): HistoryAndCastMembers {
    this.initiativeOrder = initiativeOrder;
    return this.executeChanges(history);
  }

  override display(history: History): string {
    const castMember = this.getCastMember(history);
    return `${idCastMember(
      castMember
    )} stops delaying their action and starts their turn`;
  }
}

registerType(StopDelayedAction.type, StopDelayedAction);
