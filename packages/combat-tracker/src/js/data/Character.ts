import { ActorInstance } from "./actors";

export class Character extends ActorInstance {
  constructor(name: string) {
    super(name, true);
  }
}
