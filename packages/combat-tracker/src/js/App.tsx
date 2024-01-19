import { Login } from "./Login";
import { IdentityContext, useLogin } from "./auth";
import { Header } from "./components/Header";
import { TurnOrder } from "./components/TurnOrder";
import { useSocket } from "./services/sockets";

export function App() {
  const { login, user } = useLogin();

  if (!user) {
    return <Login login={login} />;
  }

  if (!useSocket()) {
    return <div>Loading...</div>;
  }

  return (
    <IdentityContext.Provider value={user}>
      <Header />
      <TurnOrder></TurnOrder>
    </IdentityContext.Provider>
  );
}
