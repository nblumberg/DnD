import { awaitSocket } from "./sockets";

export async function undoHistory() {
  const io = await awaitSocket();
  io.emit("undoHistory");
}

export async function redoHistory() {
  const io = await awaitSocket();
  io.emit("redoHistory");
}
