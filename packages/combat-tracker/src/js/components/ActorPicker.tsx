import { Actor, Auditioner, CastMember } from "creature";
import { SyntheticEvent, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Character } from "../data/Character";
import { useActors } from "../data/actors";
import { useCastMembers } from "../data/castMembers";
import { useSocket } from "../services/sockets";
import { Dialog, DialogButton } from "./Dialog";

const colorScheme = `
  background: black;
  border-color: gray;
  color: white;
`;

// const Dialog = styled.dialog`
//   ${colorScheme}
//   border-radius: 5px;
//   border-style: solid;
//   border-width: 2px;
//   bottom: 0;
//   height: 90vh;
//   left: 20vw;
//   position: fixed;
//   right: 20vw;
//   width: 60vw;
//   top: 0;
// `;

// const DialogContent = styled.div`
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   justify-content: space-between;
// `;

// const DialogBody = styled.form`
//   align-items: stretch;
//   display: flex;
//   flex-grow: 100;
//   justify-content: space-between;
// `;

const ActorPanel = styled.div`
  align-items: stretch;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const SearchBar = styled.input`
  ${colorScheme}
  display: block;
  flex-grow: 0;
  width: 100%;
`;

const ActorList = styled.select`
  ${colorScheme}
  flex-grow: 100;
`;

const CastList = styled.select`
  ${colorScheme}
  flex-grow: 1;
`;

const Option = styled.option<{ $unique?: boolean }>`
  ${({ $unique = false }) =>
    $unique &&
    css`
      color: green;
    `}
`;

// const DialogFooter = styled.footer`
//   display: flex;
//   align-items: flex-end;
//   justify-content: flex-end;
//   margin-top: 1em;
// `;

// const Button = styled.button`
//   background: blue;
//   border-radius: 3px;
//   border: 2px solid gray;
//   color: white;
//   padding: 0.25em 1em;
// `;

function actorToOption({ name, id, unique: pc }: Actor) {
  return (
    <Option $unique={pc} key={id} value={id}>
      {name}
    </Option>
  );
}

function auditionerToOption({
  nickname,
  name,
  id,
  unique,
  actor,
}: CastMember | Auditioner) {
  const attributes: {
    key: string;
    value: string;
    $unique?: boolean;
    "data-actor-id"?: string;
    "data-castmember-id"?: string;
  } = { key: id, value: id, $unique: unique };
  if (actor) {
    attributes["data-castmember-id"] = id;
    attributes["data-actor-id"] = actor.id;
  } else {
    attributes["data-actor-id"] = id;
  }
  return (
    <Option {...attributes}>
      {nickname ?? ""}
      {nickname ? " (" : ""}
      {name}
      {nickname ? ")" : ""}
    </Option>
  );
}

function findOrThrow<T extends { id: string }>(
  id: string,
  array: T[],
  itemType: string
): T {
  const match = array.find((item) => item.id === id);
  if (!match) {
    throw new Error(`Failed to find ${itemType} with id ${id}`);
  }
  return match;
}

function findUniqueId(
  id: string,
  castMembers: Record<string, { id: string }>
): string {
  if (id && !castMembers[id]) {
    return id;
  }

  const originalId = id;
  let nextId = originalId;
  let i = 2;
  while (castMembers[nextId]) {
    nextId = `${originalId}_${i++}`;
  }
  return nextId;
}

function getSelectedIds(event: SyntheticEvent): string[] {
  const select = event.target as HTMLSelectElement;
  const ids = Array.prototype.map.call(
    select.selectedOptions ?? [],
    ({ value }: HTMLOptionElement) => value
  ) as string[];
  // Wait slightly to deselect to allow double-click to work
  setTimeout(() => {
    select.selectedIndex = -1;
  }, 100);
  return ids;
}

function audition(
  auditioners: Array<CastMember | Auditioner>,
  actors: Actor[]
): Array<CastMember | Auditioner> {
  const map = auditioners.reduce(
    (map, auditioner) => ({ ...map, [auditioner.id]: auditioner }),
    {} as Record<string, CastMember | Auditioner>
  );
  const newAuditioners: Array<CastMember | Auditioner> = [...auditioners];
  actors.forEach((actor) => {
    const id = findUniqueId(actor.id, map);
    const auditioner: Auditioner = {
      ...actor,
      id,
      actor,
      character: actor instanceof Character,
    };
    newAuditioners.push(auditioner);
  });
  return newAuditioners.sort(sortAuditioners);
}

