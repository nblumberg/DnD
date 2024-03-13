import { CastMember } from "creature";
import { ChangeEvent } from ".";
import { ChangeHistory } from "../change";
import { Unique } from "../util/unique";

export interface IChangeEvent extends Unique {
  type: string;
  castMemberId: string;
  changes: string[];
}

export interface History extends ChangeHistory<CastMember> {
  events: ChangeEvent[];
}

export interface ChangeEventParams extends Partial<IChangeEvent> {
  type?: string;
  castMemberId: string;
  history: History;
  historyChange?: (history: History) => void;
}

export type CastMembers = Record<string, CastMember>;

export interface HistoryAndCastMembers extends History {
  castMembers: CastMembers;
}
