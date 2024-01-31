import { idCastMember } from "creature";
import { SyntheticEvent, useContext, useState } from "react";
import { Roll, RollHistory } from "roll";
import styled, { createGlobalStyle } from "styled-components";
import { IdentityContext, logout, useCharacters, useIsDM } from "../auth";
import { useCastMembers } from "../data/castMembers";
import { useTurn } from "../data/turn";
import { useSocket } from "../services/sockets";
import { ActorPicker } from "./ActorPicker";
import { InteractiveRoll } from "./InteractiveRoll";
import { ButtonBar, Menu, MenuButton, MenuOption } from "./Menu";
import { device, media } from "./breakpoints";

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
  { playerOnly: true, icon: "🎬", text: "Actions", handlerName: "actions" },
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
  const castMembers = useCastMembers();
  const turn = useTurn();
  const [actorPickerOpen, setActorPickerOpen] = useState<boolean>(false);
  const [rollOpen, setRollOpen] = useState<boolean>(false);
  const io = useSocket();

  // Derivative state
  const myCharacters = castMembers.filter(
    ({ id, character }) => ids.includes(id) || (dm && !character)
  );
  const isMyTurn = !dm && ids.includes(turn ?? "");
  const currentTurnIndex = castMembers.findIndex(({ id }) => id === turn) ?? 0;
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

  const rollInitiative = (_event?: SyntheticEvent, rolls?: RollHistory[]) => {
    if (rolls) {
      const initiativeMap = myCharacters.reduce(
        (initiativeMap, castMember, i) => {
          return {
            ...initiativeMap,
            [castMember.id]: rolls[i],
          };
        },
        {} as Record<string, RollHistory>
      );
      io.emit("rollInitiative", initiativeMap);
      setRollOpen(false);
    } else {
      setRollOpen(true);
    }
  };

  const handlers: Record<string, (event: SyntheticEvent) => void> = {
    pickActors: (event: SyntheticEvent) => {
      event.stopPropagation(); // don't let click that opens the dialog bubble up to the window and dismiss it
      setActorPickerOpen(true);
    },
    previousTurn: () => {
      if (!dm) {
        // TODO: allow players to manually enter their initiative
        return;
      }
      const previousIndex =
        currentTurnIndex - 1 < 0
          ? castMembers.length - 1
          : currentTurnIndex - 1;
      io.emit("turn", castMembers[previousIndex].id);
    },
    rollInitiative,
    nextTurn: () => {
      if (!dm) {
        return;
      }
      const nextIndex = (currentTurnIndex + 1) % castMembers.length;
      io.emit("turn", castMembers[nextIndex].id);
    },
    endTurn: () => {
      if (dm || !isMyTurn) {
        return;
      }
      const nextIndex = (currentTurnIndex + 1) % castMembers.length;
      io.emit("turn", castMembers[nextIndex].id);
    },
  };

  // JSX
  const options: MenuOption[] = optionParams
    .filter(({ dmOnly, playerOnly }) => !(dmOnly && !dm) && !(playerOnly && dm))
    .map(({ icon, text, handlerName }) => ({
      icon,
      text,
      onClick: handlers[handlerName],
    }));

  const avatar = (
    <AvatarCrop>
      <Avatar src={user.picture} alt={user.name} onClick={logout} />
    </AvatarCrop>
  );

  const useButtons = window.screen.width > device.md;

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
          <Menu options={options} />
        </MenuBar>
      )}
      {actorPickerOpen && (
        <ActorPicker onClose={closeActorPicker}></ActorPicker>
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
