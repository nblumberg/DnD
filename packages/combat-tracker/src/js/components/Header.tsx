import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { Roll } from "roll";
import styled, { createGlobalStyle } from "styled-components";
import {
  IdentityContext,
  Profile,
  logout,
  useCharacter,
  useIsDM,
} from "../auth";
import { useCastMembers } from "../data/castMembers";
import { useTurn } from "../data/turn";
import { useSocket } from "../services/sockets";
import { InteractiveRoll } from "./InteractiveRoll";
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
const ButtonBar = styled.div`
  display: flex;
  flex-grow: 1;
  flex-wrap: nowrap;
  justify-content: flex-start;
`;
const Button = styled.button`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  margin: 1em;
  ${media.md`
    flex-grow: 1;
    font-size: 1em;
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
const DropDown = styled.nav`
  align-items: stretch;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  left: 0;
  position: fixed;
  right: 0;
  top: 3em;
  z-index: 2;
`;
const DropDownOption = styled.a`
  border: 1px solid black;
  font-size: 2em;
  padding: 0.5em;
  text-align: left;
  width: 100%;
`;

const GlobalStyle = createGlobalStyle`
  body {
    padding-top: 3em;
  }
`;

const buttonParams: Array<{
  dmOnly?: true;
  playerOnly?: true;
  label: string;
  title: string;
  handlerName: string;
}> = [
  { dmOnly: true, label: "🎭", title: "Add actor", handlerName: "pickActors" },
  {
    dmOnly: true,
    label: "⏪",
    title: "Previous turn",
    handlerName: "previousTurn",
  },
  { label: "🕐", title: "Roll initiative", handlerName: "rollInitiative" },
  { dmOnly: true, label: "⏩", title: "Next turn", handlerName: "nextTurn" },
  { playerOnly: true, label: "🎬", title: "Actions", handlerName: "actions" },
  { playerOnly: true, label: "🏁", title: "End turn", handlerName: "endTurn" },
];

function Menu({
  dm,
  user,
  handlers,
  logout,
}: {
  dm: boolean;
  user: Profile;
  handlers: Record<string, (event: SyntheticEvent) => void>;
  logout: () => void;
}) {
  const useButtons = window.screen.width > device.md;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const onClose = () => {
      setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    setTimeout(() => {
      window.document.addEventListener("click", onClose);
      window.addEventListener("keydown", onKeyDown);
    }, 250);
    return () => {
      window.document.removeEventListener("click", onClose);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, setMenuOpen]);

  const avatar = (
    <AvatarCrop>
      <Avatar src={user.picture} alt={user.name} onClick={logout} />
    </AvatarCrop>
  );
  if (useButtons) {
    const buttons = buttonParams.map(
      ({ dmOnly, playerOnly, label, title, handlerName }) => {
        if (dmOnly && !dm) {
          return null;
        }
        if (playerOnly && dm) {
          return null;
        }
        return (
          <Button key={title} title={title} onClick={handlers[handlerName]}>
            {label}
          </Button>
        );
      }
    );

    return (
      <MenuBar>
        <ButtonBar>{buttons}</ButtonBar>
        {avatar}
      </MenuBar>
    );
  }

  const options = buttonParams.map(
    ({ dmOnly, playerOnly, label, title, handlerName }) => {
      if (dmOnly && !dm) {
        return null;
      }
      if (playerOnly && dm) {
        return null;
      }
      const handleAndCloseMenu = (event: SyntheticEvent) => {
        handlers[handlerName](event);
        setMenuOpen(false);
      };
      return (
        <DropDownOption key={title} onClick={handleAndCloseMenu}>
          {label} {title}
        </DropDownOption>
      );
    }
  );
  options.push(
    <DropDownOption key="logout" onClick={logout}>
      {avatar} Logout
    </DropDownOption>
  );

  return (
    <MenuBar>
      <ButtonBar>
        <Button
          title="Options"
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
        >
          Menu
        </Button>
      </ButtonBar>
      {menuOpen && <DropDown>{options}</DropDown>}
    </MenuBar>
  );
}

export function Header({
  pickActors,
}: {
  pickActors: (event: SyntheticEvent) => void;
}) {
  const user = useContext(IdentityContext);
  const id = useCharacter();
  const dm = useIsDM();
  const castMembers = useCastMembers();
  const myCharacter = castMembers.find(({ id: memberId }) => memberId === id);
  const turn = useTurn();
  const isMyTurn = !dm && turn === id;
  const currentTurnIndex = castMembers.findIndex(({ id }) => id === turn) ?? 0;

  const [rollOpen, setRollOpen] = useState(false);

  const io = useSocket();
  if (!io) {
    return null;
  }

  const rollInitiative = (_event?: SyntheticEvent, roll?: number) => {
    if (dm) {
      const initiativeMap = castMembers.reduce(
        (initiativeMap, castMember) => {
          if (castMember.character) {
            return initiativeMap;
          } else {
            return {
              ...initiativeMap,
              [castMember.id]: -1,
            };
          }
        },
        {} as Record<string, number>
      );
      io.emit("rollInitiative", initiativeMap);
    } else if (roll) {
      io.emit("rollInitiative", { [id]: roll });
      setRollOpen(false);
    } else {
      setRollOpen(true);
    }
  };

  const handlers: Record<string, (event: SyntheticEvent) => void> = {
    pickActors,
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

  return (
    <>
      <GlobalStyle data-global-style />
      <Menu dm={dm} user={user} handlers={handlers} logout={logout} />
      {rollOpen && (
        <InteractiveRoll
          title="What's your initiative roll?"
          roll={myCharacter?.initiative ?? new Roll("1d20")}
          onRoll={(result: number) => {
            rollInitiative(undefined, result);
          }}
        />
      )}
    </>
  );
}
