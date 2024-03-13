import { CastMember } from "creature";
import { History } from "state-change";
import { View } from "../constants/view";
import { checkMobile } from "../utils/checkMobile";
import { getStoredAuth } from "../utils/storedAuth";
import { ActorInstance } from "./Actor";
import { Credentials, Profile } from "./auth";

export interface State extends History {
  credentials?: Credentials;
  user?: Profile;

  undoneHistory: History;

  actors: ActorInstance[];
  castMembers: CastMember[];

  isMobile: boolean;
  view: View;
}

const isMobile = checkMobile();

export const defaultState: State = {
  ...getStoredAuth(),

  undoneHistory: { events: [], changes: [] },

  actors: [],
  castMembers: [],

  events: [],
  changes: [],

  isMobile,
  view: isMobile ? "turnOrder" : "both",
};
