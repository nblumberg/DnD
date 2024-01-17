import { SyntheticEvent, useState } from "react";
import { Roll } from "roll";
import styled from "styled-components";
import { getIdentity, isDM } from "../auth";
import { useCastMembers } from "../data/castMembers";
import { useTurn } from "../data/turn";
import { getSocket } from "../services/sockets";
import { InteractiveRoll } from "./InteractiveRoll";

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
  { playerOnly: true, label: "🏁", title: "End turn", handlerName: "endTurn" },
];

export function Header({ pickActors }: { pickActors: () => void }) {
  const id = getIdentity();
  const dm = isDM();
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
      getSocket().emit("rollInitiative", initiativeMap);
    } else if (roll) {
      getSocket().emit("rollInitiative", { [id]: roll });
      setRollOpen(false);
    } else {
      setRollOpen(true);
    }
  };

  const handlers: Record<string, () => void> = {
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
      getSocket().emit("turn", castMembers[previousIndex].id);
    },
    rollInitiative,
    nextTurn: () => {
      if (!dm) {
        return;
      }
      const nextIndex = (currentTurnIndex + 1) % castMembers.length;
      getSocket().emit("turn", castMembers[nextIndex].id);
    },
    endTurn: () => {
      if (dm || !isMyTurn) {
        return;
      }
      const nextIndex = (currentTurnIndex + 1) % castMembers.length;
      getSocket().emit("turn", castMembers[nextIndex].id);
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
    <header>
      <ButtonBar>{buttons}</ButtonBar>
      {rollOpen && (
        <InteractiveRoll
          title="What's your initiative roll?"
          roll={myCharacter?.initiative ?? new Roll("1d20")}
          onRoll={(result: number) => {
            rollInitiative(undefined, result);
          }}
        />
      )}
    </header>
  );
}
