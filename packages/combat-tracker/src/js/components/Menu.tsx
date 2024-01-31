import { ReactNode, SyntheticEvent, useEffect, useState } from "react";
import styled from "styled-components";

const DropDown = styled.nav`
  align-items: stretch;
  background-color: white;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  left: 0;
  overflow-y: scroll;
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
  &:hover {
    border: 2px solid blue;
  }
`;

function stopInnerClicksFromDismissingMenu(event: SyntheticEvent) {
  event.stopPropagation();
}

export interface MenuOption {
  icon?: ReactNode;
  text: string;
  onClick?: (event: SyntheticEvent) => void;
  children?: MenuOption[];
}

export function Menu({
  options,
  onClose,
}: {
  options: MenuOption[];
  onClose: () => void;
}) {
  const [currentOptions, setCurrentOptions] = useState<MenuOption[]>(options);
  const [priorOptions, setPriorOptions] = useState<MenuOption[][]>([]);

  const backLevel = () => {
    if (priorOptions.length) {
      const newPriorOptions = [...priorOptions];
      setCurrentOptions(newPriorOptions.pop()!);
      setPriorOptions(newPriorOptions);
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        backLevel();
        return;
      }
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
  }, [onClose, priorOptions]);

  const optionElements = currentOptions.map(
    ({ icon, text, onClick, children }) => {
      if (children) {
        return (
          <DropDownOption
            key={text}
            onClick={() => {
              setPriorOptions([...priorOptions, currentOptions]);
              setCurrentOptions(children);
            }}
          >
            {icon} {text} ↘️
          </DropDownOption>
        );
      }
      if (!onClick) {
        throw new Error("Menu option must have an onClick handler");
      }
      return (
        <DropDownOption
          key={text}
          onClick={(event) => {
            onClick(event);
            onClose();
          }}
        >
          {icon} {text}
        </DropDownOption>
      );
    }
  );
  if (priorOptions.length) {
    optionElements.unshift(
      <DropDownOption key="back" onClick={backLevel}>
        🔙
      </DropDownOption>
    );
  }

  return (
    <DropDown onClick={stopInnerClicksFromDismissingMenu}>
      {optionElements}
    </DropDown>
  );
}
