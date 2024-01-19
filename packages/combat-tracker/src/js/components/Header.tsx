import { SyntheticEvent, useContext, useState } from "react";
import { Roll } from "roll";
import styled, { createGlobalStyle } from "styled-components";
import { IdentityContext, logout, useCharacter, useIsDM } from "../auth";
import { useCastMembers } from "../data/castMembers";
import { useTurn } from "../data/turn";
import { useSocket } from "../services/sockets";
import { InteractiveRoll } from "./InteractiveRoll";

const MenuBar = styled.header`
  align-items: center;
  background: #cccccc;
  border: 2px solid black;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  left: 0;
  height: 3em;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 1;
`;
const ButtonBar = styled.div`
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
const AvatarCrop = styled.div`
  border-radius: 50%;
  height: 2em;
  overflow: hidden;
  position: relative;
  width: 2em;
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

export function Header({
  pickActors,
}: {
  pickActors: (event: SyntheticEvent) => void;
}) {
  const io = useSocket();
  if (!io) {
    return null;
  }
  const user = useContext(IdentityContext);
  const id = useCharacter();
  const dm = useIsDM();
  const castMembers = useCastMembers();
  const myCharacter = castMembers.find(({ id: memberId }) => memberId === id);
  const turn = useTurn();
  const isMyTurn = !dm && turn === id;
  const currentTurnIndex = castMembers.findIndex(({ id }) => id === turn) ?? 0;

  const [rollOpen, setRollOpen] = useState(false);

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
    <>
      <GlobalStyle data-global-style />
      <MenuBar>
        <ButtonBar>{buttons}</ButtonBar>
        <AvatarCrop>
          <Avatar src={user.picture} alt={user.name} onClick={logout} />
        </AvatarCrop>
      </MenuBar>
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
