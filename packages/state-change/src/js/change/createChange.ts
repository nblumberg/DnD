import { Unique, getUniqueId } from "../util/unique";
import { StateAdd, StateChange, StateRemove } from "./types";

export function createStateAdd<T extends Unique>(
  object: T,
  action: string
): StateAdd<T> {
  return {
    id: getUniqueId(),
    type: "+",
    action,
    object: object.id,
    newValue: object,
  };
}

export function createStateRemove<T extends Unique>(
  object: T,
  action: string
): StateRemove<T> {
  return {
    id: getUniqueId(),
    type: "-",
    action,
    object: object.id,
    oldValue: object,
  };
}

export function createStateChange<T extends Unique, P extends keyof T>(
  object: T,
  action: string,
  property: P,
  oldValue?: T[P],
  newValue?: T[P],
  type: "c" | "c+" | "c-" = "c"
): StateChange<T, P> {
  return {
    id: getUniqueId(),
    type,
    action,
    object: object.id,
    property,
    oldValue,
    newValue,
  };
}
