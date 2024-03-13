import { CastMember } from "creature";
import { Dispatch } from "react";
import {
  ChangeHistoryEntry,
  IChangeEvent,
  changeEventToString,
  instantiateEvents,
} from "state-change";
import { Action, State } from "../types";
import { fullHistoryReducer } from "./fullHistory";
import { registerReducer } from "./registerReducer";

interface ChangeHistoryAction extends Action {
  type: "changeHistory";
  changeType: "=" | "+" | "-" | "c";
  events: IChangeEvent[];
  changes: ChangeHistoryEntry<CastMember>[];
}

function addHistoryReducer(state: State, action: ChangeHistoryAction): State {
  const newEvents = [...state.events];
  const classes = instantiateEvents(action.events, state);
  classes.forEach((event) => {
    if (!newEvents.includes(event)) {
      // Protect against ChangeEvents instantiated from prior state that auto-add themselves to history
      newEvents.push(event);
    }
  });
  return {
    ...state,
    events: newEvents,
    changes: [...state.changes, ...action.changes],
  };
}

function removeHistoryReducer(
  state: State,
  action: ChangeHistoryAction
): State {
  let newEvents = [...state.events];
  let newChanges = state.changes.filter(
    (change) =>
      !action.changes.find((removedChange) => removedChange.id === change.id)
  );
  const removals = action.events.map((event) => {
    const removal = state.events.find((ev) => ev.id === event.id);
    if (!removal) {
      throw new Error(
        `Couldn't find ChangeEvent ${changeEventToString(event)} to remove`
      );
    }
    return removal;
  });
  removals.forEach((event) => {
    try {
      ({ events: newEvents, changes: newChanges } = event.undo(state));
    } catch (e) {
      console.error(`Failed to undo ${changeEventToString(event)}`, e);
    }
  });
  return { ...state, events: newEvents, changes: newChanges };
}

function changeHistoryReducer(
  state: State,
  action: ChangeHistoryAction
): State {
  console.log("changeHistoryReducer", action);

  const { changeType: type } = action;
  if (type === "=") {
    return fullHistoryReducer(state, { ...action, type: "fullHistory" });
  } else if (type === "+") {
    return addHistoryReducer(state, action);
  } else if (type === "-") {
    return removeHistoryReducer(state, action);
  }

  const { events: changedEvents, changes } = action;
  const updatedHistory = {
    events: [...state.events],
    changes: [...state.changes],
  };
  instantiateEvents(changedEvents, state).forEach((newEvent) => {
    const { id, changes: newChangeIds } = newEvent;
    const cachedEventIndex = state.events.findIndex((event) => event.id === id);
    if (cachedEventIndex === -1) {
      throw new Error(
        `Couldn't find ChangeEvent ${changeEventToString(newEvent)} to change`
      );
    }
    const cachedEvent = state.events[cachedEventIndex];
    updatedHistory.events.splice(cachedEventIndex, 1, newEvent);

    const oldChanges = cachedEvent.getChanges(state);
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
    updatedHistory.changes.splice(
      updatedHistory.changes.indexOf(oldChanges[0]),
      oldChanges.length,
      ...newChanges
    );
  });
  return { ...state, ...updatedHistory };
}

registerReducer<ChangeHistoryAction>("changeHistory", changeHistoryReducer);

export function changeHistory(
  dispatch: Dispatch<Action>,
  changeType: "=" | "+" | "-" | "c",
  events: IChangeEvent[],
  changes: ChangeHistoryEntry<CastMember>[]
): void {
  dispatch({
    type: "changeHistory",
    changeType,
    events,
    changes,
  } as ChangeHistoryAction);
}
