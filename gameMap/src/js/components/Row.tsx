import { ReactNode, useContext, useRef } from "react";
import { styled } from "styled-components";
import { ZoomContext } from "../context/ZoomContext";
import { useOnScreen } from "../hooks/useOnScreen";
import { defaultTileDimension } from "./Tile";

const NoWrap = styled.div<{ $height: number }>`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: ${(props) => props.$height}px;
`;

defaultTileDimension;

export function Row({ children }: { children: ReactNode }) {
  const ref = useRef();
  const visible = useOnScreen(ref);
  const zoom = useContext(ZoomContext);
  return (
    <NoWrap ref={ref} $height={zoom * defaultTileDimension}>
      {visible ? children : null}
    </NoWrap>
  );
}
