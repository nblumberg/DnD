import { Dispatch } from "react";
import { View } from "../constants";
import { Action, State } from "../types";
import { registerReducer } from "./registerReducer";

interface ChangeViewAction extends Action {
  type: "changeView";
  view?: View;
}

function changeView(state: State, action: ChangeViewAction): State {
  if (action.view) {
    return { ...state, view: action.view };
  }
  return state;
}

registerReducer<ChangeViewAction>("changeView", changeView);

export function changeViewAction(dispatch: Dispatch<Action>, view: View): void {
  dispatch({ type: "changeView", view } as ChangeViewAction);
}
