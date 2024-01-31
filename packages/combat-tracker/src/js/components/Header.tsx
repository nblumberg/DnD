import { idCastMember } from "creature";
import { SyntheticEvent, useContext, useState } from "react";
import { Roll, RollHistory } from "roll";
import styled, { createGlobalStyle } from "styled-components";
import { IdentityContext, logout, useCharacters, useIsDM } from "../auth";
import { CastMemberContext } from "../data/castMembers";
import { MobileContext } from "../data/mobile";
import { useSocket } from "../services/sockets";
import { ActionMenu } from "./ActionMenu";
import { ActorPicker } from "./ActorPicker";
import { InteractiveRoll } from "./InteractiveRoll";
import { MenuOption } from "./Menu";
import { ButtonBar, MenuButton, MobileHeader } from "./MobileHeader";
import { media } from "./breakpoints";
import {
  useEndTurn,
  useNextTurn,
  usePickActors,
  usePreviousTurn,
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

const optionParams: Array<{
  dmOnly?: true;
  playerOnly?: true;
  icon: string;
  text: string;
  handlerName: string;
}> = [
  { dmOnly: true, icon: "🎭", text: "Add actor", handlerName: "pickActors" },
  {
    dmOnly: true,
    icon: "⏪",
    text: "Previous turn",
    handlerName: "previousTurn",
  },
  { icon: "🕐", text: "Roll initiative", handlerName: "rollInitiative" },
  { dmOnly: true, icon: "⏩", text: "Next turn", handlerName: "nextTurn" },
  { icon: "🎬", text: "Actions", handlerName: "actions" },
  { playerOnly: true, icon: "🏁", text: "End turn", handlerName: "endTurn" },
];

function HeaderButtons({ options }: { options: MenuOption[] }) {
  const buttons = options.map(({ icon, text, onClick }) => {
    return (
      <MenuButton key={text} title={text} onClick={onClick}>
        {icon ?? text}
      </MenuButton>
    );
  });
  return <ButtonBar>{buttons}</ButtonBar>;
}

export function Header() {
  // React state
  const user = useContext(IdentityContext);
  const ids = useCharacters();
  const dm = useIsDM();
  const castMembers = useContext(CastMemberContext);
  const [actorPickerOpen, setActorPickerOpen] = useState<boolean>(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<boolean>(false);
  const [rollOpen, setRollOpen] = useState<boolean>(false);
  const io = useSocket();
  const useButtons = !useContext(MobileContext);

  // Derivative state
  const myCharacters = castMembers.filter(
    ({ id, character }) => ids.includes(id) || (dm && !character)
  );
  const currentTurnCastMember = castMembers.find(({ myTurn }) => myTurn);
  const isMyTurn = !dm && ids.includes(currentTurnCastMember?.id ?? "");
  const currentTurnIndex = currentTurnCastMember
    ? castMembers.indexOf(currentTurnCastMember)
    : -1;
  const initiativeRolls = myCharacters.map((castMember) => ({
    roll: new Roll({ dieCount: 1, dieSides: 20, extra: castMember.initiative }),
    label: myCharacters.length > 1 ? idCastMember(castMember) : undefined,
  }));

  if (!io) {
    return null;
  }

  // Event handlers
  function closeActorPicker() {
    setActorPickerOpen(false);
    (document.activeElement as HTMLElement)?.blur();
  }

  const rollInitiative = useRollInitiative(setRollOpen, io, myCharacters);

  const handlers: Record<
    string,
    (event: SyntheticEvent, ...args: any[]) => void
  > = {
    pickActors: usePickActors(setActorPickerOpen),
    previousTurn: usePreviousTurn(dm, castMembers, currentTurnIndex, io),
    rollInitiative,
    nextTurn: useNextTurn(dm, castMembers, currentTurnIndex, io),
    endTurn: useEndTurn(dm, isMyTurn, io, currentTurnIndex, castMembers),
    actions: () => {
      setActionMenuOpen(true);
    },
  };

  // JSX
  const defaultMenuOptions: Array<
    MenuOption & { dmOnly?: boolean; playerOnly?: boolean }
  > = optionParams.map((params) => ({
    ...params,
    onClick: (event: SyntheticEvent) => handlers[params.handlerName](event),
  }));
  const options: MenuOption[] = defaultMenuOptions
    .filter(({ dmOnly, playerOnly }) => !(dmOnly && !dm) && !(playerOnly && dm))
    .map(({ icon, text, onClick }) => ({
      icon,
      text,
      onClick,
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
      {currentTurnCastMember && actionMenuOpen && (
        <ActionMenu
          castMember={currentTurnCastMember}
          onClose={() => setActionMenuOpen(false)}
        />
      )}

      {rollOpen && (
        <InteractiveRoll
          title="What's your initiative roll?"
          rolls={initiativeRolls}
          onRoll={(result: RollHistory[]) => {
            rollInitiative(undefined, result);
          }}
          onCancel={() => {
            setRollOpen(false);
          }}
        />
      )}
    </>
  );
}
