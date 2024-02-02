import { Auditioner, CastMember, Condition } from "creature";
import { RollHistory } from "roll";
import { HistoryEntry, IChangeEvent } from "state-change";

export interface ServerToClientEvents {
  castMembers: (castMembers: CastMember[]) => void;
  fullHistory: (
    id: string,
    history: IChangeEvent[],
    changes: HistoryEntry<CastMember>[]
  ) => void;
  changeHistory: (
    id: string,
    type: "=" | "+" | "-" | "c",
    history: IChangeEvent[],
    changes: HistoryEntry<CastMember>[]
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
  changeHistory: (id: string, ...params: any[]) => void;
  resetGame: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {}
