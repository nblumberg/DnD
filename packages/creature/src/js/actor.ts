import { ClassMembers } from "packages/serializable/dist/js";

export type ActorParams = Partial<Actor> & { name: string };

export class Actor implements ActorParams, ActorRaw {
  name: string;
  id: string;
  unique: boolean;

  constructor(params: ActorParams) {
    Object.assign(this, params);
    this.name = params.name;
    this.unique = params.unique ?? false;
    this.id = params.id ?? toId(params.name);
  }
}

export type ActorRaw = ClassMembers<Actor>;

export function toId(str: string): string {
  return str.replace(/\W/g, "_");
}
