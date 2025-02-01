import { createContext } from "react";
import { Board } from "../board";

export const BoardContext = createContext<Board>(new Board());
