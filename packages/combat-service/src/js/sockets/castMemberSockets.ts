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
  const result: CastMemberRaw[] = [];
  for (const castMember of castMembers) {
    try {
      result.push(castMember.raw());
    } catch (e) {
      console.error(`Failed to serialize ${castMember.id}`, e);
      throw e;
    }
  }
  return result;
};

function syncCastMembers(socket: Socket): void {
  const users: string = serializeSocketUsers(socket);
  console.log(`Cast member logic connected for ${users}`);

  socket.emit("castMembers", castMemberMessage());

  addCastMembersListener(() => {
    console.log(`${users} detected cast members change`);
    socket.emit("castMembers", castMemberMessage());
  });
}
