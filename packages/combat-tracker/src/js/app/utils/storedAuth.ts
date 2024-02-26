import { Credentials, Profile } from "../types";

const storageKeyCredentials = "credentials";
const storageKeyUser = "user";

export function getStoredAuth(): { credentials?: Credentials; user?: Profile } {
  let storageStr = localStorage.getItem(storageKeyCredentials);
  const credentials: Credentials | undefined = storageStr
    ? JSON.parse(storageStr)
    : undefined;
  storageStr = localStorage.getItem(storageKeyUser);
  const user: Profile | undefined = storageStr
    ? (JSON.parse(storageStr) as Profile)
    : undefined;
  return { credentials, user };
}

export function setStoredAuth({
  credentials,
  user,
}: {
  credentials?: Credentials;
  user?: Profile;
}): void {
  if (credentials) {
    localStorage.setItem(storageKeyCredentials, JSON.stringify(credentials));
  }
  if (user) {
    localStorage.setItem(storageKeyUser, JSON.stringify(user));
  }
}

export function clearStoredAuth(): void {
  localStorage.removeItem(storageKeyCredentials);
  localStorage.removeItem(storageKeyUser);
}
