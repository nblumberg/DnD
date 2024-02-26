import { CastMember } from "creature";
import { HistoryEntry, IChangeEvent } from "state-change";
import { View } from "../constants/view";
import { checkMobile } from "../utils/checkMobile";
import { getStoredAuth } from "../utils/storedAuth";
import { ActorInstance } from "./Actor";
import { Credentials, Profile } from "./auth";

export interface State {
  credentials?: Credentials;
  user?: Profile;

  actors: ActorInstance[];
  castMembers: CastMember[];

  history: IChangeEvent[];
  changes: HistoryEntry<CastMember>[];

  isMobile: boolean;
  view: View;
}

const isMobile = checkMobile();

export const defaultState: State = {
  ...getStoredAuth(),

  actors: [],
  castMembers: [],

  history: [],
  changes: [],

  isMobile,
  view: isMobile ? "turnOrder" : "both",
};
