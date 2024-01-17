import { ActorRaw } from "./actor";

export interface Auditioner extends ActorRaw {
  nickname?: string;
  actor: ActorRaw;
  character: boolean;
}
