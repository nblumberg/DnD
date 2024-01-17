import { Auditioner, CastMemberRaw, Condition } from "creature";
import { Socket } from "socket.io";
import {
  addConditionToCastMember,
  castActor,
  fireActor,
  removeConditionFromCastMember,
} from "../actions/castMemberActions";
import { getTurnOrder } from "../actions/initiativeActions";
import { addCastMembersListener } from "../state/castMemberState";
import { SocketServer } from "./initAndAccessSockets";

export function attachCastMemberSockets(io: SocketServer) {
  io.on("connection", (socket) => {
    syncCastMembers(socket);
  });

  io.of("/dm").on("connection", (socket) => {
    syncCastMembers(socket);

    socket.on("castActor", (auditioner: Auditioner) => {
      castActor(auditioner);
    });
    socket.on("castActors", (auditioners: Auditioner[]) => {
      auditioners.forEach((auditioner) => {
        castActor(auditioner);
      });
    });

    socket.on("fireActor", (id: string) => {
      fireActor(id);
    });
    socket.on("fireActors", (ids: string[]) => {
      ids.forEach((id) => {
        fireActor(id);
      });
    });

    socket.on("addCondition", (id: string, condition: Condition) => {
      addConditionToCastMember(id, condition);
    });
    socket.on("removeCondition", (id: string, condition: Condition) => {
      removeConditionFromCastMember(id, condition);
    });
  });
}

const castMemberMessage = (): CastMemberRaw[] => {
  const castMembers = getTurnOrder();
  const result = castMembers.map((castMember) => castMember.raw());
  return result;
};

function syncCastMembers(socket: Socket): void {
  const playerDM = Array.from(socket.rooms.values()).toString();
  const userId = socket.handshake.address;
  console.log(`${playerDM} cast member logic connected from ${userId}`);

  socket.emit("castMembers", castMemberMessage());

  addCastMembersListener(() => {
    console.log(`${playerDM} ${userId} detected cast members change`);
    socket.emit("castMembers", castMemberMessage());
  });
}
