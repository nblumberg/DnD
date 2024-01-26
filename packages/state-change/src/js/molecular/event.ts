import { CastMember } from "creature";
import {
  HistoryEntry,
  applyHistoryEntry,
  getHistoryHandle,
  getObjectState,
} from "../atomic/stateChange";
import { Unique } from "../unique";

const changeEventHistory: IChangeEvent[] = [];
const typeMap: { [key: string]: { new (...args: any[]): IChangeEvent } } = {};

export function registerType(
  type: string,
  constructor: { new (...args: any[]): IChangeEvent }
): void {
  typeMap[type] = constructor;
}

export interface IChangeEvent extends Unique {
  type: string;
  castMemberId: string;
  changes: string[];

  apply(): CastMember | undefined;
  change(...args: any[]): CastMember | undefined;
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

  apply() {
    addToHistory(this);
    const changes = this.makeChanges();
    return this.pushChanges(changes)!;
  }

  protected abstract makeChanges(): HistoryEntry<CastMember>[];

  protected executeChanges(
    changes = this.makeChanges()
  ): CastMember | undefined {
    const castMember = this.replaceChanges(changes);
    this.changes = changes.map(({ id }) => id);
    return castMember;
  }

  abstract change(...args: any[]): CastMember | undefined;

  undo() {
    removeFromHistory(this);
    return this.removeChanges()!;
  }

  protected getHistory(): HistoryEntry<CastMember>[] {
    const { getHistory } = getHistoryHandle("CastMember");
    return getHistory();
  }

  protected getCastMember(history = this.getHistory()): CastMember | undefined {
    return getObjectState<CastMember>(this.castMemberId, history);
  }

  protected getCastMembers(history = this.getHistory()): CastMember[] {
    const castMembers = history
      .filter(({ type }) => type === "+")
      .map(({ object }) => {
        return getObjectState<CastMember>(object, history);
      })
      .filter((castMember) => castMember !== undefined) as CastMember[];
    return castMembers;
  }

  protected applyChanges(
    changes: HistoryEntry<CastMember>[]
  ): CastMember | undefined {
    let castMember = this.getCastMember();
    for (const change of changes) {
      if (change.type === "+") {
        castMember = applyHistoryEntry(change, castMember);
      } else if (change.type === "-") {
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
    return castMember;
  }

  protected pushChanges(
    newChanges: HistoryEntry<CastMember>[]
  ): CastMember | undefined {
    const { pushStateHistory } = getHistoryHandle("CastMember");
    pushStateHistory(newChanges);
    return this.applyChanges(newChanges);
  }

  protected removeChanges(): CastMember | undefined {
    const { popStateHistory } = getHistoryHandle("CastMember");
    this.changes.forEach((id) => popStateHistory(id));
    this.changes = [];
    return this.getCastMember();
  }

  protected replaceChanges(
    newChanges: HistoryEntry<CastMember>[]
  ): CastMember | undefined {
    const { popStateHistory } = getHistoryHandle("CastMember");
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

function addToHistory(event: IChangeEvent): void {
  event.id = `${Date.now()}-${Math.random()}`;
  changeEventHistory.push(event);
}

function removeFromHistory(event: IChangeEvent): void {
  changeEventHistory.splice(
    changeEventHistory.findIndex(({ id }) => id === event.id),
    1
  );
}

export function serializeHistory(): string {
  return JSON.stringify(changeEventHistory);
}

export function deserializeHistory(json: string): void {
  changeEventHistory.length = 0;
  const items: IChangeEvent[] = JSON.parse(json);
  items.forEach((item) => {
    const constructor = typeMap[item.type];
    if (!constructor) {
      throw new Error(`No constructor for type ${item.type}`);
    }
    const event = new constructor(item);
    event.changes = item.changes;
    changeEventHistory.push(event);
  });
  changeEventHistory.push(...(JSON.parse(json) as IChangeEvent[]));
}
