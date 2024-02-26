import { createContext, useEffect, useRef, useState } from "react";
import { Roll, RollHistory } from "roll";
import styled from "styled-components";
import { Dialog, DialogButton } from "./Dialog";

const InputField = styled.div`
  align-items: center;
  display: flex;
`;
const Input = styled.input<{ $error?: boolean }>`
  ${({ $error }) => ($error ? "border: 2px solid red;" : "")}
  display: block;
  flex-grow: 100;
  font-size: 1.5em;
  height: 1.5em;
  margin: 1em auto;
`;

export interface InteractiveRollAPI {
  open: (
    title: string,
    rolls: Array<{ roll: Roll; label?: string }>,
    onRoll: (result: RollHistory[]) => void,
    onCancel?: () => void
  ) => void;
}

export const InteractiveRollContext = createContext<InteractiveRollAPI>({
  open: () => {},
});

export function useInteractiveRoll(): {
  jsx: React.ReactNode;
  context: InteractiveRollAPI;
} {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("What's your roll?");
  const [rolls, setRolls] = useState<Array<{ roll: Roll; label?: string }>>([]);
  const [onRoll, setOnRoll] = useState<{ fn: (result: RollHistory[]) => void }>(
    { fn: () => {} }
  );
  const [onCancel, setOnCancel] = useState<{ fn: () => void }>({
    fn: () => {},
  });

  const context: InteractiveRollAPI = {
    open: (title, rolls, onRoll, onCancel = () => setOpen(false)) => {
      setTitle(title);
      setRolls(rolls);
      setOnRoll({
        fn: (result: RollHistory[]) => {
          setOpen(false);
          onRoll(result);
        },
      });
      setOnCancel({ fn: onCancel });
      setOpen(true);
    },
  };

  const jsx = open && (
    <InteractiveRoll
      title={title}
      rolls={rolls}
      onRoll={onRoll.fn}
      onCancel={onCancel.fn}
    />
  );

  return {
    jsx,
    context,
  };
}

export function InteractiveRoll({
  title,
  rolls,
  onRoll,
  onCancel,
}: {
  title: string;
  rolls: Array<{ roll: Roll; label?: string }>;
  onRoll: (result: RollHistory[]) => void;
  onCancel?: () => void;
}) {
  const [result, setResult] = useState<RollHistory[]>(new Array(rolls.length));

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref.current]);

  const autoRoll = () => {
    const newResult = rolls.map(({ roll }) => {
      roll.roll();
      return roll.getLastRoll();
    });
    setResult(newResult);
  };

  const submit = () => {
    if (result.length !== rolls.length || result.some((r) => !r)) {
      return;
    }
    onRoll(result);
  };

  const inputs = rolls.map(({ roll, label }, index) => (
    <InputField key={index}>
      {label && <label>{label}</label>}
      <Input
        type="number"
        onChange={(event) => {
          const newResult = [...result];
          const total = parseInt(event.target.value, 10);
          rolls[index].roll.add(total);
          newResult[index] = rolls[index].roll.getLastRoll();
          setResult(newResult);
        }}
        min={roll.min()}
        max={roll.max()}
        value={result[index]?.total ?? ""}
        ref={index === 0 ? ref : undefined}
      />
    </InputField>
  ));

  return (
    <Dialog
      title={title}
      onClose={onCancel}
      buttons={
        <>
          <DialogButton onClick={autoRoll}>Roll for me 🎲</DialogButton>
          <DialogButton onClick={submit}>Submit manual roll</DialogButton>
        </>
      }
    >
      <>{inputs}</>
    </Dialog>
  );
}
