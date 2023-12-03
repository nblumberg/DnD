type ActorParams = Partial<Actor> & { name: string };

export class Actor {
  name: string;
  id: string;
  unique: boolean;

  constructor(params: ActorParams) {
    Object.assign(this, params);
    this.id = params.id ?? params.name.replace(/\W/g, "_");
  }
}
