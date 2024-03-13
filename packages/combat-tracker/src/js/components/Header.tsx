import { CastMember } from "creature";
import { SyntheticEvent, useContext, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { redoHistory, undoHistory } from "../app/api/history";
import { useSocket } from "../app/api/sockets";
import { media } from "../app/constants";
import { useCharacters, useIsDM, useLogout } from "../app/store";
import { CastMemberContext } from "../app/store/castMembers";
import { useAppState } from "../app/store/state";
import { State } from "../app/types";
import { ActionMenuContext } from "./ActionMenu";
import { ActorPicker } from "./ActorPicker";
import { MenuOption } from "./Menu";
import { ButtonBar, MenuButton, MobileHeader } from "./MobileHeader";
import {
  useEndTurn,
  useNextTurn,
  usePickActors,
  usePreviousTurn,
  useResetGame,
  useRollInitiative,
} from "./handlers";

const MenuBar = styled.header`
  align-items: center;
  background: #cccccc;
  border: 2px solid black;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  left: 0;
  height: 3em;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 1;

  ${media.md`
    justify-content: flex-start;
  `}
`;
const AvatarCrop = styled.div`
  border-radius: 50%;
  display: inline-block;
  height: 2em;
  margin-right: 1em;
  overflow: hidden;
  position: relative;
  width: 2em;

  ${media.md`
    margin-right: 0;
  `}
`;
const Avatar = styled.img`
  display: inline;
  margin: 0 auto;
  height: 100%;
  width: auto;
`;

const GlobalStyle = createGlobalStyle`
  body {
    padding-top: 3em;
  }
`;

interface MenuOptionDisabledParams {
  state: State;
  isDM: boolean;
  isMyTurn: boolean;
  currentTurnCastMember?: CastMember;
}

const optionParams: Array<{
  dmOnly?: true;
  playerOnly?: true;
  icon: string;
  text: string;
  handlerName: string;
  disabled?: (params: MenuOptionDisabledParams) => boolean;
}> = [
  { dmOnly: true, icon: "🎭", text: "Add actor", handlerName: "pickActors" },
  {
    dmOnly: true,
    icon: "⏪",
    text: "Previous turn",
    handlerName: "previousTurn",
    disabled: ({ state, currentTurnCastMember }) => {
      if (!currentTurnCastMember) {
        return true;
      }
      const firstInRound = state.castMembers.every(
        ({ initiativeOrder }) =>
          initiativeOrder <= currentTurnCastMember?.initiativeOrder
      );
      if (!firstInRound) {
        return false;
      }
      return !state.events.find(({ type }) => type === "ChangeRound");
    },
  },
  { icon: "🕐", text: "Roll initiative", handlerName: "rollInitiative" },
  { dmOnly: true, icon: "⏩", text: "Next turn", handlerName: "nextTurn" },
  {
    icon: "🎬",
    text: "Actions",
    handlerName: "actions",
    disabled: ({ isDM, isMyTurn }) => {
      return !isDM && !isMyTurn;
    },
  },
  {
    playerOnly: true,
    icon: "🏁",
    text: "End turn",
    handlerName: "endTurn",
    disabled: ({ currentTurnCastMember }) => {
      return !currentTurnCastMember;
    },
  },
  {
    dmOnly: true,
    icon: "🔄",
    text: "Undo",
    handlerName: "undoHistory",
    disabled: ({ state }) => state.events.length === 0,
  },
  {
    dmOnly: true,
    icon: "🔁",
    text: "Redo",
    handlerName: "redoHistory",
    disabled: ({ state }) => !state.undoneHistory.events.length,
  },
  { dmOnly: true, icon: "🗑", text: "Reset game", handlerName: "resetGame" },
];

function HeaderButtons({ options }: { options: MenuOption[] }) {
  const buttons = options.map(({ icon, text, onClick, disabled }) => {
    return (
      <MenuButton key={text} title={text} onClick={onClick} disabled={disabled}>
        {icon ?? text}
      </MenuButton>
    );
  });
  return <ButtonBar>{buttons}</ButtonBar>;
}

export function Header() {
  // React state
  const [state] = useAppState();
  const { isMobile, user, undoneHistory } = state;
  console.log("undoneHistory", undoneHistory);
  const ids = useCharacters();
  const isDM = useIsDM();
  const castMembers = useContext(CastMemberContext);
  const [actorPickerOpen, setActorPickerOpen] = useState<boolean>(false);
  const io = useSocket();
  const logout = useLogout();
  const useButtons = !isMobile;
  const actionMenu = useContext(ActionMenuContext);

  // Derivative state
  const currentTurnCastMember = castMembers.find(({ myTurn }) => myTurn);
  const isMyTurn = !isDM && ids.includes(currentTurnCastMember?.id ?? "");
  const currentTurnIndex = currentTurnCastMember
    ? castMembers.indexOf(currentTurnCastMember)
    : -1;

  if (!user || !io) {
    return null;
  }

  // Event handlers
  function closeActorPicker() {
    setActorPickerOpen(false);
    (document.activeElement as HTMLElement)?.blur();
  }

  const handlers: Record<
    string,
    (event: SyntheticEvent, ...args: any[]) => void
  > = {
    pickActors: usePickActors(setActorPickerOpen),
    previousTurn: usePreviousTurn(isDM, castMembers, currentTurnIndex, io),
    rollInitiative: useRollInitiative(),
    nextTurn: useNextTurn(isDM, castMembers, currentTurnIndex, io),
    endTurn: useEndTurn(isDM, isMyTurn, io, currentTurnIndex, castMembers),
    actions: () => {
      if (!currentTurnCastMember) {
        alert("Actions need a cast member");
        return;
      }
      actionMenu.open(currentTurnCastMember);
    },
    undoHistory,
    redoHistory,
    resetGame: useResetGame(isDM, io),
  };

  // JSX
  const defaultMenuOptions: Array<
    MenuOption & { dmOnly?: boolean; playerOnly?: boolean }
  > = optionParams.map((params) => ({
    ...params,
    disabled: params.disabled
      ? params.disabled({
          state,
          isDM,
          isMyTurn,
          currentTurnCastMember,
        })
      : false,
    onClick: (event: SyntheticEvent) => handlers[params.handlerName](event),
  }));
  const options: MenuOption[] = defaultMenuOptions
    .filter(
      ({ dmOnly, playerOnly }) => !(dmOnly && !isDM) && !(playerOnly && isDM)
    )
    .map(({ icon, text, onClick, disabled }) => ({
      icon,
      text,
      onClick,
      disabled,
    }));

  const avatar = (
    <AvatarCrop>
      <Avatar src={user.picture} alt={user.name} onClick={logout} />
    </AvatarCrop>
  );

  if (!useButtons) {
    options.push({ icon: avatar, text: user.name, onClick: logout });
  }

  return (
    <>
      <GlobalStyle data-global-style />
      {useButtons ? (
        <MenuBar>
          <HeaderButtons options={options} />
          {avatar}
        </MenuBar>
      ) : (
        <MenuBar>
          <MobileHeader options={options} />
        </MenuBar>
      )}
      {actorPickerOpen && (
        <ActorPicker onClose={closeActorPicker}></ActorPicker>
      )}
    </>
  );
}
