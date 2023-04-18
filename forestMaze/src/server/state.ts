import { Request, Response } from 'express';
import { existsSync, readFileSync, renameSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { errorResponse } from './error';
import { fileRelativeToRoot } from './root';
import { State } from '../dtos/state';
import { DM } from './user';

const defaultState: State = {
  directions: ['up', 'right', 'down', 'left'], // names of the directions
  encounter: 13, // random Encounter on a roll of 13+
  location: '', // current Location
  path: './hither',
  seed: '', // random number generator seed
  tides: false, // whether tide Encounters are shown every time (true), or simply the first for each Encounter
  transition: 2000, // milliseconds in image fades
  travelTime: 30, // minutes between Locations
};

const stateFile = fileRelativeToRoot('state.json');

function loadState() {
  if (!existsSync(stateFile)) {
    return { ...defaultState };
  }
  try {
    return JSON.parse(readFileSync(stateFile, { encoding: 'utf8' }));
  } catch (e) {
    console.error(`Failed to parse ${stateFile}`, e);
    renameSync(stateFile, join(dirname(stateFile), 'state-error.json'));
    return { ...defaultState };
  }
}

const state: State = loadState();

function isSupportedState(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(defaultState, key);
}

function parseStateValue(key: keyof State, value?: any): undefined | boolean | number | string | string[] {
  if (typeof value === 'undefined') {
    return;
  }
  if (Array.isArray(defaultState[key])) {
    if (typeof value === 'string') {
      const parts = value.split(',').map(entry => entry.trim());
      const expectedLength = (defaultState[key] as string[]).length;
      if (parts.length !== expectedLength) {
        throw new Error(`Invalid value for ${key}, expected ${expectedLength} Array`);
      }
      value = parts;
    }
    if (!Array.isArray(value)) {
      throw new Error(`Invalid value for ${key}, expected Array`)
    }
    return value;
  }
  switch (typeof defaultState[key]) {
    case 'boolean':
      return value === 'true';
    case 'number':
      const stateValue = parseInt(value.toString(), 10);
      if (!Number.isNaN(stateValue)) {
        return stateValue;
      }
      break;
    case 'string':
    default:
      return value.toString();
      break;
  }
}

function internalSetState(data: object, parseStrings: boolean) {
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'undefined') {
      // Ignore undefined values
      return;
    }
    if (!isSupportedState(key)) {
      // Ignore unsupported keys
      return;
    }
    const supportedKey = key as keyof State;
    let stateValue = parseStrings ? parseStateValue(supportedKey, value) : value;
    const expectedType = typeof defaultState[supportedKey];
    if (expectedType !== typeof stateValue) {
      throw new Error(`Invalid value for ${supportedKey}, expected ${expectedType}, received ${stateValue}`);
    }
    if (typeof stateValue !== 'undefined') {
      (state as any)[supportedKey] = stateValue;
    }
  });
  writeFileSync(stateFile, JSON.stringify(state, null, '  '), { encoding: 'utf8' });
}

export function parsePageQuery(query: Request['query']) {
  return;
  // if (!query || query.name !== DM) {
  //   // Only let the DM set the state
  //   return;
  // }
  // internalSetState(query, true);
}

export function getState(req: Request, res: Response) {
  res.send(JSON.stringify(state));
}

export function setState(req: Request, res: Response) {
  if (!req.body) {
    return errorResponse(res, 400, 'No POST body');
  }
  try {
    internalSetState(req.body, false);
  } catch (e) {
    errorResponse(res, 400, (e as Error).message);
  }
}
