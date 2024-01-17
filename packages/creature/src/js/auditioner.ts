import { Actor, ActorRaw } from "./actor";

export interface Auditioner extends Actor {
  nickname?: string;
  actor: ActorRaw;
  character: boolean;
}
