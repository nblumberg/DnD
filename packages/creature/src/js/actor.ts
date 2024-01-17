import { ClassMembers, Serializable } from "serializable";

export type ActorParams = Partial<Actor> & { name: string };

export class Actor
  extends Serializable<ActorRaw>
  implements ActorParams, ActorRaw
{
  name: string;
  id: string;
  unique: boolean;

  constructor(params: ActorParams) {
    super();
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
