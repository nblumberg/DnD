import { CastMember } from "creature";
import { SyntheticEvent, useState } from "react";
import styled from "styled-components";
import { ArmorClassShield } from "./ArmorClassShield";
import { ConditionOverlay } from "./ConditionOverlay";
import { HitPointBar } from "./HitPointsBar";

const Panel = styled.div`
  align-items: stretch;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  position: relative;
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
`;
const Portrait = styled.img`
  height: auto;
  max-height: 100%;
  max-width: 100%;
  width: auto;
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
  const [name, setName] = useState<string>(
    castMember.nickname ?? castMember.name
  );
  const [editing, setEditing] = useState<boolean>(false);
  const editName = () => {
    setEditing(true);
  };
  const updateName = (event: SyntheticEvent) => {
    castMember.nickname = (event.target as HTMLInputElement).value;
    setName(castMember.nickname);
    if ((event as unknown as KeyboardEvent).key === "Enter") {
      setEditing(false);
    }
  };
  const changeName = (event: SyntheticEvent) => {
    updateName(event);
    setEditing(false);
  };
  return (
    <Panel>
      <HitPointBar castMember={castMember} />
      <PortraitFrame>
        <Portrait src={castMember.image}></Portrait>
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
