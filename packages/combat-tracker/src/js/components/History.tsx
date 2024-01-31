import { ChangeEvent } from "packages/state-change/dist/js/molecular/event";
import { useEffect, useState } from "react";
import { Roll, RollHistory } from "roll";
import { IChangeEvent, parseChangeables } from "state-change";
import styled from "styled-components";
import { useHistory } from "../data/history";
import { useSocket } from "../services/sockets";
import { InteractiveRoll } from "./InteractiveRoll";

const Panel = styled.section`
  text-align: left;
`;

export function History() {
  const [change, setChange] = useState<ChangeEvent | undefined>();
  const [rollOpen, setRollOpen] = useState(false);
  const [rolls, setRolls] = useState<Array<{ roll: Roll; label?: string }>>([]);

  const history = useHistory();
  const io = useSocket();

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

  const events = history.length ? (
    <ol>
      {history.map((entry) => {
        let { literals, changeables } = parseChangeables(entry.display(true));
        let content: JSX.Element[] = [];
        let i = 0;
        while (literals.length + changeables.length) {
          if (i % 2 === 0) {
            const literal = literals.shift();
            if (literal) {
              content.push(<span>{literal}</span>);
            }
          } else {
            const changeable = changeables.shift();
            if (changeable) {
              const { attributes, innerText } = changeable;
              content.push(
                <a
                  href="javascript:void(0)"
                  data-changeable={entry.id}
                  {...attributes}
                >
                  {innerText}
                </a>
              );
            }
          }
          i++;
        }
        return <li key={entry.id}>{content}</li>;
      })}
    </ol>
  ) : (
    <p>Nothing yet</p>
  );
  return (
    <Panel>
      <h2>History</h2>
      {events}
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
