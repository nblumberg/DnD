import { ReactNode, useEffect, useMemo, useState } from "react";
import { styled } from "styled-components";
import { CoordinateContext } from "../context/CoordinateContext";
import { ZoomContext } from "../context/ZoomContext";
import { Map } from "../data/map";
import { Row } from "./Row";
import { Tile } from "./Tile";

const GridBorder = styled.div`
  background-color: black;
  color: white;
  display: block;
  height: 100%;
  width: 100%;
`;

export function Grid({ cells }: Map) {
  const [zoom, setZoom] = useState(1);
  const [showCoordinates, setShowCoordinates] = useState(false);

  useEffect(() => {
    const zoomListener = (event: WheelEvent) => {
      if (!event.ctrlKey) {
        return;
      }
      event.preventDefault();
      const { deltaY } = event;
      const newZoom = zoom * (deltaY > 0 ? 1.1 : 0.9);
      setZoom(newZoom);
    };
    const showCoordinateListener = (event: KeyboardEvent) => {
      if (event.altKey) {
        setShowCoordinates(true);
      }
    };
    const hideCoordinateListener = (event: KeyboardEvent) => {
      if (!event.altKey) {
        setShowCoordinates(false);
      }
    };
    window.addEventListener("wheel", zoomListener, { passive: false });
    window.document.addEventListener("keydown", showCoordinateListener);
    window.document.addEventListener("keyup", hideCoordinateListener);
    return () => {
      window.removeEventListener("wheel", zoomListener);
      window.document.removeEventListener("keydown", showCoordinateListener);
      window.document.removeEventListener("keyup", hideCoordinateListener);
    };
  }, [zoom]);

  const rows = useMemo(() => {
    const rows: ReactNode[] = [];
    for (let y = 0; y < cells.length; y++) {
      const tiles: ReactNode[] = [];
      for (let x = 0; x < cells[y].length; x++) {
        const key = `${x}:${y}`;
        tiles.push(<Tile key={key} {...cells[y][x]}></Tile>);
      }
      rows.push(<Row key={y}>{tiles}</Row>);
    }
    return rows;
  }, [cells]);

  return (
    <ZoomContext.Provider value={zoom}>
      <CoordinateContext.Provider value={showCoordinates}>
        <GridBorder tabIndex={0}>{rows}</GridBorder>
      </CoordinateContext.Provider>
    </ZoomContext.Provider>
  );
}
