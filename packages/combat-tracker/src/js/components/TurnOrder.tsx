import { useSelector } from "react-redux";
import { selectCastMembers } from "../features/castMember/castMembers";
import { CastMemberCard } from "./CastMemberCard";
import { EmptyState } from "./EmptyState";

export function TurnOrder() {
  const castMembers = useSelector(selectCastMembers);
  const initiativeOrder = Object.values(castMembers).sort(
    (a, b) => b.initiativeOrder - a.initiativeOrder
  );
  const cards = initiativeOrder.map((castMember) => (
    <CastMemberCard key={castMember.id} castMember={castMember} />
  ));
  return !initiativeOrder.length ? (
    <EmptyState></EmptyState>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        flexWrap: "wrap",
      }}
    >
      {cards}
    </div>
  );
}
