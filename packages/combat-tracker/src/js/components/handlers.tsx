import { CastMember } from "creature";
import { SyntheticEvent } from "react";
import { RollHistory } from "roll";
import { useSocket } from "../services/sockets";

export function useRollInitiative(
  setRollOpen: (value: boolean) => void,
  io: ReturnType<typeof useSocket>,
  myCharacters: CastMember[]
): (event?: SyntheticEvent, rolls?: RollHistory[]) => void {
  return (_event?: SyntheticEvent, rolls?: RollHistory[]) => {
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
      if (!io) {
        throw new Error("Socket not initialized");
      }
      io.emit("rollInitiative", initiativeMap);
      setRollOpen(false);
    } else {
      setRollOpen(true);
    }
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
