import { CastMember } from "creature";
import {
  HistoryEntry,
  StateAdd,
  applyHistoryEntry,
  getHistoryHandle,
  getObjectState,
  undoHistoryEntry,
} from "../atomic/stateChange";
import { Unique, getUniqueId, preExistingUniqueId } from "../util/unique";

const changeEvent = {
  history: [] as IChangeEvent[],
};

const typeMap: { [key: string]: { new (...args: any[]): ChangeEvent } } = {};

export function registerType(
  type: string,
  constructor: { new (...args: any[]): ChangeEvent }
): void {
  typeMap[type] = constructor;
}

export type CastMembers = Record<string, CastMember>;

export interface IChangeEvent extends Unique {
  type: string;
  castMemberId: string;
  changes: string[];

  apply(): CastMembers;
  change(...args: any[]): CastMembers;
  display(html?: boolean): string;
  undo(): CastMembers;
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
      throw new Error("ChangeEvent castMemberId is required");
    }
    this.castMemberId = castMemberId;
    this.id = id ?? getUniqueId();
    this.changes = changes ?? [];
  }

  abstract change(...args: any[]): CastMembers;

  abstract display(html?: boolean): string;

  protected abstract makeChanges(): HistoryEntry<CastMember>[];

  apply() {
    const changes = this.makeChanges();
    const castMembers = this.pushChanges(changes)!;
    addToHistory(this);
    return castMembers;
  }

  undo() {
    const castMember = this.removeChanges()!;
    removeFromHistory(this);
    return castMember;
  }

  getChanges(): HistoryEntry<CastMember>[] {
    const history = getHistoryHandle<CastMember>("CastMember").getHistory();
    return this.changes.map((id) => {
      const change = history.find(({ id: changeId }) => changeId === id);
      if (!change) {
        throw new Error(`Couldn't find change ${id}`);
      }
      return change;
    });
  }

  protected executeChanges(changes = this.makeChanges()): CastMembers {
    const castMembers = this.replaceChanges(changes);
    this.changes = changes.map(({ id }) => id);
    return castMembers;
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

  protected getHistoryAfter(): HistoryEntry<CastMember>[] {
    const history = getHistoryHandle<CastMember>("CastMember").getHistory();
    if (!this.changes.length) {
      throw new Error("Couldn't find last change in history");
    }
    const lastChange = this.changes[this.changes.length - 1];
    const index = history.findIndex(({ id }) => id === lastChange);
    if (index === -1) {
      throw new Error("Couldn't find first change in history");
    }
    return history.slice(0, index + 1); // include the last of my changes
  }

  protected getCastMember(): CastMember {
    const history = this.getHistoryBefore();
    const castMember = getCastMember(this.castMemberId, history);
    if (!castMember) {
      throw new Error(`CastMember ${this.castMemberId} not found`);
    }
    return castMember;
  }

  protected applyChanges(changes: HistoryEntry<CastMember>[]): CastMembers {
    const castMembers: CastMembers = {};
    for (const change of changes) {
      if (change.type === "+") {
        const castMember = applyHistoryEntry<CastMember, StateAdd<CastMember>>(
          change
        );
        castMembers[castMember.id] = castMember;
      } else {
        let castMember =
          castMembers[change.object] ??
          getCastMember(change.object, this.getHistoryBefore());
        if (change.type === "-") {
          delete castMembers[change.object];
        } else {
          if (!castMember) {
            throw new Error(
              `Can't apply change ${change.id} to missing castMember`
            );
          }
          castMember = applyHistoryEntry(change, castMember);
          castMembers[castMember.id] = castMember;
        }
      }
    }
    return castMembers;
  }

  protected pushChanges(newChanges: HistoryEntry<CastMember>[]): CastMembers {
    const { pushStateHistory } = getHistoryHandle<CastMember>("CastMember");
    this.changes = pushStateHistory(newChanges).map(({ id }) => id);
    return this.applyChanges(newChanges);
  }

  protected removeChanges(): CastMembers {
    const { popStateHistory } = getHistoryHandle<CastMember>("CastMember");
    const castMembers: CastMembers = {};
    const relativeHistory = this.getHistoryAfter();
    this.getChanges().forEach((entry) => {
      let castMember = getCastMember(
        entry.object,
        relativeHistory,
        false,
        true
      );
      // TODO: why doesn't the overloading allow this?
      // @ts-expect-error
      castMember = undoHistoryEntry(entry, castMember) as
        | CastMember
        | undefined;
      if (!castMember) {
        delete castMembers[entry.object];
      } else {
        castMembers[castMember.id] = castMember;
      }
      popStateHistory(entry.id);
    });
    this.changes = [];
    return castMembers;
  }

  protected replaceChanges(
    newChanges: HistoryEntry<CastMember>[]
  ): CastMembers {
    const castMembers: CastMembers = {};
    const affectedCastMembers = new Set<string>();
    const { popStateHistory } = getHistoryHandle<CastMember>("CastMember");
    const oldChanges = this.getChanges();
    this.changes = newChanges.map(({ id, object }) => {
      affectedCastMembers.add(object);
      return id;
    });
    for (let i = 0; i < oldChanges.length; i++) {
      affectedCastMembers.add(oldChanges[i].object);
      if (i !== oldChanges.length - 1) {
        popStateHistory(oldChanges[i]);
        continue;
      }
      popStateHistory(oldChanges[i], newChanges);
    }
    const relativeHistory = this.getHistoryAfter();
    affectedCastMembers.forEach((id) => {
      const castMember = getCastMember(id, relativeHistory);
      if (castMember) {
        castMembers[castMember.id] = castMember;
      }
    });
    listeners.forEach((listener) =>
      listener({ type: "c", history: [this], changes: this.getChanges() })
    );
    return castMembers;
  }
}

export function addToHistory(event: IChangeEvent): void {
  // event.id = `${Date.now()}-${Math.random()}`;
  changeEvent.history.push(event);
  listeners.forEach((listener) =>
    listener({ type: "+", history: [event], changes: event.getChanges() })
  );
}

function removeFromHistory(event: IChangeEvent): void {
  listeners.forEach((listener) =>
    listener({ type: "-", history: [event], changes: event.getChanges() })
  );
  changeEvent.history.splice(
    changeEvent.history.findIndex(({ id }) => id === event.id),
    1
  );
}

export function getHistory(): IChangeEvent[] {
  return [...changeEvent.history];
}

interface HistoryListenerEvent {
  type: "=" | "+" | "-" | "c";
  history: IChangeEvent[];
  changes: HistoryEntry<CastMember>[];
}
interface HistoryListener {
  (event: HistoryListenerEvent): void;
}

const listeners: HistoryListener[] = [];

export function listenToHistory(callback: HistoryListener): void {
  listeners.push(callback);
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

export function instantiateHistory(history: IChangeEvent[]): ChangeEvent[] {
  return history.map((item) => {
    preExistingUniqueId(item.id);
    const constructor = typeMap[item.type];
    if (!constructor) {
      throw new Error(`No constructor for type ${item.type}`);
    }
    return new constructor(item);
  });
}

export function setHistory(history: IChangeEvent[]): ChangeEvent[] {
  const newHistory = instantiateHistory(history);
  const changes = newHistory.flatMap((event) => event.getChanges());
  history.splice(0, history.length, ...newHistory);
  changeEvent.history = history;
  listeners.forEach((listener) => listener({ type: "=", history, changes }));
  return history as ChangeEvent[];
}
