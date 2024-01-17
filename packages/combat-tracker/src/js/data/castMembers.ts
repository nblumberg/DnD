import { CastMember, CastMemberRaw } from "creature";
import { useEffect, useState } from "react";
import { setLog } from "roll";
import { getSocket } from "../services/sockets";

setLog(() => {});

let cachedCastMembers: CastMember[] = [];

export function useCastMembers(): CastMember[] {
  const [castMembers, setCastMembers] = useState<CastMember[]>([
    ...cachedCastMembers,
  ]);
  useEffect(() => {
    const io = getSocket();
    io.on("castMembers", (castMembersRaw: CastMemberRaw[]) => {
      console.log("Cast members changed");
      cachedCastMembers = castMembersRaw.map(
        (castMemberRaw) => new CastMember(castMemberRaw)
      );
      setCastMembers([...cachedCastMembers]);
    });
    () => {
      io.off("castMembers");
    };
  }, [setCastMembers]);
  return castMembers;
}
