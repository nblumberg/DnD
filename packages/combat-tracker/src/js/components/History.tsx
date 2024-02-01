import { ChangeEvent } from "packages/state-change/dist/js/molecular/event";
import { SyntheticEvent, useEffect, useState } from "react";
import { Roll, RollHistory } from "roll";
import { IChangeEvent, parseChangeables } from "state-change";
import styled from "styled-components";
import { useIsDM } from "../auth";
import { useHistory } from "../data/history";
import { useSocket } from "../services/sockets";
import { InteractiveRoll } from "./InteractiveRoll";

const Panel = styled.section`
  text-align: left;
`;
const Changeable = styled.a`
  color: blue;
  font-weight: bold;
`;

export function History() {
  const history = useHistory();
  const io = useSocket();
  const dm = useIsDM();
  const [change, setChange] = useState<ChangeEvent | undefined>();
  const [rollOpen, setRollOpen] = useState(false);
  const [rolls, setRolls] = useState<Array<{ roll: Roll; label?: string }>>([]);

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
      const change: IChangeEvent | undefined = history.find(
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
  }, [history, io]);

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

  const rounds: IChangeEvent[][] = [[]];
  let [currentRound] = rounds;
  history.forEach((entry) => {
    if (entry.type === "ChangeRound") {
      currentRound = [];
      rounds.push(currentRound);
    } else {
      currentRound.push(entry);
    }
  });
  const roundContent = rounds.map((round, i) => {
    const events = round.map((entry) => {
      let { literals, changeables } = parseChangeables(entry.display(true));
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
    const roundNumber = i + 1;
    return (
      <li key={roundNumber}>
        <p>Round {roundNumber}</p>
        <ol>{events}</ol>
      </li>
    );
  });
  const content = history.length ? <ol>{roundContent}</ol> : <p>Nothing yet</p>;
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
