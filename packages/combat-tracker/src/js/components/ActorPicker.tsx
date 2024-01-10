import { SyntheticEvent, useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import styled, { css } from "styled-components";
import { Actor } from "../data/Actor";
import { useActors } from "../data/actors";
import { CastMember } from "../data/castMembers";
import {
  castActors,
  findUniqueId,
  removeCastMember,
  selectCastMembers,
} from "../features/castMember/castMembers";

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
  align-items: stretch;
  display: flex;
  flex-grow: 100;
  justify-content: space-between;
`;

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
    <Option $unique={pc} key={id} value={id}>
      {name}
    </Option>
  );
}

interface Auditioner extends Actor {
  id: string;
  name: string;
  nickname?: string;
  actor?: Actor;
}

function auditionerToOption({ nickname, name, id, unique, actor }: Auditioner) {
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

// async function changeSelection(
//   add: boolean,
//   actors: Actor[],
//   castMembers: Record<string, CastMember>,
//   selected: CastMember[],
//   event: SyntheticEvent
// ): Promise<{ unselectedActors: Actor[]; selectedActors: CastMember[] }> {
//   if (!event.target) {
//     return { unselectedActors: actors, selectedActors: selected };
//   }
//   const select = event.target as HTMLSelectElement;
//   const ids = Array.prototype.map.call(
//     select.selectedOptions,
//     ({ value }: HTMLOptionElement) => value
//   ) as string[];
//   if (!ids.length) {
//     return { unselectedActors: actors, selectedActors: selected };
//   }
//   const targetActors: Actor[] = ids.map((id) => {
//     const match = actors.find((actor) => actor.id === id);
//     if (!match) {
//       throw new Error(`Couldn't find Actor ${id}`);
//     }
//     return match;
//   });
//   if (add) {
//     await castActors(targetActors);
//   } else {
//     fireActors(targetActors);
//   }

//   const unselectedActors: Set<Actor> = new Set([...actors]);
//   const selectedCastMembers: Set<CastMember> = new Set([...selected]);

//   for (const id of ids) {
//     if (add) {
//       const actor = actors.find(({ id: target }) => target === id);
//       if (!actor) {
//         throw new Error(`Failed to find Actor ${id}`);
//       }
//       if (actor.unique) {
//         const castMembers = checkCast(actor);
//         if (castMembers.length) {
//           selectedCastMembers.add(castMembers[0]);
//         } else {
//           selectedCastMembers.add(await castActor(actor));
//         }
//         unselectedActors.delete(actor);
//       } else {
//         // Non-unique creatures stay in the unselected list and produce copies on subsequent selections
//         selectedCastMembers.add(await castActor(actor));
//       }
//     } else {
//       const castMember = getCastMember(id);
//       if (castMember) {
//         fireCastMember(id);
//         selectedCastMembers.delete(castMember);
//       } else {
//         throw new Error(`Failed to find CastMember ${id}`);
//       }
//     }
//   }
//   for (const castMember of selectedCastMembers.values()) {
//     if (castMember.actor.unique) {
//       unselectedActors.delete(castMember.actor);
//     }
//   }

//   return {
//     unselectedActors: Array.from(unselectedActors.values()).sort(sortActors),
//     selectedActors: Array.from(selectedCastMembers.values()).sort(sortActors),
//   };
// }

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

function getSelectedIds(event: SyntheticEvent): string[] {
  const select = event.target as HTMLSelectElement;
  const ids = Array.prototype.map.call(
    select.selectedOptions,
    ({ value }: HTMLOptionElement) => value
  ) as string[];
  select.selectedIndex = -1;
  return ids;
}

function audition(auditioners: Auditioner[], actors: Actor[]): Auditioner[] {
  const map = auditioners.reduce(
    (map, auditioner) => ({ ...map, [auditioner.id]: auditioner }),
    {} as Record<string, Auditioner>
  );
  const newAuditioners: Auditioner[] = [...auditioners];
  actors.forEach((actor) => {
    const { id } = findUniqueId(actor.id, map);
    const auditioner: Auditioner = { ...actor, id, actor };
    newAuditioners.push(auditioner);
  });
  return newAuditioners.sort(sortAuditioners);
}

function sortAuditioners(a: Actor | Auditioner, b: Actor | Auditioner): number {
  const actorA = "actor" in a && a.actor ? a.actor : (a as Actor);
  const actorB = "actor" in b && b.actor ? b.actor : (b as Actor);
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
  const dispatch = useDispatch();
  const { getState } = useStore();

  const actors = useActors();

  const castMembers = useSelector(selectCastMembers);
  const [auditioners, setAuditioners] = useState<Auditioner[]>(
    Object.values(castMembers)
  );

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

  // const addOrRemove = async (add: boolean, event: SyntheticEvent) => {
  //   const { unselectedActors, selectedActors } = await changeSelection(
  //     add,
  //     actors,
  //     castMembers,
  //     auditioners,
  //     event
  //   );
  //   (event.target as HTMLSelectElement).selectedIndex = -1;
  //   setHeadShots(filterActors(searchTerm, unselectedActors));
  //   // setSelected(selectedActors);
  // };

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

  const submit = async () => {
    const toBeCast = auditioners
      .filter((auditioner) => !(auditioner instanceof CastMember))
      .map((auditioner) => auditioner.actor ?? (auditioner as Actor));
    const toBeFired = Object.values(castMembers).filter(
      (castMember) => !auditioners.includes(castMember)
    );
    if (toBeCast.length) {
      castActors(toBeCast)(dispatch, getState);
    }
    if (toBeFired.length) {
      toBeFired.forEach((castMember) => dispatch(removeCastMember(castMember)));
    }
    onClose();
  };

  const addAndSubmit = (event: SyntheticEvent) => {
    add(event);
    submit();
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Enter") {
        submit();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [auditioners]);

  return (
    <Dialog open>
      <DialogContent>
        <DialogBody method="dialog">
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
