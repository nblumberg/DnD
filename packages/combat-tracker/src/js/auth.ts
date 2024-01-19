import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

type Credentials = Omit<
  TokenResponse,
  "error" | "error_description" | "error_uri"
>;
export interface Profile {
  email: string;
  family_name: string;
  given_name: string;
  id: string;
  locale: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

const storageKey = "user";

const storageStr = localStorage.getItem(storageKey);

let credentials: Credentials | undefined;
let profile: Profile | undefined = storageStr
  ? (JSON.parse(storageStr) as Profile)
  : undefined;

let loginPromise: Promise<Profile>;
let resolveLogin: (profile: Profile) => void | undefined;
if (profile) {
  loginPromise = Promise.resolve(profile);
} else {
  loginPromise = new Promise<Profile>((resolve) => {
    resolveLogin = resolve;
  });
}

export function awaitLogin(): Promise<Profile> {
  return loginPromise;
}

export function useLogin(): { login: () => void; user?: Profile } {
  const [creds, setCreds] = useState<Credentials | undefined>(credentials);
  const [user, setUser] = useState<Profile | undefined>(profile);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setCreds(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (!creds || profile) {
      return;
    }
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${creds.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${creds.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        const user = res.data as Profile;
        if (resolveLogin) {
          resolveLogin(user);
        }
        setUser(user);
        localStorage.setItem(storageKey, JSON.stringify(user));
      })
      .catch((err) => console.log(err));
  }, [creds]);

  return { login, user };
}

export function logout(): void {
  localStorage.removeItem(storageKey);
  window.location.reload();
}

const knownUsers = [
  "nathanielblumberg@gmail.com",
  "aryooki@gmail.com",
  "aweditandwrite@gmail.com",
  "april.maguire@gmail.com",
  "joaquinmercardo@gmail.com",
  "TMustacchio@gmail.com",
  "willhonley@gmail.com",
] as const;

const userToCharacter: Record<(typeof knownUsers)[number], string[]> = {
  "nathanielblumberg@gmail.com": ["dm"],
  "aryooki@gmail.com": ["Harrow_Zinvaris"],
  "aweditandwrite@gmail.com": ["Harrow_Zinvaris"],
  "april.maguire@gmail.com": ["Rhiannon_Frey"],
  "joaquinmercardo@gmail.com": ["Throne"],
  "TMustacchio@gmail.com": ["Nacho_Chessier"],
  "willhonley@gmail.com": ["John_Rambo_McClane"],
} as const;

export const IdentityContext = createContext<Profile>({
  email: "NA",
  family_name: "NA",
  given_name: "NA",
  id: "NA",
  locale: "NA",
  name: "NA",
  picture: "NA",
  verified_email: false,
});

export function emailToCharacters(email: string): string[] {
  return userToCharacter[email as keyof typeof userToCharacter] ?? [];
}

export function useCharacters(): string[] {
  const { email } = useContext(IdentityContext);
  return emailToCharacters(email);
}

export function useIsDM(): boolean {
  return useCharacters().includes("dm");
}
