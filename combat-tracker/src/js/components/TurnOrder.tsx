import { Actor } from "../data/Actor";
import { ActorCard } from "./ActorCard";

export function TurnOrder({ actors }: { actors: Actor[] }) {
  const cards = actors.map(actor => <ActorCard key={actor.id} actor={actor} />);
  return (<div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
    {cards}
  </div>);
}
