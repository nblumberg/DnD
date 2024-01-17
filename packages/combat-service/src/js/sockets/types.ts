import { Auditioner, CastMemberRaw, Condition } from "creature";

export interface ServerToClientEvents {
  castMembers: (castMembers: CastMemberRaw[]) => void;
}

export interface ClientToServerEvents {
  castActor: (auditioner: Auditioner) => void;
  castActors: (auditioners: Auditioner[]) => void;
  fireActor: (id: string) => void;
  fireActors: (ids: string[]) => void;
  addCondition: (id: string, condition: Condition) => void;
  removeCondition: (id: string, condition: Condition) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {}
