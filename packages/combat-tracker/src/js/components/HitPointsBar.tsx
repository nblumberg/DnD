import { CastMember } from "creature";
import styled from "styled-components";
import { isDM } from "../auth";

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
  castMember: { character, hp, hpCurrent, hpTemp = 0 },
}: {
  castMember: CastMember;
}) {
  const dm = isDM();

  const showFull = dm || character;
  const currentHp = showFull ? hpCurrent : `>${hp - hpCurrent}`;
  const totalHp = showFull ? hp : `>${hp - hpCurrent + 1}`;
  const tempHp = showFull ? hpTemp : `>1`;

  return (
    <Container>
      <ColorBar $color="darkred" $width={(hp / (hpTemp + hp)) * 100}>
        <HitPointText>{totalHp}</HitPointText>
        <ColorBar $color="red" $width={(hpCurrent / hp) * 100}>
          <HitPointText>{currentHp}</HitPointText>
        </ColorBar>
      </ColorBar>
      {hpTemp > 0 && (
        <ColorBar $color="green" $width={(hpTemp / (hpTemp + hp)) * 100}>
          <HitPointText>{tempHp}</HitPointText>
        </ColorBar>
      )}
    </Container>
  );
}
