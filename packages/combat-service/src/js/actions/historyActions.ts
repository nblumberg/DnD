import { CastMember } from "creature";
import { ChangeHistoryEntry, History, cloneHistory } from "state-change";
import { historyChange, state, updateState } from "../state";

const listeners: Array<(undoneHistory: History) => void> = [];

export function listenToUndoneHistory(
  listener: (undoneHistory: History) => void
) {
  listeners.push(listener);
}

function dispatchUndoneHistory() {
  const undoneHistory: History = { events: [], changes: [] };
  state.undoArray.forEach(({ event, changes }) => {
    undoneHistory.events.push(event);
    undoneHistory.changes.push(...changes);
  });
  listeners.forEach((listener) => listener(undoneHistory));
}

export function clearUndoneHistory() {
  updateState({ undoArray: [] });
  dispatchUndoneHistory();
}

export function undoHistory() {
  if (!state.events.length) {
    console.error("No history to undo");
    return;
  }
  const event = state.events[state.events.length - 1];
  console.log(
    `DM undoHistory ${event.type}#${event.id}[${event.castMemberId}]`
  );
  const history = cloneHistory(state);
  // Set undoArray before calling undo, so that the event still has references to its changes
  updateState({
    undoArray: [
      ...state.undoArray,
      { event, changes: event.getChanges(history) },
    ],
  });
  historyChange(event.undo(history));
  dispatchUndoneHistory();
}

export function redoHistory() {
  if (!state.undoArray.length) {
    console.error("No history to redo");
    return;
  }
  const { event, changes } = state.undoArray[state.undoArray.length - 1]!;

  if (findEvent(event.id)) {
    console.error(
      `Change event ${event.type}#${event.id}[${event.castMemberId}] is already in history`
    );
    return;
  }
  const preExistingChanges = changes
    .map(({ id }) => findChange(id))
    .filter((change) => !!change) as ChangeHistoryEntry<CastMember>[];
  if (preExistingChanges.length) {
    console.error(
      `Changes ${preExistingChanges
        .map(({ id }) => id)
        .join(",")} already exist`
    );
    return;
  }
  // ChangeEvent.undo() clears the changes member, so put them back
  event.changes = changes.map(({ id }) => id);

  // Put the changes back in the history
  historyChange({
    events: [...state.events, event],
    changes: [...state.changes, ...changes],
  });
  updateState({
    undoArray: state.undoArray.slice(0, -1),
  });
  dispatchUndoneHistory();
}

export function changeHistory(id: string, ...params: any[]) {
  console.log(`DM changeHistory ${id} ${params}`);
  const change = findEvent(id);
  if (!change) {
    console.error(`Couldn't find change ${id}`);
    return;
  }
  const { events, changes } = change.change(state, ...params);
  historyChange({ events, changes });
}

function findEvent(id: string) {
  return state.events.find((entry) => entry.id === id);
}

function findChange(id: string) {
  return state.changes.find((entry) => entry.id === id);
}
