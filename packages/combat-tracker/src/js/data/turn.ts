import { useEffect, useState } from "react";
import { awaitSocket, useSocket } from "../services/sockets";

let cachedTurn: string | undefined;

awaitSocket().then((io) => {
  io.on("turn", (id: string) => {
    console.log(`It's ${id}'s turn`);
    cachedTurn = id;
  });
});

export function useTurn(): string | undefined {
  const io = useSocket();
  const [turn, setTurn] = useState<string | undefined>(cachedTurn);
  useEffect(() => {
    if (!io) {
      return;
    }
    io.on("turn", (id: string) => {
      setTurn(id);
    });
    () => {
      io.off("turn");
    };
  }, [setTurn, io]);
  return turn;
}
