import { Dispatch } from "react";
import { Action, State } from "../types";
import { registerReducer } from "./registerReducer";

interface WindowResizeAction extends Action {
  type: "windowResize";
  isMobile: boolean;
}

function windowResizeReducer(state: State, action: WindowResizeAction): State {
  return { ...state, isMobile: action.isMobile };
}
registerReducer<WindowResizeAction>("windowResize", windowResizeReducer);

export function windowResize(
  dispatch: Dispatch<Action>,
  isMobile: boolean
): void {
  dispatch({ type: "windowResize", isMobile } as WindowResizeAction);
}
