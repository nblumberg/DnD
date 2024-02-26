import { useContext } from "react";
import styled from "styled-components";
import { media } from "../app/constants";
import { CastMemberContext } from "../app/store/castMembers";
import { EmptyState } from "./EmptyState";
import { CastMemberCard } from "./castMemberCard/CastMemberCard";

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
