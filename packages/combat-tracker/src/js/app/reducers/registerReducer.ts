import { Action, State } from "../types";

interface Reducer<A extends Action = Action> {
  (state: State, action: A): State;
}

const reducers: Reducer[] = [];
const reducerTypes = new Set<string>();

export function registerReducer<A extends Action>(
  type: A["type"],
  reducer: Reducer<A>
): void {
  if (reducerTypes.has(type)) {
    throw new Error(`Reducer type ${type} already registered`);
  }
  reducerTypes.add(type);
  reducers.push((state, action) => {
    if (action.type !== type) {
      return state;
    }
    return reducer(state, action as A);
  });
}

export function handleAction(startingState: State, action: Action): State {
  return reducers.reduce(
    (currentState, handler) => handler(currentState, action),
    startingState
  );
}
