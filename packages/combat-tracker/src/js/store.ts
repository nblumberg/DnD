import { configureStore } from "@reduxjs/toolkit";
import { castMembers } from "./features/castMember/castMembers";
import { creatures } from "./features/creature/creatures";

export const store = configureStore({
  reducer: {
    castMembers,
    creatures,
  },
});
