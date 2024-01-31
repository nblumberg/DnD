import { Auditioner, Condition } from "creature";
import { Socket } from "socket.io";
import {
  addConditionToCastMember,
  removeConditionFromCastMember,
} from "../actions/castMemberActions";
import { getTurnOrder } from "../actions/initiativeActions";
import {
  addCastMembersListener,
  castActor,
  fireCastMember,
} from "../state/castMemberState";
import { SocketServer, serializeSocketUsers } from "./initAndAccessSockets";

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
      fireCastMember(id);
    });
    socket.on("fireActors", (ids: string[]) => {
      ids.forEach((id) => {
        fireCastMember(id);
      });
    });

    socket.on("addCondition", (id: string, condition: Condition) => {
      addConditionToCastMember(id, { condition });
    });
    socket.on("removeCondition", (id: string, condition: string) => {
      removeConditionFromCastMember(id, condition);
    });
  });
}

function syncCastMembers(socket: Socket): void {
  const users: string = serializeSocketUsers(socket);
  console.log(`Cast member logic connected for ${users}`);

  socket.emit("castMembers", getTurnOrder());

  addCastMembersListener(() => {
    console.log(`${users} detected cast members change`);
    socket.emit("castMembers", getTurnOrder());
  });
}
