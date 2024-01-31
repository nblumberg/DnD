import { useContext } from "react";
import styled from "styled-components";
import { CastMemberContext } from "../data/castMembers";
import { CastMemberCard } from "./CastMemberCard";
import { EmptyState } from "./EmptyState";
import { media } from "./breakpoints";

const TurnOrderGrid = styled.main`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  ${media.md`
    align-items: center;
    flex-direction: column;
    flex-wrap: nowrap;
  `}
`;

export function TurnOrder() {
  const castMembers = useContext(CastMemberContext);
  const initiativeOrder = Object.values(castMembers).sort(
    (a, b) => b.initiativeOrder - a.initiativeOrder
  );
  const cards = initiativeOrder.map((castMember) => (
    <CastMemberCard key={castMember.id} castMember={castMember} />
  ));
  return !initiativeOrder.length ? (
    <EmptyState data-turn-order></EmptyState>
  ) : (
    <TurnOrderGrid data-turn-order>{cards}</TurnOrderGrid>
  );
}
