import { CastMember, CastMemberRaw } from "creature";
import { useEffect, useState } from "react";
import { setLog } from "roll";
import { awaitSocket, useSocket } from "../services/sockets";

setLog(() => {});

let cachedCastMembers: CastMember[] = [];

awaitSocket().then((io) => {
  io.on("castMembers", (castMembersRaw: CastMemberRaw[]) => {
    console.log("Cast members changed");
    cachedCastMembers = castMembersRaw.map(
      (castMemberRaw) => new CastMember(castMemberRaw)
    );
  });
});

export function useCastMembers(): CastMember[] {
  const [castMembers, setCastMembers] = useState<CastMember[]>([
    ...cachedCastMembers,
  ]);
  const io = useSocket();
  useEffect(() => {
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
