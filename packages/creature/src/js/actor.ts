type ActorParams = Partial<Actor> & { name: string };

export class Actor {
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

export function toId(str: string): string {
  return str.replace(/\W/g, "_");
}
