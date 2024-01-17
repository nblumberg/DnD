import { CastMember } from "creature";
import styled from "styled-components";

const Container = styled.div`
  height: 2em;
  position: relative;
  width: 100%;
`;
const ColorBar = styled.div<{ $color: string; $width: number }>`
  background-color: ${({ $color }) => $color};
  height: 2em;
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ $width }) => $width}%;
`;
const HitPointText = styled.div`
  color: white;
  font-size: 1em;
  height: 2em;
  line-height: 2em;
  padding-right: 0.5em;
  position: absolute;
  text-align: right;
  top: 0;
  right: 0;
`;

export function HitPointBar({
  castMember: { hp, hpCurrent, hpTemp = 0 },
}: {
  castMember: CastMember;
}) {
  return (
    <Container>
      <ColorBar $color="darkred" $width={(hp / (hpTemp + hp)) * 100}>
        <ColorBar $color="red" $width={(hpCurrent / hp) * 100}>
          <HitPointText>{hpCurrent}</HitPointText>
        </ColorBar>
        <HitPointText>{hp}</HitPointText>
      </ColorBar>
      {hpTemp > 0 && (
        <ColorBar $color="green" $width={(hpTemp / (hpTemp + hp)) * 100}>
          <HitPointText>{hpTemp}</HitPointText>
        </ColorBar>
      )}
    </Container>
  );
}
