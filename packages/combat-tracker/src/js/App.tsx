import { SyntheticEvent, useState } from "react";
import { Login } from "./Login";
import { IdentityContext, useLogin } from "./auth";
import { ActorPicker } from "./components/ActorPicker";
import { Header } from "./components/Header";
import { TurnOrder } from "./components/TurnOrder";

export function App() {
  const { login, user } = useLogin();
  const [actorPickerOpen, setActorPickerOpen] = useState<boolean>(false);

  function pickActors(event: SyntheticEvent) {
    event.stopPropagation(); // don't let click that opens the dialog bubble up to the window and dismiss it
    setActorPickerOpen(true);
  }

  function closeActorPicker() {
    setActorPickerOpen(false);
    (document.activeElement as HTMLElement)?.blur();
  }

  if (!user) {
    return <Login login={login} />;
  }

  return (
    <IdentityContext.Provider value={user}>
      <Header pickActors={pickActors}></Header>
      <TurnOrder></TurnOrder>
      {actorPickerOpen && (
        <ActorPicker onClose={closeActorPicker}></ActorPicker>
      )}
    </IdentityContext.Provider>
  );
}
