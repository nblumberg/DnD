import { Actor } from "./actor";

export interface Auditioner extends Actor {
  nickname?: string;
  actor: Actor;
  character: boolean;
}
