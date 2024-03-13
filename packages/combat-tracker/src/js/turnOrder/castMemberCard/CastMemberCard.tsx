import { CastMember } from "creature";
import { SyntheticEvent, useState } from "react";
import styled from "styled-components";
import { media } from "../../app/constants";
import { useIsDM } from "../../app/store";
import { ArmorClassShield } from "./ArmorClassShield";
import { ConditionMenu, ConditionOverlay } from "./ConditionOverlay";
import { HitPointBar } from "./HitPointsBar";

const Panel = styled.div<{ $myTurn: boolean }>`
  align-content: stretch;
  align-items: stretch;
  ${({ $myTurn }) =>
    $myTurn
      ? "background-color: lightgreen; border: 3px solid green;"
      : "border: 1px solid gray;"}
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: none;

  ${media.md`
      align-items: center;
      width: 100%;
  `}

  &:hover ${ConditionMenu} {
    display: inline;
  }
`;
const Initiative = styled.div`
  background-color: white;
  border: 2px solid black;
  border-radius: 50%;
  color: black;
  font-size: 1em;
  height: 2em;
  left: 0.5em;
  line-height: 2em;
  position: absolute;
  text-align: center;
  top: 0.5em;
  vertical-align: middle;
  width: 2em;
`;
const PortraitFrame = styled.div`
  flex-grow: 100;
  max-height: 33vh;
  max-width: 20vw;
  position: relative;
  text-align: center;

  ${media.md`
    max-height: 100%;
    max-width: 100%;
    width: 100%;
  `}
`;
const Portrait = styled.img`
  height: auto;
  max-height: 100%;
  max-width: 100%;
  width: auto;

  ${media.md`
    max-height: 100%;
    width: 100%;
  `}
`;
const NamePlate = styled.div`
  flex-grow: 0;
  text-align: center;
`;
const NameField = styled.input`
  flex-grow: 0;
  text-align: center;
  width: 100%;
`;

export function CastMemberCard({ castMember }: { castMember: CastMember }) {
  const dm = useIsDM();

  const [name, setName] = useState<string>(
    castMember.nickname ??
      (dm || castMember.character ? castMember.name : "unknown")
  );
  const [editing, setEditing] = useState<boolean>(false);
  const editName = () => {
    if (!dm) {
      return;
    }
    setEditing(true);
  };
  const updateName = (event: SyntheticEvent) => {
    if (!dm) {
      return;
    }
    castMember.nickname = (event.target as HTMLInputElement).value;
    setName(castMember.nickname);
    if ((event as unknown as KeyboardEvent).key === "Enter") {
      setEditing(false);
    }
  };
  const changeName = (event: SyntheticEvent) => {
    if (!dm) {
      return;
    }
    updateName(event);
    setEditing(false);
  };
  return (
    <Panel $myTurn={castMember.myTurn}>
      <HitPointBar castMember={castMember} />
      <PortraitFrame data-portrait-frame>
        <Portrait src={castMember.image} data-portrait></Portrait>
        <ConditionOverlay castMember={castMember} />
        <Initiative>{castMember.initiativeOrder}</Initiative>
        <ArmorClassShield castMember={castMember} />
      </PortraitFrame>
      {editing ? (
        <NameField
          autoFocus
          value={name}
          onKeyDown={updateName}
          onChange={updateName}
          onBlur={changeName}
        ></NameField>
      ) : (
        <NamePlate onClick={editName}>{name}</NamePlate>
      )}
    </Panel>
  );
}
