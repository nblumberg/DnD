import { ReactNode, SyntheticEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { media } from "./breakpoints";

export const ButtonBar = styled.nav`
  display: flex;
  flex-grow: 1;
  flex-wrap: nowrap;
  justify-content: flex-start;
`;
export const MenuButton = styled.button`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  margin: 1em;
  ${media.md`
    flex-grow: 1;
    font-size: 1em;
  `}
`;
const DropDown = styled.nav`
  align-items: stretch;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  left: 0;
  position: fixed;
  right: 0;
  top: 3em;
  z-index: 2;
`;
const DropDownOption = styled.a`
  border: 1px solid black;
  font-size: 2em;
  padding: 0.5em;
  text-align: left;
  width: 100%;
`;

function stopInnerClicksFromDismissingMenu(event: SyntheticEvent) {
  event.stopPropagation();
}

export interface MenuOption {
  icon?: ReactNode;
  text: string;
  onClick: (event: SyntheticEvent) => void;
}

export function Menu({ options }: { options: MenuOption[] }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const onClose = () => {
      setMenuOpen(false);
    };
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
  }, [menuOpen, setMenuOpen]);

  const optionElements = options.map(({ icon, text, onClick }) => {
    return (
      <DropDownOption key={text} onClick={onClick}>
        {icon} {text}
      </DropDownOption>
    );
  });

  return (
    <ButtonBar>
      <MenuButton
        title="Options"
        onClick={() => {
          setMenuOpen(!menuOpen);
        }}
      >
        Menu
      </MenuButton>
      {menuOpen && (
        <DropDown onClick={stopInnerClicksFromDismissingMenu}>
          {optionElements}
        </DropDown>
      )}
    </ButtonBar>
  );
}
