import { CastMember, CastMemberRaw } from "creature";
import { useEffect, useState } from "react";
import { setLog } from "roll";
import { getSocket } from "../services/sockets";

setLog(() => {});

let cachedCastMembers: CastMember[] = [];

const io = getSocket();
io.on("castMembers", (castMembersRaw: CastMemberRaw[]) => {
  console.log("Cast members changed");
  cachedCastMembers = castMembersRaw.map(
    (castMemberRaw) => new CastMember(castMemberRaw)
  );
});

export function useCastMembers(): CastMember[] {
  const [castMembers, setCastMembers] = useState<CastMember[]>([
    ...cachedCastMembers,
  ]);
  useEffect(() => {
    const io = getSocket();
    io.on("castMembers", (castMembersRaw: CastMemberRaw[]) => {
      const newCastMembers = castMembersRaw.map(
        (castMemberRaw) => new CastMember(castMemberRaw)
      );
      setCastMembers(newCastMembers);
    });
    () => {
      io.off("castMembers");
    };
  }, [setCastMembers]);
  return castMembers;
}
