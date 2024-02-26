import { Actor } from "creature";

export class ActorInstance implements Actor {
  static sort(a: Actor, b: Actor): number {
    if (a.unique && !b.unique) {
      return -1;
    } else if (!a.unique && b.unique) {
      return 1;
    } else if (a.name === b.name) {
      return 0;
    } else if (a.name < b.name) {
      return -1;
    }
    return 1;
  }

  name: string;
  id: string;
  unique: boolean;

  constructor(name: string, unique = false) {
    this.name = name;
    this.id = name.replaceAll(/\W/g, "_");
    this.unique = unique;
  }
}
