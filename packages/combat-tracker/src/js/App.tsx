import { useState } from "react";
import { Provider } from "react-redux";
import { ActorPicker } from "./components/ActorPicker";
import { Header } from "./components/Header";
import { TurnOrder } from "./components/TurnOrder";
import { store } from "./store";

export function App() {
  const [actorPickerOpen, setActorPickerOpen] = useState<boolean>(false);

  function pickActors() {
    setActorPickerOpen(true);
  }

  function closeActorPicker() {
    setActorPickerOpen(false);
    (document.activeElement as HTMLElement)?.blur();
  }

  return (
    <Provider store={store}>
      <Header pickActors={pickActors}></Header>
      <TurnOrder></TurnOrder>
      {actorPickerOpen && (
        <ActorPicker onClose={closeActorPicker}></ActorPicker>
      )}
    </Provider>
  );
}
