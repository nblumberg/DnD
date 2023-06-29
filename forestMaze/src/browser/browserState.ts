import { state, State, setState, removeStateListener, addStatePropertyListener, defaultState } from '../shared/state.js';
import { registerWebSocketHandler, send } from './browserSockets.js';
import { BrowserToServerUserlessSocketMessage, ServerToBrowserSocketMessage } from '../shared/socketTypes.js';

function updateState(message: ServerToBrowserSocketMessage): void {
  const { state: newState } = message as unknown as { state: State };
  setState(newState);
}
registerWebSocketHandler('state', updateState);

Object.keys(defaultState).forEach(key => {
  const property: keyof State = key as keyof State;
  addStatePropertyListener(property, (value) => {
    console.log(`State ${property} changed to ${value}`);
  });
});


export function changeState(partialState: Partial<State>): void {
  const completeState: BrowserToServerUserlessSocketMessage = { type: 'state', state: { ...state, ...partialState } };
  send(completeState);
}

export function setLocation(name: string): void {
  setState({
    location: name
  });
}

export function resetLocation(): Promise<void> {
  const initialLocation: string = ''; // TODO: get initial location
  return new Promise((resolve) => {
    function setLocationListener(newLocation: string): void {
      if (newLocation === initialLocation) {
        removeStateListener(setLocationListener, 'location');
        resolve();
      }
    }
    changeState({ location: initialLocation });
    addStatePropertyListener('location', setLocationListener);
  });
}

let history: History;

export function getHistory(): History {
  return history;
}

function updateHistory(message: ServerToBrowserSocketMessage): void {
  ({ history } = message as unknown as { history: History });
}

registerWebSocketHandler('history', updateHistory);
