import { SyntheticEvent, useEffect } from "react";
import styled from "styled-components";
import { media } from "./breakpoints";

const OuterDialog = styled.dialog`
  border-radius: 5px;
  border-style: solid;
  border-width: 2px;
  bottom: 0;
  height: 90vh;
  left: 20vw;
  padding: 0;
  position: fixed;
  right: 20vw;
  width: 60vw;
  top: 0;
  z-index: 1;

  ${media.md`
    height: unset;
    left: 0;
    right: 0;
    top: 0;
    width: unset;
  `}
`;

const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;

  ${media.md`
    height: unset;
  `}
`;

const DialogHeader = styled.header`
  background-color: lightgray;
  color: black;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0.5em;
`;

const DialogHeading = styled.h1`
  flex-grow: 1;
  font-size: 1.5em;
  margin: 0;
  text-align: center;
`;

const DialogClose = styled.button`
  background-color: transparent;
  border: none;
  flex-grow: 0;
  font-weight: bold;
`;

const DialogBody = styled.form`
  align-items: stretch;
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  padding: 1em;
`;

const DialogFooter = styled.footer`
  align-content: space-around;
  align-items: center;
  background-color: lightgray;
  display: flex;
  height: 3em;
  justify-content: flex-end;
  margin-top: 1em;
`;

export const DialogButton = styled.button`
  border-radius: 3px;
  font-size: 1em;
  margin: 0.25em 1em;
  padding: 0.25em 1em;
`;

function stopInnerClicksFromDismissingDialog(event: SyntheticEvent) {
  event.stopPropagation();
}

export function Dialog({
  children,
  title,
  buttons,
  onClose,
}: {
  children: React.ReactNode;
  title?: string;
  buttons?: React.ReactNode;
  onClose?: () => void;
}) {
  useEffect(() => {
    if (!onClose) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    setTimeout(() => {
      window.document.addEventListener("click", onClose);
      window.addEventListener("keydown", onKeyDown);
    }, 250);
    return () => {
      window.document.removeEventListener("click", onClose);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <OuterDialog open onClick={stopInnerClicksFromDismissingDialog}>
      <DialogContent>
        <DialogHeader>
          {title && <DialogHeading>{title}</DialogHeading>}
          {onClose && <DialogClose onClick={onClose}>X</DialogClose>}
        </DialogHeader>
        <DialogBody method="dialog">{children}</DialogBody>
        {buttons && <DialogFooter>{buttons}</DialogFooter>}
      </DialogContent>
    </OuterDialog>
  );
}
