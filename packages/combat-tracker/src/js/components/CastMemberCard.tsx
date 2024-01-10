import { SyntheticEvent, useState } from "react";
import styled from "styled-components";
import { CastMember } from "../data/castMembers";

const Panel = styled.div`
  align-items: stretch;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  position: relative;
`;
const Initiative = styled.div`
  position: absolute;
  top: 1em;
  left: 1em;
`;
const PortraitFrame = styled.div`
  flex-grow: 100;
  max-height: 33vh;
  max-width: 20vw;
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
      <PortraitFrame>
        <Portrait src={castMember.image}></Portrait>
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
      <Initiative>{castMember.initiativeOrder}</Initiative>
    </Panel>
  );
}
