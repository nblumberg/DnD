import styled from "styled-components";
import { Login } from "./Login";
import { IdentityContext, useLogin } from "./auth";
import { Header } from "./components/Header";
import { History } from "./components/History";
import { TurnOrder } from "./components/TurnOrder";
import { useSocket } from "./services/sockets";

const Body = styled.section`
  display: flex;
  justify-content: space-between;
`;
const TurnOrderGrow = styled(TurnOrder)`
  flex-grow: 2;
`;
const HistoryShrink = styled(History)`
  flex-grow: 0;
`;
export function App() {
  const { login, user } = useLogin();

  if (!user) {
    return <Login login={login} />;
  }

  if (!useSocket()) {
    return <div>Loading...</div>;
  }

  return (
    <IdentityContext.Provider value={user}>
      <Header />
      <Body>
        <TurnOrderGrow></TurnOrderGrow>
        <HistoryShrink></HistoryShrink>
      </Body>
    </IdentityContext.Provider>
  );
}
