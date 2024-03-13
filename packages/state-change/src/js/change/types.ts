import { Unique } from "../util/unique";

// Atomic change types
export interface StateAdd<T extends Unique> extends Unique {
  type: "+";
  action: string;
  object: T["id"];
  newValue?: T;
}

export interface StateRemove<T extends Unique> extends Unique {
  type: "-";
  action: string;
  object: T["id"];
  oldValue?: T;
}

export interface StateChange<T extends Unique, P extends keyof T>
  extends Unique {
  type: "c" | "c+" | "c-";
  action: string;
  object: T["id"];
  property: P;
  oldValue?: T[P] | Partial<T[P]>;
  newValue?: T[P] | Partial<T[P]>;
}

type StateAddParam<T extends Unique> = Omit<StateAdd<T>, "id">;
type StateRemoveParam<T extends Unique> = Omit<StateRemove<T>, "id">;
type StateChangeParam<T extends Unique> = Omit<StateChange<T, keyof T>, "id">;
export type HistoryEntryParam<T extends Unique> =
  | StateAddParam<T>
  | StateRemoveParam<T>
  | StateChangeParam<T>;

export type ChangeHistoryEntry<T extends Unique> =
  | StateAdd<T>
  | StateRemove<T>
  | StateChange<T, keyof T>;

// List of atomic changes
export interface ChangeHistory<T extends Unique> {
  changes: ChangeHistoryEntry<T>[];
}

// Methods that alter ChangeHistory
export interface ChangeState<T extends Unique> {
  (oldChangeHistory: ChangeHistory<T>, startingState: T, ...args: any[]): T;
}

export interface AddToState<T extends Unique> extends ChangeState<T> {
  (
    oldChangeHistory: ChangeHistory<T>,
    startingState: T
  ): ChangeHistory<T> & { newlyAdded: T };
}

export interface RemoveFromState<T extends Unique> extends ChangeState<T> {
  (
    oldChangeHistory: ChangeHistory<T>,
    startingState: T
  ): ChangeHistory<T> & { newlyRemoved: T };
}

export interface ApplyStateChange<T extends Unique, P extends keyof T> {
  (
    oldChangeHistory: ChangeHistory<T>,
    change: StateChange<T, P>,
    object: T
  ): ChangeHistory<T> & { newlyChanged: T };
}

export interface UndoStateChange<T extends Unique, P extends keyof T> {
  (
    oldChangeHistory: ChangeHistory<T>,
    change: StateChange<T, P>,
    object: T
  ): ChangeHistory<T> & { newlyChanged: T };
}
