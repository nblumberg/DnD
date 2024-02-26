import { Dispatch } from "react";
import { Action, Credentials, State } from "../types";
import { registerReducer } from "./registerReducer";

interface LoginCredentialsAction extends Action {
  type: "loginCredentials";
  credentials?: Credentials;
}

function loginCrendentialsReducer(
  state: State,
  action: LoginCredentialsAction
): State {
  if (!action.credentials) {
    throw new Error("No credentials provided");
  }
  return { ...state, credentials: action.credentials };
}

registerReducer<LoginCredentialsAction>(
  "loginCredentials",
  loginCrendentialsReducer
);

export function loginCredentials(
  dispatch: Dispatch<Action>,
  credentials: Credentials
) {
  dispatch({ type: "loginCredentials", credentials } as LoginCredentialsAction);
}
