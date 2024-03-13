import { CastMember } from "creature";
import { Dispatch } from "react";
import {
  ChangeHistoryEntry,
  IChangeEvent,
  instantiateEvents,
} from "state-change";
import { Action, State } from "../types";
import { registerReducer } from "./registerReducer";

interface FullHistoryAction extends Action {
  type: "fullHistory";
  events: IChangeEvent[];
  changes: ChangeHistoryEntry<CastMember>[];
}

export function fullHistoryReducer(
  state: State,
  action: FullHistoryAction
): State {
  return {
    ...state,
    events: instantiateEvents(action.events, state),
    changes: action.changes,
  };
}
registerReducer<FullHistoryAction>("fullHistory", fullHistoryReducer);

export function fullHistoryAction(
  dispatch: Dispatch<Action>,
  events: IChangeEvent[],
  changes: ChangeHistoryEntry<CastMember>[]
): void {
  dispatch({ type: "fullHistory", events, changes } as FullHistoryAction);
}
