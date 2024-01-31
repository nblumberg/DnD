import { CastMember } from "creature";
import {
  HistoryEntry,
  StateAdd,
  applyHistoryEntry,
  getHistoryHandle,
  getObjectState,
} from "../atomic/stateChange";
import { Unique } from "../util/unique";

let changeEventHistory: IChangeEvent[] = [];
const typeMap: { [key: string]: { new (...args: any[]): ChangeEvent } } = {};

export function registerType(
  type: string,
  constructor: { new (...args: any[]): ChangeEvent }
): void {
  typeMap[type] = constructor;
}

export interface IChangeEvent extends Unique {
  type: string;
  castMemberId: string;
  changes: string[];

  apply(): CastMember | undefined;
  change(...args: any[]): CastMember | undefined;
  display(html?: boolean): string;
  undo(): CastMember | undefined;
}

export abstract class ChangeEvent implements IChangeEvent {
  type: string;
  id: string;
  castMemberId: string;
  changes: string[] = [];

  constructor({ type, castMemberId, id, changes }: Partial<IChangeEvent>) {
    if (!type) {
      throw new Error("ChangeEvent type is required");
    }
    this.type = type;
    if (!castMemberId) {
      throw new Error("ChangeEvent type is required");
    }
    this.castMemberId = castMemberId;
    this.id = id ?? `${Date.now()}-${Math.random()}`;
    this.changes = changes ?? [];
  }

  abstract change(...args: any[]): CastMember | undefined;

  abstract display(html?: boolean): string;

  protected abstract makeChanges(): HistoryEntry<CastMember>[];

  apply() {
    addToHistory(this);
    const changes = this.makeChanges();
    return this.pushChanges(changes)!;
  }

  undo() {
    removeFromHistory(this);
    return this.removeChanges()!;
  }

  protected getChanges(): HistoryEntry<CastMember>[] {
    const history = getHistoryHandle<CastMember>("CastMember").getHistory();
    return this.changes.map((id) => {
      const change = history.find(({ id: changeId }) => changeId === id);
      if (!change) {
        throw new Error(`Couldn't find change ${id}`);
      }
      return change;
    });
  }

  protected executeChanges(
    changes = this.makeChanges()
  ): CastMember | undefined {
    const castMember = this.replaceChanges(changes);
    this.changes = changes.map(({ id }) => id);
    return castMember;
  }

  protected getHistoryBefore(): HistoryEntry<CastMember>[] {
    const history = getHistoryHandle<CastMember>("CastMember").getHistory();
    if (!this.changes.length) {
      return history;
    }
    const [firstChange] = this.changes;
    const index = history.findIndex(({ id }) => id === firstChange);
    if (index === -1) {
      throw new Error("Couldn't find first change in history");
    }
    return history.slice(0, index); // don't include any of my changes
  }

  protected getCastMember(): CastMember {
    const history = this.getHistoryBefore();
    const castMember = getCastMember(this.castMemberId, history);
    if (!castMember) {
      throw new Error(`CastMember ${this.castMemberId} not found`);
    }
    return castMember;
  }

  protected applyChanges(
    changes: HistoryEntry<CastMember>[]
  ): CastMember | undefined {
    let castMember: CastMember | undefined;
    for (const change of changes) {
      if (change.type === "+") {
        castMember = applyHistoryEntry<CastMember, StateAdd<CastMember>>(
          change
        );
      } else {
        castMember = this.getCastMember();
        if (change.type === "-") {
          if (!castMember) {
            return undefined;
          }
          castMember = applyHistoryEntry(change, castMember);
        } else {
          if (!castMember) {
            throw new Error(
              `Can't apply change ${change.id} to missing castMember`
            );
          }
          castMember = applyHistoryEntry(change, castMember);
        }
      }
    }
    return castMember;
  }

  protected pushChanges(
    newChanges: HistoryEntry<CastMember>[]
  ): CastMember | undefined {
    const { pushStateHistory } = getHistoryHandle<CastMember>("CastMember");
    this.changes = pushStateHistory(newChanges).map(({ id }) => id);
    return this.applyChanges(newChanges);
  }

  protected removeChanges(): CastMember | undefined {
    const { popStateHistory } = getHistoryHandle<CastMember>("CastMember");
    this.changes.forEach((id) => popStateHistory(id));
    this.changes = [];
    return this.getCastMember();
  }

  protected replaceChanges(
    newChanges: HistoryEntry<CastMember>[]
  ): CastMember | undefined {
    const { popStateHistory } = getHistoryHandle<CastMember>("CastMember");
    const oldChanges = this.changes;
    this.changes = newChanges.map(({ id }) => id);
    for (let i = 0; i < oldChanges.length; i++) {
      if (i !== oldChanges.length - 1) {
        popStateHistory(oldChanges[i]);
        continue;
      }
      popStateHistory(oldChanges[i], newChanges);
    }
    return this.getCastMember();
  }
}

export function addToHistory(event: IChangeEvent): void {
  // event.id = `${Date.now()}-${Math.random()}`;
  changeEventHistory.push(event);
}

function removeFromHistory(event: IChangeEvent): void {
  changeEventHistory.splice(
    changeEventHistory.findIndex(({ id }) => id === event.id),
    1
  );
}

export function getHistory(): IChangeEvent[] {
  return [...changeEventHistory];
}

export function getCastMember(
  castMemberId: string,
  history = getHistoryHandle<CastMember>("CastMember").getHistory(),
  allowNeverAdded = false,
  getLastStateBeforeRemove = false
): CastMember | undefined {
  return getObjectState<CastMember>(
    castMemberId,
    history,
    allowNeverAdded,
    getLastStateBeforeRemove
  );
}

export function getCastMembers(
  history = getHistoryHandle<CastMember>("CastMember").getHistory()
): CastMember[] {
  const castMembers = history
    .filter(({ type }) => type === "+")
    .map(({ object }) => {
      return getObjectState<CastMember>(object, history);
    })
    .filter((castMember) => castMember !== undefined) as CastMember[];
  return castMembers;
}

export function setHistory(history: IChangeEvent[]): ChangeEvent[] {
  const newHistory = history.map((item) => {
    const constructor = typeMap[item.type];
    if (!constructor) {
      throw new Error(`No constructor for type ${item.type}`);
    }
    return new constructor(item);
  });
  changeEventHistory = newHistory;
  return newHistory;
}
