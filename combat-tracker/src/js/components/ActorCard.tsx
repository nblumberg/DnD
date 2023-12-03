import { Actor } from "../data/Actor";

export function ActorCard({ actor } : { actor: Actor }) {
  return (<div>
    {actor.name}
  </div>);
}
