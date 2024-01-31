import { useEffect, useState } from "react";
import styled from "styled-components";
import { Login } from "./Login";
import { IdentityContext, useLogin } from "./auth";
import { Header } from "./components/Header";
import { History } from "./components/History";
import { TurnOrder } from "./components/TurnOrder";
import { CastMemberContext, useCastMembers } from "./data/castMembers";
import { MobileContext, useMobile } from "./data/mobile";
import { View, ViewContext } from "./data/view";
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
  const io = useSocket();
  const isMobile = useMobile();
  const castMembers = useCastMembers();
  const [view, setView] = useState<View>(isMobile ? "turnOrder" : "both");

  useEffect(() => {
    if (isMobile) {
      if (view === "both") {
        setView("turnOrder");
      }
    } else if (view !== "both") {
      setView("both");
    }
  }, [isMobile, view, setView]);

  if (!user) {
    return <Login login={login} />;
  }

  if (!io) {
    return <div>Loading...</div>;
  }

  return (
    <IdentityContext.Provider value={user}>
      <MobileContext.Provider value={isMobile}>
        <CastMemberContext.Provider value={castMembers}>
          <ViewContext.Provider value={{ view, setView }}>
            <Header />
            <Body>
              {view !== "history" ? <TurnOrderGrow></TurnOrderGrow> : null}
              {view !== "turnOrder" ? <HistoryShrink></HistoryShrink> : null}
            </Body>
          </ViewContext.Provider>
        </CastMemberContext.Provider>
      </MobileContext.Provider>
    </IdentityContext.Provider>
  );
}
