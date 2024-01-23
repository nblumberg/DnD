export interface Actor {
  name: string;
  id: string;
  unique: boolean;
}

export type ActorParams = Partial<Actor> & { name: string };

export function actorParamsToActor(params: ActorParams): Actor {
  return {
    ...params,
    id: params.id ?? toId(params.name),
    unique: params.unique ?? false,
  };
}

export function toId(str: string): string {
  return str.replace(/\W/g, "_");
}
