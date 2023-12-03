import { AsyncKey, createAsyncLock } from "./asyncLock.js";

export const displayLockKey: AsyncKey = {
  unlock: () => {}, // will be replaced by createAsyncLock()
};
export const displayLock = createAsyncLock();
