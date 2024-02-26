import { ActorInstance } from "./Actor";

export class Character extends ActorInstance {
  constructor(name: string) {
    super(name, true);
  }
}
