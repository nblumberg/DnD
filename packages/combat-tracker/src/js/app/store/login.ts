import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect } from "react";
import { loginCredentials, loginUser, logout } from "../reducers";
import { Profile } from "../types";
import { awaitLogin } from "../utils/authPromise";
import { clearStoredAuth, setStoredAuth } from "../utils/storedAuth";
import { useAppState } from "./state";

export function useLogin(): { login: () => void; user?: Profile } {
  const [state, dispatch] = useAppState();
  const { credentials, user } = state;

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setStoredAuth({ credentials: codeResponse });
      loginCredentials(dispatch, codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (!credentials || user) {
      return;
    }
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${credentials.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${credentials.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        const user = res.data as Profile;
        setStoredAuth({ user });
        loginUser(dispatch, user);
        awaitLogin().resolve(user);
      })
      .catch((err) => console.log(err));
  }, [credentials]);

  return { login, user };
}

export function useLogout(): () => void {
  const [, dispatch] = useAppState();
  return () => {
    clearStoredAuth();
    logout(dispatch);
  };
}
