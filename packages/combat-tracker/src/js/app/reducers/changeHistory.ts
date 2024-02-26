import { CastMember } from "creature";
import { Dispatch } from "react";
import {
  HistoryEntry,
  IChangeEvent,
  changeEventToString,
  getHistoryHandle,
  instantiateHistory,
} from "state-change";
import { fullHistoryReducer } from ".";
import { Action, State } from "../types";
import { registerReducer } from "./registerReducer";

interface ChangeHistoryAction extends Action {
  type: "changeHistory";
  changeType: "=" | "+" | "-" | "c";
  history: IChangeEvent[];
  changes: HistoryEntry<CastMember>[];
}

function addHistoryReducer(state: State, action: ChangeHistoryAction): State {
  const newChanges = [...state.changes, ...action.changes];
  getHistoryHandle<CastMember>("CastMember").setHistory(newChanges);
  const newHistory = [...state.history];
  const classes = instantiateHistory(action.history);
  classes.forEach((event) => {
    if (!newHistory.includes(event)) {
      // Protect against ChangeEvents instantiated from prior state that auto-add themselves to history
      newHistory.push(event);
    }
  });
  return { ...state, history: newHistory, changes: newChanges };
}

/**
 * TODO: IChangeEvents self-remove
 */
function removeHistoryReducer(
  state: State,
  action: ChangeHistoryAction
): State {
  const newHistory = [...state.history];
  const newChanges = state.changes.filter(
    (change) =>
      !action.changes.find((removedChange) => removedChange.id === change.id)
  );
  const removals = action.history.map((event) => {
    const removal = state.history.find((ev) => ev.id === event.id);
    if (!removal) {
      throw new Error(
        `Couldn't find ChangeEvent ${changeEventToString(event)} to remove`
      );
    }
    return removal;
  });
  removals.forEach((event) => {
    try {
      event.undo();
    } catch (e) {
      console.error(`Failed to undo ${changeEventToString(event)}`, e);
    }
    newHistory.splice(newHistory.indexOf(event), 1);
  });
  getHistoryHandle<CastMember>("CastMember").setHistory(newChanges);
  return { ...state, history: newHistory, changes: newChanges };
}

function changeHistoryReducer(
  state: State,
  action: ChangeHistoryAction
): State {
  console.log("changeHistoryReducer", action);

  const { changeType: type, history, changes } = action;
  if (type === "=") {
    return fullHistoryReducer(state, { type: "fullHistory", history, changes });
  } else if (type === "+") {
    return addHistoryReducer(state, action);
  } else if (type === "-") {
    return removeHistoryReducer(state, action);
  }

  const updatedChanges = [...state.changes];
  const updatedHistory = [...state.history];
  history.forEach((newEvent) => {
    const { id, changes: newChangeIds } = newEvent;
    const cachedEventIndex = state.history.findIndex(
      (event) => event.id === id
    );
    if (cachedEventIndex === -1) {
      throw new Error(
        `Couldn't find ChangeEvent ${changeEventToString(newEvent)} to change`
      );
    }
    const cachedEvent = state.history[cachedEventIndex];
    updatedHistory.splice(cachedEventIndex, 1, newEvent);

    const oldChanges = cachedEvent.getChanges();
    const newChanges = newChangeIds.map((id) => {
      const newChange = changes.find((change) => change.id === id);
      if (!newChange) {
        throw new Error(
          `${changeEventToString(
            newEvent
          )} couldn't find HistoryEntry ${id} to change`
        );
      }
      return newChange;
    });
    updatedChanges.splice(
      updatedChanges.indexOf(oldChanges[0]),
      oldChanges.length,
      ...newChanges
    );
  });
  getHistoryHandle<CastMember>("CastMember").setHistory(updatedChanges);
  return { ...state, history: updatedHistory, changes: updatedChanges };
}

registerReducer<ChangeHistoryAction>("changeHistory", changeHistoryReducer);

export function changeHistory(
  dispatch: Dispatch<Action>,
  changeType: "=" | "+" | "-" | "c",
  history: IChangeEvent[],
  changes: HistoryEntry<CastMember>[]
): void {
  dispatch({
    type: "changeHistory",
    changeType,
    history,
    changes,
  } as ChangeHistoryAction);
}
