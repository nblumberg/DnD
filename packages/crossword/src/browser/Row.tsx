import { Square } from "./Square";

export interface RowProperties {
  id: string;
  cells: Array<{
    x: number;
    y: number;
    letter?: string;
  }>;
}

export function Row({ cells, id }: RowProperties) {
  const squares = cells.map((cell) => (
    <Square {...cell} key={`${cell.x},${cell.y}`} />
  ));
  return <div key={id}>{squares}</div>;
}
