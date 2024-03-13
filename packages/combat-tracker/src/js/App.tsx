import { CastMember } from "creature";
import { useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useSocket } from "./app/api/sockets";
import { changeViewAction } from "./app/reducers";
import { useAppState, useHistory, useLogin, useMobile } from "./app/store";
import { CastMemberContext, useCastMembers } from "./app/store/castMembers";
import {
  ActionMenuAPI,
  ActionMenuContext,
  useActionMenu,
} from "./components/ActionMenu";
import { Header } from "./components/Header";
import {
  InteractiveRollAPI,
  InteractiveRollContext,
  useInteractiveRoll,
} from "./components/InteractiveRoll";
import {
  TargetSelectAPI,
  TargetSelectContext,
  useTargetSelect,
} from "./components/TargetSelect";
import { History } from "./history";
import { Login } from "./login/pages/Login";
import { TurnOrder } from "./turnOrder";

const GlobalStyle = createGlobalStyle`
body {
  background-color: black;
  color: white;
}
`;

const Body = styled.section`
  color: white;
  display: flex;
  justify-content: space-between;
`;
const TurnOrderGrow = styled(TurnOrder)`
  flex-grow: 2;
`;
const HistoryShrink = styled(History)`
  flex-grow: 0;
`;

let renderCount = 1;

export function App() {
  const [{ view }, dispatch] = useAppState();
  const { login, user } = useLogin();
  const io = useSocket();
  const isMobile = useMobile();
  const history = useHistory();
  const castMembers = useCastMembers(history);
  console.log("App render", history, castMembers);
  const interactiveRoll = useInteractiveRoll();
  const actionMenu = useActionMenu();
  const targetSelect = useTargetSelect();

  useEffect(() => {
    if (isMobile) {
      if (view === "both") {
        changeViewAction(dispatch, "turnOrder");
      }
    } else if (view !== "both") {
      changeViewAction(dispatch, "both");
    }
  }, [isMobile, view, dispatch]);

  if (!user) {
    return <Login login={login} />;
  }

  if (!io) {
    return <div>Loading...</div>;
  }

  return (
    <ApplyContext
      actionMenu={actionMenu.context}
      castMembers={castMembers}
      interactiveRoll={interactiveRoll.context}
      targetSelect={targetSelect.context}
    >
      <GlobalStyle />
      <Header />
      <div>{renderCount++}</div>
      <Body>
        {view !== "history" ? <TurnOrderGrow></TurnOrderGrow> : null}
        {view !== "turnOrder" ? <HistoryShrink></HistoryShrink> : null}
      </Body>

      {interactiveRoll.jsx}
      {actionMenu.jsx}
      {targetSelect.jsx}
    </ApplyContext>
  );
}

function ApplyContext({
  children,
  actionMenu,
  castMembers,
  interactiveRoll,
  targetSelect,
}: {
  children: React.ReactNode;

  actionMenu: ActionMenuAPI;
  castMembers: CastMember[];
  interactiveRoll: InteractiveRollAPI;
  targetSelect: TargetSelectAPI;
}) {
  return (
    <CastMemberContext.Provider value={castMembers}>
      <InteractiveRollContext.Provider value={interactiveRoll}>
        <ActionMenuContext.Provider value={actionMenu}>
          <TargetSelectContext.Provider value={targetSelect}>
            {children}
          </TargetSelectContext.Provider>
        </ActionMenuContext.Provider>
      </InteractiveRollContext.Provider>
    </CastMemberContext.Provider>
  );
}
