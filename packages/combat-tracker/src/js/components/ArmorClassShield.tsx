import { CastMember } from "creature";
import styled from "styled-components";
import { useIsDM } from "../auth";

const Shield = styled.div`
  background-color: gray;
  border: 2px solid black;
  border-radius: 50% 50% 50% 50% / 12% 12% 88% 88%;
  color: white;
  font-size: 1em;
  height: 2em;
  line-height: 2em;
  position: absolute;
  right: 0.5em;
  text-align: center;
  top: 0.5em;
  width: 2em;
`;

export function ArmorClassShield({
  castMember: { character, ac },
}: {
  castMember: CastMember;
}) {
  const dm = useIsDM();
  const displayAC = dm || character ? ac : `>1`;
  return <Shield>{displayAC}</Shield>;
}
