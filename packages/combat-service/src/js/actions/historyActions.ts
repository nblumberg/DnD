import { CastMember } from "creature";
import {
  ChangeEvent,
  HistoryEntry,
  addToHistory,
  getHistoryHandle,
  instantiateHistory,
} from "state-change";
import { state } from "../state";

interface UndoHistory {
  event: ChangeEvent;
  changes: HistoryEntry<CastMember>[];
}

const undoArray: UndoHistory[] = [];

export function clearUndoneHistory() {
  undoArray.length = 0;
}

export function undoHistory() {
  if (!state.history.length) {
    console.error("No history to undo");
    return;
  }
  const event = state.history[state.history.length - 1] as ChangeEvent;
  console.log(
    `DM undoHistory ${event.type}#${event.id}[${event.castMemberId}]`
  );
  undoArray.push({ event, changes: event.getChanges() });
  event.undo();
}

export function redoHistory() {
  if (!undoArray.length) {
    console.error("No history to redo");
    return;
  }
  const { event, changes } = undoArray.pop()!;

  if (findEvent(event.id)) {
    console.error(
      `Change event ${event.type}#${event.id}[${event.castMemberId}] is already in history`
    );
    return;
  }
  const preExistingChanges = changes
    .map(({ id }) => findChange(id))
    .filter((change) => !!change) as HistoryEntry<CastMember>[];
  if (preExistingChanges.length) {
    console.error(
      `Changes ${preExistingChanges
        .map(({ id }) => id)
        .join(",")} already exist`
    );
    return;
  }
  // Put the changes back in the history
  getHistoryHandle<CastMember>("CastMember").pushStateHistory(changes);
  // ChangeEvent.undo() clears the changes member, so put them back
  event.changes = changes.map(({ id }) => id);
  // Instantiate the ChangeEvent
  const [classEvent] = instantiateHistory([event]);
  if (!findEvent(event.id)) {
    // If the constructor doesn't self-add to history, do it manually
    addToHistory(classEvent);
  }
}

export function changeHistory(id: string, ...params: any[]) {
  console.log(`DM changeHistory ${id} ${params}`);
  const change = findEvent(id);
  if (!change) {
    console.error(`Couldn't find change ${id}`);
    return;
  }
  change.change(...params);
}

function findEvent(id: string) {
  return state.history.find((entry) => entry.id === id);
}

function findChange(id: string) {
  return state.changes.find((entry) => entry.id === id);
}
