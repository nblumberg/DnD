import { CastMember } from "creature";
import {
  ChangeHistoryEntry,
  StateAdd,
  applyHistoryEntry,
  trackChanges,
  undoHistoryEntry,
  untrackChange,
} from "../change";
import { getUniqueId } from "../util/unique";
import { addEventToHistory } from "./addEventToHistory";
import { cloneHistory } from "./cloneHistory";
import { getCastMember, getCastMembers } from "./getCastMembers";
import { dispatchHistoryChange } from "./historyListeners";
import { removeEventFromHistory } from "./removeEventFromHistory";
import {
  CastMembers,
  ChangeEventParams,
  History,
  HistoryAndCastMembers,
  IChangeEvent,
} from "./types";

export abstract class ChangeEvent implements IChangeEvent {
  type: string;
  id: string;
  castMemberId: string;
  changes: string[] = [];

  constructor({
    type,
    castMemberId,
    id,
    changes,
  }: ChangeEventParams & { type: string }) {
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

  abstract change(history: History, ...args: any[]): HistoryAndCastMembers;

  abstract display(history: History, html?: boolean): string;

  protected abstract makeChanges(
    history: History
  ): ChangeHistoryEntry<CastMember>[];

  protected applyAndUpdate({
    history,
    historyChange,
  }: ChangeEventParams): void {
    if (this.changes.length) {
      return;
    }
    const newState = this.apply(history);
    if (historyChange) {
      historyChange(newState);
    }
  }

  apply(history: History): HistoryAndCastMembers {
    let newHistory = cloneHistory(history);
    const myChanges = this.makeChanges(newHistory);
    const { events, changes, castMembers } = this.pushChanges(
      newHistory,
      myChanges
    );
    newHistory = { events, changes };
    newHistory = addEventToHistory(newHistory, this);
    return { ...newHistory, castMembers };
  }

  undo(history: History): HistoryAndCastMembers {
    const myChanges = this.getChanges(history);
    const { events, changes, castMembers } = this.removeChanges(
      history,
      myChanges
    );
    let newHistory = { events, changes };
    newHistory = removeEventFromHistory(newHistory, this, myChanges);
    return { ...newHistory, castMembers };
  }

  getChanges(history: History): ChangeHistoryEntry<CastMember>[] {
    const { changes } = history;
    return this.changes.map((id) => {
      const change = changes.find(({ id: changeId }) => changeId === id);
      if (!change) {
        throw new Error(`${this.toString()} couldn't find change ${id}`);
      }
      return change;
    });
  }

  toString(): string {
    return changeEventToString(this);
  }

  protected executeChanges(
    history: History,
    myChanges = this.makeChanges(history)
  ): HistoryAndCastMembers {
    const { events, changes, castMembers } = this.replaceChanges(
      history,
      myChanges
    );
    this.changes = myChanges.map(({ id }) => id);
    return { events, changes, castMembers };
  }

  protected getChangesBefore(
    history: History
  ): ChangeHistoryEntry<CastMember>[] {
    if (!this.changes.length) {
      return history.changes;
    }
    const [firstChange] = this.changes;
    const index = history.changes.findIndex(({ id }) => id === firstChange);
    if (index === -1) {
      throw new Error(
        `${this.toString()} couldn't find first change in history`
      );
    }
    return history.changes.slice(0, index); // don't include any of my changes
  }

  protected getChangesIncludingMe(
    history: History
  ): ChangeHistoryEntry<CastMember>[] {
    if (!this.changes.length) {
      throw new Error(`${this.toString()} lacks changes to find in history`);
    }
    const lastChange = this.changes[this.changes.length - 1];
    const index = history.changes.findIndex(({ id }) => id === lastChange);
    if (index === -1) {
      throw new Error(
        `${this.toString()} couldn't find last change in history`
      );
    }
    return history.changes.slice(0, index + 1); // include the last of my changes
  }

  protected getCastMember(history: History): CastMember {
    const changes = this.getChangesBefore(history);
    const castMember = getCastMember(this.castMemberId, { changes });
    if (!castMember) {
      throw new Error(
        `${this.toString()} CastMember ${this.castMemberId} not found`
      );
    }
    return castMember;
  }

  protected applyChanges(
    history: History,
    changes: ChangeHistoryEntry<CastMember>[]
  ): CastMembers {
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
          getCastMember(change.object, {
            changes: this.getChangesBefore(history),
          });
        if (change.type === "-") {
          delete castMembers[change.object];
        } else {
          if (!castMember) {
            throw new Error(
              `${this.toString()} can't apply change ${
                change.id
              } to missing CastMember`
            );
          }
          castMember = applyHistoryEntry(change, castMember);
          castMembers[castMember.id] = castMember;
        }
      }
    }
    return castMembers;
  }

  protected pushChanges(
    history: History,
    myChanges: ChangeHistoryEntry<CastMember>[]
  ): HistoryAndCastMembers {
    const { changes, newlyTracked } = trackChanges(history, myChanges);
    const newHistory = { ...history, changes };
    this.changes = newlyTracked.map(({ id }) => id);
    return {
      ...newHistory,
      castMembers: this.applyChanges(newHistory, myChanges),
    };
  }

  protected removeChanges(
    history: History,
    changes = this.getChanges(history)
  ): HistoryAndCastMembers {
    let newHistory = cloneHistory(history);
    const castMembers: CastMembers = {};
    const relativeHistory = this.getChangesIncludingMe(history);
    changes.forEach((change) => {
      let castMember = getCastMember(
        change.object,
        { changes: relativeHistory },
        false,
        true
      );
      castMember = undoHistoryEntry(change, castMember);
      if (!castMember) {
        delete castMembers[change.object];
      } else {
        castMembers[castMember.id] = castMember;
      }
      newHistory = {
        ...newHistory,
        ...untrackChange(newHistory, change.id),
      };
    });
    this.changes = [];
    return { ...newHistory, castMembers };
  }

  protected replaceChanges(
    history: History,
    newChanges: ChangeHistoryEntry<CastMember>[]
  ): HistoryAndCastMembers {
    let newHistory = cloneHistory(history);
    const castMembers: CastMembers = {};
    const affectedCastMembers = new Set<string>();
    const oldChanges = this.getChanges(newHistory);
    this.changes = newChanges.map(({ id, object }) => {
      affectedCastMembers.add(object);
      return id;
    });
    for (let i = 0; i < oldChanges.length; i++) {
      affectedCastMembers.add(oldChanges[i].object);
      if (i !== oldChanges.length - 1) {
        newHistory = {
          ...newHistory,
          ...untrackChange(newHistory, oldChanges[i]),
        };
        continue;
      }
      newHistory = {
        ...newHistory,
        ...untrackChange(newHistory, oldChanges[i], newChanges),
      };
    }
    const relativeHistory = this.getChangesIncludingMe(newHistory);
    affectedCastMembers.forEach((id) => {
      const castMember = getCastMember(id, { changes: relativeHistory });
      if (castMember) {
        castMembers[castMember.id] = castMember;
      }
    });
    dispatchHistoryChange({
      type: "c",
      events: [this],
      changes: this.getChanges(newHistory),
    });
    return { ...newHistory, castMembers };
  }
}

export function changeEventToString(event: IChangeEvent): string {
  return `${event.type}#${event.id}{${event.castMemberId}}[${event.changes.join(
    ","
  )}]`;
}

export function cantChange(
  message: string,
  history: History
): HistoryAndCastMembers {
  console.warn(message);
  const castMembers = getCastMembers(history).reduce(
    (acc, castMember) => ({ ...acc, [castMember.id]: castMember }),
    {}
  );
  return { ...history, castMembers };
}
