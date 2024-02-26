import styled from "styled-components";
import { media } from "../../app/constants";

const Main = styled.main`
  font-size: 4em;
  text-align: center;
  ${media.md`
    font-size: 10vw;
  `}
`;
const Button = styled.button`
  font-size: 1em;
  max-width: 20em;
  width: 100%;

  ${media.md`
    font-size: 10vw;
    max-width: auto;
  `}
`;

export function Login({ login }: { login: () => void }) {
  return (
    <Main>
      <h1>D&D</h1>
      <Button onClick={login}>Log in</Button>
    </Main>
  );
}
