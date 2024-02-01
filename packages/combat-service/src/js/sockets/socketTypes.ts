import { Auditioner, CastMember, Condition } from "creature";
import { RollHistory } from "roll";
import { HistoryEntry, IChangeEvent } from "state-change";

export interface ServerToClientEvents {
  castMembers: (castMembers: CastMember[]) => void;
  history: (
    history: IChangeEvent[],
    changes: HistoryEntry<CastMember>[]
  ) => void;
  turn: (id: string) => void;
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
  changeHistory: (id: string, ...params: any[]) => void;
  resetGame: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {}
