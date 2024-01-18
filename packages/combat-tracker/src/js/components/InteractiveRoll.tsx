import { useEffect, useRef, useState } from "react";
import { Roll } from "roll";
import styled from "styled-components";
import { Dialog, DialogButton } from "./Dialog";

// const Dialog = styled.dialog`
//   position: fixed;
//   z-index: 1;
// `;
const Input = styled.input<{ $error?: boolean }>`
  ${({ $error }) => ($error ? "border: 2px solid red;" : "")}
  display: block;
  font-size: 1.5em;
  height: 1.5em;
  margin: 1em auto;
  width: 100%;
`;
// const ButtonBar = styled.footer`
//   align-content: space-around;
//   background: #cccccc;
//   border: 2px solid black;
//   display: flex;
//   flex-wrap: nowrap;
//   justify-content: flex-end;
// `;
// const Button = styled.button`
//   // font-size: 1em;
//   // height: 1.5em;
//   margin: 0.25em;
// `;

export function InteractiveRoll({
  title,
  roll,
  onRoll,
}: {
  title: string;
  roll: Roll;
  onRoll: (result: number) => void;
}) {
  const [result, setResult] = useState<number | undefined>();

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref.current]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResult(parseInt(event.target.value, 10));
  };

  const autoRoll = () => {
    setResult(roll.roll());
  };

  const submit = () => {
    if (result === undefined) {
      return;
    }
    onRoll(result);
  };

  return (
    <Dialog
      title={title}
      onClose={submit}
      buttons={
        <>
          <DialogButton onClick={autoRoll}>Roll for me 🎲</DialogButton>
          <DialogButton onClick={submit}>Submit manual roll</DialogButton>
        </>
      }
    >
      <Input
        type="number"
        onChange={onChange}
        min={roll.min()}
        max={roll.max()}
        value={result}
        ref={ref}
      />
    </Dialog>
  );
}
