import { useEffect, useRef, useState } from "react";
import { Roll } from "roll";
import styled from "styled-components";
import { Dialog, DialogButton } from "./Dialog";

const Input = styled.input<{ $error?: boolean }>`
  ${({ $error }) => ($error ? "border: 2px solid red;" : "")}
  display: block;
  font-size: 1.5em;
  height: 1.5em;
  margin: 1em auto;
  width: 100%;
`;

export function InteractiveRoll({
  title,
  rolls,
  onRoll,
  onCancel,
}: {
  title: string;
  rolls: Array<{ roll: Roll; label?: string }>;
  onRoll: (result: number[]) => void;
  onCancel?: () => void;
}) {
  const [result, setResult] = useState<number[]>(new Array(rolls.length));

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref.current]);

  const autoRoll = () => {
    const newResult = rolls.map(({ roll }) => roll.roll());
    setResult(newResult);
  };

  const submit = () => {
    if (
      result.length === rolls.length ||
      result.find((r) => typeof r !== "number")
    ) {
      return;
    }
    onRoll(result);
  };

  const inputs = rolls.map(({ roll, label }, index) => (
    <div>
      {label && <label>{label}</label>}
      <Input
        type="number"
        onChange={(event) => {
          const newResult = [...result];
          newResult[index] = parseInt(event.target.value, 10);
          setResult(newResult);
        }}
        min={roll.min()}
        max={roll.max()}
        value={result[index]}
        key={index}
        ref={index === 0 ? ref : undefined}
      />
    </div>
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
