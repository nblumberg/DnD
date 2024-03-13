import { Auditioner, CastMember, Condition } from "creature";
import { RollHistory } from "roll";
import { ChangeHistoryEntry, IChangeEvent } from "state-change";

export interface ServerToClientEvents {
  castMembers: (castMembers: CastMember[]) => void;
  fullHistory: (
    id: string,
    events: IChangeEvent[],
    changes: ChangeHistoryEntry<CastMember>[]
  ) => void;
  changeHistory: (
    id: string,
    type: "=" | "+" | "-" | "c",
    events: IChangeEvent[],
    changes: ChangeHistoryEntry<CastMember>[]
  ) => void;
  fullUndoneHistory: (
    id: string,
    events: IChangeEvent[],
    changes: ChangeHistoryEntry<CastMember>[]
  ) => void;
  turn: (id: string, castMemberId: string) => void;
}

export interface ClientToServerEvents {
  castActor: (auditioner: Auditioner) => void;
  castActors: (auditioners: Auditioner[]) => void;
  fireActor: (id: string) => void;
  fireActors: (ids: string[]) => void;
  rollInitiative: (initiative?: Record<string, RollHistory>) => void;
  turn: (id: string) => void;
  addCondition: (id: string, condition: Condition) => void;
  removeCondition: (id: string, condition: string) => void;
  undoHistory: () => void;
  redoHistory: () => void;
  changeHistory: (id: string, ...params: any[]) => void;
  resetGame: () => void;
  attack: (attack: {
    id: string;
    attack: string;
    toHit: RollHistory;
    damage: RollHistory[];
    targets: string[];
    targetSaves?: RollHistory[];
  }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {}
