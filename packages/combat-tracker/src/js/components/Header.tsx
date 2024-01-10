import { useDispatch } from "react-redux";
import styled from "styled-components";
import { rollInitiative } from "../features/castMember/castMembers";

const ButtonBar = styled.div`
  background: #cccccc;
  border: 2px solid black;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
`;
const Button = styled.button`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  margin: 1em;
`;

export function Header({ pickActors }: { pickActors: () => void }) {
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(rollInitiative());
  };

  return (
    <ButtonBar>
      <Button title="Add actor" onClick={pickActors}>
        🎭
      </Button>
      <Button title="Roll initiative" onClick={onClick}>
        🕐
      </Button>
    </ButtonBar>
  );
}
