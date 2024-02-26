import { Profile } from "../types";
import { getStoredAuth } from "./storedAuth";

type Deferred<T> = Promise<T> & { resolve: (value: T) => void };

let loginPromise: Deferred<Profile>;
let resolveLogin: (user: Profile) => void | undefined;
function initializeLoginPromise(): void {
  const { user } = getStoredAuth();
  if (user) {
    loginPromise = Promise.resolve(user) as Deferred<Profile>;
    loginPromise.resolve = () => {};
  } else {
    loginPromise = new Promise<Profile>((resolve) => {
      resolveLogin = resolve;
    }) as Deferred<Profile>;
    loginPromise.resolve = resolveLogin;
  }
}
initializeLoginPromise();

export function awaitLogin(): Deferred<Profile> {
  return loginPromise;
}
