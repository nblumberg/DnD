import { CastMember, idCastMember } from "creature";
import { delayInitiativeChange } from "../atomic/delayInitiative";
import { endTurnChange } from "../atomic/endTurn";
import { setInitiativeChange } from "../atomic/setInitiative";
import { startTurnChange } from "../atomic/startTurn";
import { StateChange } from "../atomic/stateChange";
import { tickConditionChange } from "../atomic/tickCondition";
import {
  ChangeEvent,
  IChangeEvent,
  getCastMembers,
  registerType,
} from "./event";

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
    changes.push(setInitiativeChange(currentCastMember, initiativeOrder));
  }

  const previousCastMember = castMembers.find((c) => c.myTurn);
  if (previousCastMember) {
    changes.push(endTurnChange(previousCastMember));

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
            const change = tickConditionChange(previousCastMember, condition);
            if (change) {
              changes.push(change);
            }
          }
        });
      });
    }
  }

  if (currentCastMember.delayInitiative) {
    changes.push(delayInitiativeChange(currentCastMember, false));
  }
  changes.push(startTurnChange(currentCastMember));

  if (normalTurnProgression) {
    castMembers.forEach((castMember) => {
      Object.values(castMember.conditions).forEach((condition) => {
        if (condition.onTurnStart === currentCastMember.id) {
          const change = tickConditionChange(currentCastMember, condition);
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

  constructor(params: Partial<IChangeEvent>) {
    super({ type: StartTurn.type, ...params });

    if (!this.changes.length) {
      this.apply();
    }
  }

  protected override makeChanges(): StateChange<
    CastMember,
    keyof CastMember
  >[] {
    return makeChanges("start turn", getCastMembers(), this.getCastMember());
  }

  change(): CastMember | undefined {
    console.warn("Can't change start turn");
    return this.getCastMember();
  }

  override display(): string {
    const castMember = this.getCastMember();
    return `${idCastMember(castMember)} starts their turn`;
  }
}

registerType(StartTurn.type, StartTurn);

export class TriggerReadiedAction extends ChangeEvent {
  static type = "TriggerReadiedAction";

  initiativeOrder: number;

  constructor(params: Partial<IChangeEvent> & { initiativeOrder: number }) {
    super({ type: TriggerReadiedAction.type, ...params });
    this.initiativeOrder = params.initiativeOrder;

    if (!this.changes.length) {
      this.apply();
    }
  }

  protected override makeChanges(): StateChange<
    CastMember,
    keyof CastMember
  >[] {
    return makeChanges(
      "trigger readied action",
      getCastMembers(),
      this.getCastMember()
    );
  }

  change(initiativeOrder: number): CastMember | undefined {
    this.initiativeOrder = initiativeOrder;
    return this.executeChanges();
  }

  override display(): string {
    const castMember = this.getCastMember();
    return `${idCastMember(
      castMember
    )} triggers their readied action and starts their turn`;
  }
}

registerType(TriggerReadiedAction.type, TriggerReadiedAction);

export class StopDelayedAction extends ChangeEvent {
  static type = "StopDelayedAction";

  initiativeOrder: number;

  constructor(params: Partial<IChangeEvent> & { initiativeOrder: number }) {
    super({ type: StopDelayedAction.type, ...params });
    this.initiativeOrder = params.initiativeOrder;

    if (!this.changes.length) {
      this.apply();
    }
  }

  protected override makeChanges(): StateChange<
    CastMember,
    keyof CastMember
  >[] {
    return makeChanges(
      "stop delayed action",
      getCastMembers(),
      this.getCastMember(),
      this.initiativeOrder
    );
  }

  change(initiativeOrder: number): CastMember | undefined {
    this.initiativeOrder = initiativeOrder;
    return this.executeChanges();
  }

  override display(): string {
    const castMember = this.getCastMember();
    return `${idCastMember(
      castMember
    )} stops delaying their action and starts their turn`;
  }
}

registerType(StopDelayedAction.type, StopDelayedAction);