function sortAuditioners(
  a: CastMember | Auditioner,
  b: CastMember | Auditioner
): number {
  const actorA = "actor" in a && a.actor ? a.actor : (a as CastMember);
  const actorB = "actor" in b && b.actor ? b.actor : (b as CastMember);
  if (actorA.unique && !actorB.unique) {
    return -1;
  } else if (!actorA.unique && actorB.unique) {
    return 1;
  } else if (a.name === b.name) {
    return 0;
  } else if (a.name < b.name) {
    return -1;
  }
  return 1;
}

export function ActorPicker({ onClose }: { onClose: () => void }) {
  const actors = useActors();
  const castMembers = useCastMembers();

  const [auditioners, setAuditioners] = useState<
    Array<CastMember | Auditioner>
  >(Object.values(castMembers));

  useEffect(() => {
    setAuditioners(Object.values(castMembers));
  }, [castMembers]);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const filterActors = (value: string, actorsToFilter = actors): Actor[] => {
    const visibleHeadShots = actorsToFilter.filter(
      ({ name, id: actorId, unique }) =>
        name.includes(value) &&
        (!unique || !auditioners.find(({ id }) => id === actorId))
    );
    return visibleHeadShots;
  };

  const headShots = filterActors(searchTerm);

  const headshotOptions = headShots.map(actorToOption);
  const auditionerOptions = auditioners.map(auditionerToOption);

  const onSearch = (event: SyntheticEvent) => {
    const { value } = event.target as HTMLInputElement;
    setSearchTerm(value);
  };

  const add = (event: SyntheticEvent) => {
    const actorIds = getSelectedIds(event);
    const selectedHeadshots: Actor[] = actorIds.map((id) =>
      findOrThrow(id, actors, "Actor")
    );
    setAuditioners(audition(auditioners, selectedHeadshots));
  };

  const remove = (event: SyntheticEvent) => {
    const auditionerIds = getSelectedIds(event);
    const newAuditioners = auditioners.filter(
      ({ id }) => !auditionerIds.includes(id)
    );
    setAuditioners(newAuditioners);
  };

  const io = useSocket();

  const submit = async () => {
    const toBeCast = auditioners.filter(
      (auditioner) => !(auditioner instanceof CastMember)
    ) as Auditioner[];
    const toBeFired = Object.values(castMembers).filter(
      (castMember) => !auditioners.includes(castMember)
    );
    if (toBeCast.length) {
      io?.emit("castActors", toBeCast);
    }
    if (toBeFired.length) {
      io?.emit(
        "fireActors",
        toBeFired.map(({ id }) => id)
      );
    }
    onClose();
  };

  const addAndSubmit = (event: SyntheticEvent) => {
    add(event);
    submit();
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        submit();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [auditioners]);

  if (!io) {
    return null;
  }

  return (
    <Dialog
      title="Add actors"
      onClose={onClose}
      buttons={
        <>
          <DialogButton onClick={submit}>
            Update active characters and creatures
          </DialogButton>
        </>
      }
    >
      <>
        <ActorPanel>
          <SearchBar
            placeholder="Search"
            onKeyDown={onSearch}
            onChange={onSearch}
            value={searchTerm}
          ></SearchBar>
          <ActorList multiple onChange={add} onDoubleClick={addAndSubmit}>
            {headshotOptions}
          </ActorList>
        </ActorPanel>
        <CastList multiple onChange={remove}>
          {auditionerOptions}
        </CastList>
      </>
    </Dialog>
  );
}

export function ActorPickerButton({
  addActors,
  label = "Add characters and creatures",
  title = "Add characters and creatures",
}: {
  addActors: () => void;
  label?: string;
  title?: string;
}) {
  return (
    <button title={title} onClick={addActors}>
      {label}
    </button>
  );
}
