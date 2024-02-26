import { Dispatch } from "react";
import { Action, Profile, State } from "../types";
import { registerReducer } from "./registerReducer";

interface LoginUserAction extends Action {
  type: "loginUser";
  user?: Profile;
}

function loginUserReducer(state: State, action: LoginUserAction): State {
  if (!action.user) {
    throw new Error("No user provided");
  }
  return { ...state, user: action.user };
}

registerReducer<LoginUserAction>("loginUser", loginUserReducer);

export function loginUser(dispatch: Dispatch<Action>, user: Profile): void {
  dispatch({ type: "loginUser", user } as LoginUserAction);
}
