import { SyntheticEvent, useState } from "react";
import styled, { css } from "styled-components";
import { Actor } from "../data/Actor";
import { PCs } from "../data/Character";
import { useMonsters } from "../data/monsters";

const colorScheme = `
  background: black;
  border-color: gray;
  color: white;
`;

const Dialog = styled.dialog`
  ${colorScheme}
  border-radius: 5px;
  border-style: solid;
  border-width: 2px;
  bottom: 0;
  height: 90vh;
  left: 20vw;
  position: fixed;
  right: 20vw;
  width: 60vw;
  top: 0;
`;

const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

const DialogBody = styled.form`
  display: flex;
  flex-grow: 100;
  justify-content: space-between;
`;

const ActorList = styled.select`
  ${colorScheme}
  height: 100%;
  width: 48%;
`;

const Option = styled.option<{ unique?: boolean }>`
  ${({ unique = false }) =>
    unique &&
    css`
      color: green;
    `}
`;

const DialogFooter = styled.footer`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 1em;
`;

const Button = styled.button`
  background: blue;
  border-radius: 3px;
  border: 2px solid gray;
  color: white;
  padding: 0.25em 1em;
`;

function actorToOption({ name, id, unique: pc }: Actor) {
  return (
    <Option unique={pc} key={id} value={id}>
      {name}
    </Option>
  );
}

function sortActors(a: Actor, b: Actor): number {
  if (a.name === b.name) {
    return 0;
  } else if (a.name < b.name) {
    return -1;
  }
  return 1;
}

function changeSelection(
  add: boolean,
  actors: Actor[],
  selected: Actor[],
  event: SyntheticEvent
): { unselectedActors: Actor[]; selectedActors: Actor[] } {
  if (!event.target) {
    return { unselectedActors: actors, selectedActors: selected };
  }
  const select = event.target as HTMLSelectElement;
  const ids = Array.prototype.map.call(
    select.selectedOptions,
    ({ value }: HTMLOptionElement) => value
  );
  if (!ids.length) {
    return { unselectedActors: actors, selectedActors: selected };
  }
  const unselectedActors: Set<Actor> = new Set([...(add ? [] : actors)]);
  const selectedActors: Set<Actor> = new Set([...(add ? selected : [])]);
  (add ? actors : selected).forEach((actor) => {
    if (add) {
      if (ids.includes(actor.id)) {
        selectedActors.add(actor);
        if (!actor.unique) {
          unselectedActors.add(actor);
        }
      } else {
        unselectedActors.add(actor);
      }
    } else {
      if (ids.includes(actor.id)) {
        unselectedActors.add(actor);
      } else {
        selectedActors.add(actor);
        if (!actor.unique) {
          unselectedActors.add(actor);
        }
      }
    }
  });
  return {
    unselectedActors: Array.from(unselectedActors.values()).sort(sortActors),
    selectedActors: Array.from(selectedActors.values()).sort(sortActors),
  };
}

type Callback = (results: Actor[]) => void;

export function ActorPicker({
  active,
  onChange,
}: {
  active: Actor[];
  onChange: Callback;
}) {
  const [actors, setActors] = useState<Actor[]>(
    [...PCs, ...useMonsters()].sort(sortActors)
  );
  const [selected, setSelected] = useState<Actor[]>([...active]);
  const allOptions = actors.map(actorToOption);
  const selectedOptions = selected.map(actorToOption);

  const addOrRemove = (add: boolean, event: SyntheticEvent) => {
    const { unselectedActors, selectedActors } = changeSelection(
      add,
      actors,
      selected,
      event
    );
    setActors(unselectedActors);
    setSelected(selectedActors);
  };
  const add = (event: SyntheticEvent) => addOrRemove(true, event);
  const remove = (event: SyntheticEvent) => addOrRemove(false, event);

  const submit = () => {
    onChange(selected);
  };

  return (
    <Dialog open>
      <DialogContent>
        <DialogBody method="dialog">
          <ActorList multiple onChange={add}>
            {allOptions}
          </ActorList>
          <ActorList multiple onChange={remove}>
            {selectedOptions}
          </ActorList>
        </DialogBody>
        <DialogFooter>
          <Button onClick={submit}>
            Update active characters and creatures
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ActorPickerButton({ addActors }: { addActors: () => void }) {
  return <button onClick={addActors}>Add characters and creatures</button>;
}
