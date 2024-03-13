import { SyntheticEvent, useEffect, useState } from "react";
import { Roll, RollHistory } from "roll";
import { ChangeEvent, IChangeEvent, parseChangeables } from "state-change";
import styled from "styled-components";
import { useSocket } from "../app/api/sockets";
import { useIsDM } from "../app/store";
import { useAppState } from "../app/store/state";
import { InteractiveRoll } from "../components/InteractiveRoll";

const Panel = styled.section`
  text-align: left;
`;
const Changeable = styled.a`
  color: blue;
  font-weight: bold;
`;

export function History() {
  const [{ events, changes }] = useAppState();
  const io = useSocket();
  const dm = useIsDM();
  const [roundsOpen, setRoundsOpen] = useState<boolean[]>([true]);
  const [change, setChange] = useState<ChangeEvent | undefined>();
  const [rollOpen, setRollOpen] = useState(false);
  const [rolls, setRolls] = useState<Array<{ roll: Roll; label?: string }>>([]);

  const history = { events, changes };

  const changeableClick = (event: SyntheticEvent) => {
    event.preventDefault();
    if (!dm) {
      alert((event.target as HTMLAnchorElement).title);
    }
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
        setRolls([{ roll }]);
        setRollOpen(true);
      }
    };
    window.document.addEventListener("click", handler);
    return () => {
      window.document.removeEventListener("click", handler);
    };
  }, [events, io]);

  const onRoll = (result: RollHistory[]) => {
    setRollOpen(false);
    if (!io) {
      throw new Error("Socket not available");
    }
    if (!change) {
      throw new Error("Unknown change");
    }
    io.emit("changeHistory", change.id, result[0]);
  };

  const onCancel = () => {
    setRollOpen(false);
  };

  const rounds: ChangeEvent[][] = [[]];
  let [currentRound] = rounds;
  events.forEach((entry) => {
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

  const roundContent = rounds.map((round, i) => {
    const roundNumber = i + 1;
    const isOpen = roundsOpen[i];

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
        return <li key={entry.id}>{content}</li>;
      });
    }

    return (
      <li key={roundNumber}>
        <p onClick={() => expandCollapse(i)}>
          Round {roundNumber}&nbsp;
          {!isOpen ? "↘️" : null}
        </p>
        {events ? <ol>{events}</ol> : null}
      </li>
    );
  });
  const content = events.length ? <ol>{roundContent}</ol> : <p>Nothing yet</p>;
  return (
    <Panel>
      <h2>History</h2>
      {content}
      {rollOpen && (
        <InteractiveRoll
          title="Change roll"
          rolls={rolls}
          onRoll={onRoll}
          onCancel={onCancel}
        />
      )}
    </Panel>
  );
}
