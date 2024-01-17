// import { useSelector } from "react-redux";
import styled from "styled-components";
// import { selectCastMembers } from "../features/castMember/castMembers";
import { useCastMembers } from "../data/castMembers";
import { CastMemberCard } from "./CastMemberCard";
import { EmptyState } from "./EmptyState";

const TurnOrderGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

export function TurnOrder() {
  const castMembers = useCastMembers();
  // const castMembers = useSelector(selectCastMembers);
  const initiativeOrder = Object.values(castMembers).sort(
    (a, b) => b.initiativeOrder - a.initiativeOrder
  );
  const cards = initiativeOrder.map((castMember) => (
    <CastMemberCard key={castMember.id} castMember={castMember} />
  ));
  return !initiativeOrder.length ? (
    <EmptyState></EmptyState>
  ) : (
    <TurnOrderGrid>{cards}</TurnOrderGrid>
  );
}
