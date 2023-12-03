import { Request, Response } from 'express';
import { errorResponse } from './error';
import { readState, storeState } from './storage';
import { addStateListener, addStatePropertyListener, defaultState, setState, state, State } from '../shared/state';
import { registerWebSocketHandler } from './serverSockets';
import { sendToAllUsers } from './user';

function loadStateFromDisk() {
  setState(readState());
  console.log(`Initialized server state\n${JSON.stringify(state, null, '  ')}`);
}
loadStateFromDisk();

// Write changes to disk
addStateListener(storeState);
addStateListener((state) => {
  sendToAllUsers({ type: 'state', state });
});

Object.keys(defaultState).forEach(key => {
  const property: keyof State = key as keyof State;
  addStatePropertyListener(property, (value) => {
    console.log(`State ${property} changed to ${value}`);
  });
});

function updateState(newState: State) {
  setState(newState);
  storeState(newState);
}

registerWebSocketHandler('state', (message) => {
  const { user } = message;
  if (user !== 'DM') {
    return;
  }
  const { state } = message as unknown as { state: State };
  updateState(state);
});

export function getState(): State {
  return { ...state };
}

export function addTravelTime(): void {
  let { hours, minutes, travelTime } = state;
  minutes += travelTime;
  hours += Math.floor(minutes / 60);
  minutes = minutes % 60;
  updateState({
    ...state,
    hours,
    minutes,
  });
}

// Used by state.html
export function getStateEndpoint(_req: Request, res: Response) {
  res.send(JSON.stringify(state));
}

export function setStateEndpoint(req: Request, res: Response) {
  if (!req.body) {
    return errorResponse(res, 400, 'No POST body');
  }
  try {
    updateState(req.body);
  } catch (e) {
    errorResponse(res, 400, (e as Error).message);
  }
}
