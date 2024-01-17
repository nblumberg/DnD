import styled from "styled-components";
import { isDM } from "../auth";
import { getSocket } from "../services/sockets";

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
  const onClick = () => {
    getSocket().emit("rollInitiative", {});
  };

  const dm = isDM();

  return (
    <ButtonBar>
      {dm && (
        <Button title="Add actor" onClick={pickActors}>
          🎭
        </Button>
      )}
      <Button title="Roll initiative" onClick={onClick}>
        🕐
      </Button>
    </ButtonBar>
  );
}
