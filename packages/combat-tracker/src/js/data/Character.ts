import { Actor } from "creature";

export class Character extends Actor {
  constructor(name: string) {
    super({ name, unique: true });
  }
}
