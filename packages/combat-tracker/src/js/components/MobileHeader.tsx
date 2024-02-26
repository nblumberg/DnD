import { useContext, useState } from "react";
import styled from "styled-components";
import { media } from "../app/constants";
import { ViewContext } from "../data/view";
import { Menu, MenuOption } from "./Menu";

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

export function MobileHeader({ options }: { options: MenuOption[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { view, setView } = useContext(ViewContext);

  const mobileOptions = [
    {
      icon: view === "turnOrder" ? "📜" : "🔄",
      text: view === "turnOrder" ? "Show History" : "Show Turn Order",
      onClick: () => {
        setView(view === "turnOrder" ? "history" : "turnOrder");
      },
    },
    ...options,
  ];

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
        <Menu options={mobileOptions} onClose={() => setMenuOpen(false)} />
      )}
    </ButtonBar>
  );
}
