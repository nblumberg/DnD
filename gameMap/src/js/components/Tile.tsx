import { ReactNode, useContext, useRef } from "react";
import { styled } from "styled-components";
import { CoordinateContext } from "../context/CoordinateContext";
import { ZoomContext } from "../context/ZoomContext";
import { Cell } from "../data/cell";
import { Material, materialStyles } from "../data/material";
import { useOnScreen } from "../hooks/useOnScreen";

export const defaultTileDimension = 100;
const defaultWallHeight = 10;

const TileBorder = styled.div<{ $cellDimension?: number }>`
  background-color: black;
  border: 1px solid white;
  color: white;
  flex-grow: 0;
  flex-shrink: 0;
  height: ${(props) => props.$cellDimension ?? defaultTileDimension}px;
  position: relative;
  width: ${(props) => props.$cellDimension ?? defaultTileDimension}px;
`;

const TileCoordinates = styled.div`
  color: white;
  left: 0;
  position: absolute;
  top: 0;
`;

const TileFloor = styled.div<{ $material: string }>`
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  ${(props) => materialStyles[props.$material as Material]}
`;

const backgroundColorRegExp = /background-color: (?<color>#\w+);/;

const TileWall = styled.div<{ $material: string; $wallHeight: number }>`
  bottom: 0;
  left: -${(props) => props.$wallHeight}px;
  position: absolute;
  right: 0;
  top: -${(props) => props.$wallHeight}px;
  border-right: ${(props) => props.$wallHeight}px outset
    ${(props) =>
      backgroundColorRegExp.exec(materialStyles[props.$material as Material])
        ?.groups.color};
  border-bottom: ${(props) => props.$wallHeight}px outset
    ${(props) =>
      backgroundColorRegExp.exec(materialStyles[props.$material as Material])
        ?.groups.color};
  ${(props) => materialStyles[props.$material as Material]}
`;

export function Tile({
  x,
  y,
  floor,
  wall,
  children,
}: Cell & {
  children?: ReactNode;
}) {
  const ref = useRef();
  const visible = useOnScreen(ref);
  const zoom = useContext(ZoomContext);
  const showCoordinates = useContext(CoordinateContext);

  let content = null;
  if (visible) {
    content = (
      <>
        {wall && wall.material !== "empty" ? (
          <TileWall
            data-cell-wall
            $material={wall.material}
            $wallHeight={zoom * defaultWallHeight}
          />
        ) : (
          <TileFloor data-cell-floor $material={floor.material} />
        )}
        {children}
        {showCoordinates ? (
          <TileCoordinates data-cell-coordinates>
            {x}:{y}
          </TileCoordinates>
        ) : null}
      </>
    );
  }

  return (
    <TileBorder
      data-cell
      $cellDimension={zoom * defaultTileDimension}
      ref={ref}
    >
      {content}
    </TileBorder>
  );
}
