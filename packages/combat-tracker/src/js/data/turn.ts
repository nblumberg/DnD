import { useEffect, useState } from "react";
import { getSocket } from "../services/sockets";

let cachedTurn: string | undefined;

const io = getSocket();
io.on("turn", (id: string) => {
  console.log(`It's ${id}'s turn`);
  cachedTurn = id;
});

export function useTurn(): string | undefined {
  const [turn, setTurn] = useState<string | undefined>(cachedTurn);
  useEffect(() => {
    io.on("turn", (id: string) => {
      setTurn(id);
    });
    () => {
      io.off("turn");
    };
  }, [setTurn]);
  return turn;
}
