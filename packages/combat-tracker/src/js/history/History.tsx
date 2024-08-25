import {
  SyntheticEvent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Roll, RollHistory } from "roll";
import {
  ChangeEvent,
  History,
  IChangeEvent,
  parseChangeables,
} from "state-change";
import styled from "styled-components";
import { useSocket } from "../app/api/sockets";
import { useIsDM } from "../app/store";
import { useAppState } from "../app/store/state";
import { InteractiveRollContext } from "../components/InteractiveRoll";

const Panel = styled.section`
  text-align: left;
`;
const Changeable = styled.a`
  color: blue;
  font-weight: bold;
`;
const Undone = styled.li`
  font-style: strikethrough;
`;

function isUndone(undoneHistory: History, event: ChangeEvent): boolean {
  return undoneHistory.events.some((entry) => entry.id === event.id);
}

function Round({
  round,
  roundNumber,
  isOpen,
  expandCollapse,
  changeableClick,
  history,
  undoneHistory,
}: {
  round: ChangeEvent[];
  roundNumber: number;
  isOpen: boolean;
  expandCollapse: () => void;
  changeableClick: (event: SyntheticEvent) => void;
  history: History;
  undoneHistory: History;
}) {
  let events = null;
  if (isOpen) {
    events = round.map((entry) => {
      let { literals, changeables } = parseChangeables(
        entry.display(history, true)
      );
      let content: JSX.Element[] = [];
      let i = 0;
      while (literals.length + changeables.length) {
        if (i % 2 === 0) {
          const literal = literals.shift();
          if (literal) {
            content.push(<span key={i}>{literal}</span>);
          }
        } else {
          const changeable = changeables.shift();
          if (changeable) {
            const { attributes, innerText } = changeable;
            content.push(
              <Changeable
                key={i}
                href=""
                onClick={changeableClick}
                data-changeable={entry.id}
                {...attributes}
              >
                {innerText}
              </Changeable>
            );
          }
        }
        i++;
      }

      const undone = isUndone(undoneHistory, entry);
      return undone ? (
        <Undone key={entry.id} data-event-id={entry.id}>
          {content}
        </Undone>
      ) : (
        <li key={entry.id} data-event-id={entry.id}>
          {content}
        </li>
      );
    });
  }

  return (
    <li key={roundNumber} data-round={roundNumber}>
      <p onClick={expandCollapse}>
        Round {roundNumber}&nbsp;
        {!isOpen ? "↘️" : null}
      </p>
      {events ? <ol>{events}</ol> : null}
    </li>
  );
}

export function History() {
  const [{ events, changes, undoneHistory }] = useAppState();
  const io = useSocket();
  const dm = useIsDM();
  const [roundsOpen, setRoundsOpen] = useState<boolean[]>([true]);
  const [change, setChange] = useState<ChangeEvent | undefined>();
  const interactiveRoll = useContext(InteractiveRollContext);

  const history = { events, changes };

  const changeableClick = (event: SyntheticEvent) => {
    event.preventDefault();
    if (!dm) {
      alert((event.target as HTMLAnchorElement).title);
    }
  };

  const onRoll = (result: RollHistory[]) => {
    if (!io) {
      throw new Error("Socket not available");
    }
    if (!change) {
      throw new Error("Unknown change");
    }
    io.emit("changeHistory", change.id, result[0]);
    setChange(undefined);
  };

  useEffect(() => {
    if (!io) {
      return;
    }
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.dataset.changeable) {
        return;
      }
      const id = target.dataset.changeable;
      const type: string | undefined = target.dataset.type;
      const change: IChangeEvent | undefined = events.find(
        (entry) => entry.id === id
      );
      if (!change) {
        throw new Error(`Changeable with id ${id} not found`);
      }
      if (type === "Roll") {
        const roll = new Roll(target.dataset.roll ?? "1d20");
        setChange(change as ChangeEvent);
        interactiveRoll.open("Change roll", [{ roll }], onRoll);
      }
    };
    window.document.addEventListener("click", handler);
    return () => {
      window.document.removeEventListener("click", handler);
    };
  }, [events, io]);

  const rounds: ChangeEvent[][] = [[]];
  let [currentRound] = rounds;
  [...events, ...undoneHistory.events].forEach((entry) => {
    if (entry.type === "ChangeRound") {
      currentRound = [];
      rounds.push(currentRound);
    } else {
      currentRound.push(entry);
    }
  });
  if (roundsOpen.length !== rounds.length) {
    const tmpRounds = new Array(rounds.length - 1);
    tmpRounds.fill(false);
    tmpRounds.push(true);
    setRoundsOpen(tmpRounds);
  }

  const expandCollapse = (roundNumber: number) => {
    setRoundsOpen(
      roundsOpen.map((open, i) => (i === roundNumber ? !open : open))
    );
  };

  const roundContent = useMemo(
    () =>
      rounds.map((round, i) => {
        const roundNumber = i + 1;
        const isOpen = roundsOpen[i];

        return (
          <Round
            key={roundNumber}
            round={round}
            roundNumber={roundNumber}
            isOpen={isOpen}
            expandCollapse={() => expandCollapse(i)}
            changeableClick={changeableClick}
            history={history}
            undoneHistory={undoneHistory}
          />
        );
      }),
    [roundsOpen, events]
  );
  const content = events.length ? <ol>{roundContent}</ol> : <p>Nothing yet</p>;
  return (
    <Panel>
      <h2>History</h2>
      {content}
    </Panel>
  );
}
