import { Dispatch } from "react";
import { Action, State } from "../types";
import { registerReducer } from "./registerReducer";

interface LogoutAction extends Action {
  type: "logout";
}

function logoutReducer(state: State, action: Action | LogoutAction): State {
  if (action.type !== "logout") {
    return state;
  }
  return { ...state, credentials: undefined, user: undefined };
}

registerReducer<LogoutAction>("logout", logoutReducer);

export function logout(dispatch: Dispatch<Action>): void {
  dispatch({ type: "logout" } as LogoutAction);
}
