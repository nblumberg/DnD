import { Id } from "./ids";

// TODO
export interface ChatMessage {
  type: string;
  content: string;
  playerid: Id;
  who: string;
  rolltemplate?: string;
  [key: string]: unknown;
}
