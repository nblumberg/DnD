import { CastMember } from "creature";
import { createContext, useEffect, useState } from "react";
import { setLog } from "roll";
import { awaitSocket, useSocket } from "../services/sockets";

setLog(() => {});

let cachedCastMembers: CastMember[] = [];

awaitSocket().then((io) => {
  io.on("castMembers", (castMembers: CastMember[]) => {
    console.log("Cast members changed");
    cachedCastMembers = castMembers;
  });
});

export function useCastMembers(): CastMember[] {
  const [castMembers, setCastMembers] = useState<CastMember[]>([
    ...cachedCastMembers,
  ]);
  const io = useSocket();
  useEffect(() => {
    if (!io) {
      return;
    }
    io.on("castMembers", (newCastMembers: CastMember[]): void => {
      setCastMembers(newCastMembers);
    });
    () => {
      io.off("castMembers");
    };
  }, [setCastMembers, io]);
  return castMembers;
}

export const CastMemberContext = createContext<CastMember[]>([]);
