import { CastMember } from "creature";
import { Dispatch } from "react";
import {
  HistoryEntry,
  IChangeEvent,
  getHistoryHandle,
  instantiateHistory,
} from "state-change";
import { Action, State } from "../types";
import { registerReducer } from "./registerReducer";

interface FullHistoryAction extends Action {
  type: "fullHistory";
  history: IChangeEvent[];
  changes: HistoryEntry<CastMember>[];
}

export function fullHistoryReducer(
  state: State,
  action: FullHistoryAction
): State {
  getHistoryHandle<CastMember>("CastMember").setHistory(action.changes);

  return {
    ...state,
    history: instantiateHistory(action.history),
    changes: action.changes,
  };
}
registerReducer<FullHistoryAction>("fullHistory", fullHistoryReducer);

export function fullHistoryAction(
  dispatch: Dispatch<Action>,
  history: IChangeEvent[],
  changes: HistoryEntry<CastMember>[]
): void {
  dispatch({ type: "fullHistory", history, changes } as FullHistoryAction);
}
