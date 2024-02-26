import { CastMember, idCastMember } from "creature";
import { SyntheticEvent, useContext } from "react";
import { Roll, RollHistory } from "roll";
import { useSocket } from "../app/api/sockets";
import { useCharacters, useIsDM } from "../app/store";
import { CastMemberContext } from "../app/store/castMembers";
import { InteractiveRollContext } from "./InteractiveRoll";

export function useRollInitiative(): (
  event?: SyntheticEvent,
  rolls?: RollHistory[]
) => void {
  const castMembers = useContext(CastMemberContext);
  const io = useSocket();
  const interactiveRoll = useContext(InteractiveRollContext);
  const ids = useCharacters();
  const dm = useIsDM();

  // Derivative state
  const myCharacters = castMembers.filter(
    ({ id, character }) => ids.includes(id) || (dm && !character)
  );
  const initiativeRolls = myCharacters.map((castMember) => ({
    roll: new Roll({ dieCount: 1, dieSides: 20, extra: castMember.initiative }),
    label: myCharacters.length > 1 ? idCastMember(castMember) : undefined,
  }));

  const onRoll = (rolls: RollHistory[]) => {
    if (!rolls) {
      // TODO: why is this being immediately invoked?
      return;
    }
    const initiativeMap = myCharacters.reduce(
      (initiativeMap, castMember, i) => {
        return {
          ...initiativeMap,
          [castMember.id]: rolls[i],
        };
      },
      {} as Record<string, RollHistory>
    );
    if (!io) {
      throw new Error("Socket not initialized");
    }
    io.emit("rollInitiative", initiativeMap);
  };

  return (_event?: SyntheticEvent) => {
    interactiveRoll.open(
      "What's your initiative roll?",
      initiativeRolls,
      onRoll
    );
  };
}

export function usePickActors(
  setActorPickerOpen: (value: boolean) => void
): (event: SyntheticEvent) => void {
  return (event: SyntheticEvent) => {
    event.stopPropagation(); // don't let click that opens the dialog bubble up to the window and dismiss it
    setActorPickerOpen(true);
  };
}

export function usePreviousTurn(
  dm: boolean,
  castMembers: CastMember[],
  currentTurnIndex: number,
  io: ReturnType<typeof useSocket>
): (event: SyntheticEvent) => void {
  return () => {
    if (!dm) {
      // TODO: allow players to manually enter their initiative
      return;
    }
    const previousIndex =
      currentTurnIndex - 1 < 0 ? castMembers.length - 1 : currentTurnIndex - 1;
    if (!io) {
      throw new Error("Socket not initialized");
    }
    io.emit("turn", castMembers[previousIndex].id);
  };
}

export function useNextTurn(
  dm: boolean,
  castMembers: CastMember[],
  currentTurnIndex: number,
  io: ReturnType<typeof useSocket>
): (event: SyntheticEvent) => void {
  return () => {
    if (!dm) {
      return;
    }
    const nextIndex = (currentTurnIndex + 1) % castMembers.length;
    if (!io) {
      throw new Error("Socket not initialized");
    }
    io.emit("turn", castMembers[nextIndex].id);
  };
}

export function useEndTurn(
  dm: boolean,
  isMyTurn: boolean,
  io: ReturnType<typeof useSocket>,
  currentTurnIndex: number,
  castMembers: CastMember[]
): (event: SyntheticEvent) => void {
  return () => {
    if (dm || !isMyTurn) {
      return;
    }
    const nextIndex = (currentTurnIndex + 1) % castMembers.length;
    if (!io) {
      throw new Error("Socket not initialized");
    }
    io.emit("turn", castMembers[nextIndex].id);
  };
}

export function useResetGame(
  dm: boolean,
  io: ReturnType<typeof useSocket>
): () => void {
  return () => {
    if (!dm) {
      return;
    }
    if (!io) {
      throw new Error("Socket not initialized");
    }
    io.emit("resetGame");
  };
}
