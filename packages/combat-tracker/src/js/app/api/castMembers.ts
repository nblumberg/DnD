import { Auditioner, CastMember } from "creature";
import { awaitSocket } from "./sockets";

export async function castActors(toBeCast: Auditioner[]) {
  if (!toBeCast || !toBeCast.length) {
    return;
  }
  const io = await awaitSocket();
  io.emit("castActors", toBeCast);
}

export async function fireActors(toBeFired: CastMember[]) {
  if (!toBeFired || !toBeFired.length) {
    return;
  }
  const io = await awaitSocket();
  io.emit(
    "fireActors",
    toBeFired.map(({ id }) => id)
  );
}
