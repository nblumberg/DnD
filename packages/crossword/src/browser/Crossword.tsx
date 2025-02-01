import { useMemo } from "react";
import { Board } from "../board";
import styles from "./Crossword.module.scss";
import { Row, RowProperties } from "./Row";

export function Crossword({ board }: { board: Board }) {
  const grid = useMemo(() => {
    const rowData: RowProperties[] = [];
    board.iterate(({ x, y, firstOfNewRow, value }) => {
      if (firstOfNewRow) {
        rowData.push({
          id: `${y}`,
          cells: [],
        });
      }
      const row = rowData[rowData.length - 1];
      row.cells.push({ x, y, letter: value });
    });
    return rowData.map((row) => <Row {...row} key={row.id} />);
  }, [board]);
  return (
    <div id="crossword" className={styles.crossword}>
      {grid}
    </div>
  );
}
