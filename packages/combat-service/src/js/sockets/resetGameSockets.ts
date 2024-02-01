import { resetGame } from "../state";
import { SocketServer } from "./initAndAccessSockets";

export function attachResetGameSockets(io: SocketServer) {
  io.of("/dm").on("connection", (socket) => {
    socket.on("resetGame", () => {
      resetGame();
    });
  });
}
