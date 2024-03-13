import { CastMember } from "creature";
import { Dispatch } from "react";
import {
  ChangeHistoryEntry,
  IChangeEvent,
  instantiateEvents,
} from "state-change";
import { Action, State } from "../types";
import { registerReducer } from "./registerReducer";

interface FullUndoneHistoryAction extends Action {
  type: "fullUndoneHistory";
  events: IChangeEvent[];
  changes: ChangeHistoryEntry<CastMember>[];
}

export function fullUndoneHistoryReducer(
  state: State,
  action: FullUndoneHistoryAction
): State {
  const events = instantiateEvents(action.events, {
    events: [...state.events],
    changes: [...state.changes],
  });
  return {
    ...state,
    undoneHistory: { events, changes: action.changes },
  };
}
registerReducer<FullUndoneHistoryAction>(
  "fullUndoneHistory",
  fullUndoneHistoryReducer
);

export function fullUndoneHistoryAction(
  dispatch: Dispatch<Action>,
  events: IChangeEvent[],
  changes: ChangeHistoryEntry<CastMember>[]
): void {
  dispatch({
    type: "fullUndoneHistory",
    events,
    changes,
  } as FullUndoneHistoryAction);
}
