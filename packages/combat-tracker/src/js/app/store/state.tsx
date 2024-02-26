import { Dispatch, createContext, useContext, useReducer } from "react";
import { handleAction } from "../reducers";
import { Action, State, defaultState } from "../types";

const StateContext = createContext<State>(defaultState);
const DispatchContext = createContext<React.Dispatch<Action>>(({ type }) => {
  throw new Error(`Dispatch not initialized for action type ${type}`);
});

export function StateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(handleAction, defaultState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useAppState(): [State, Dispatch<Action>] {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  return [state, dispatch];
}
