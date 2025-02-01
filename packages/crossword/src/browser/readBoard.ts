import { ActiveWord, Board } from "../board";

declare global {
  interface Window {
    data: ActiveWord[];
  }
}

export function readBoard(): Board {
  const board = new Board();
  board.deserialize(window.data);
  return board;
}
