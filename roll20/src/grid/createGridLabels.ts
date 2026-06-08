import { Id } from "../builtIns";
import { debug } from "./debug";

const GRID_PIXEL_SIZE = 70;
const LABEL_DURATION_MS = 5000;

export function createGridLabels(
  pageId: Id,
  numCols: number,
  numRows: number
): void {
  const labels: Text[] = [];
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const text = createObj("text", {
        pageid: pageId,
        left: col * GRID_PIXEL_SIZE, // + GRID_PIXEL_SIZE / 2, // Align to top-left corner of the grid square
        top: row * GRID_PIXEL_SIZE, // + GRID_PIXEL_SIZE / 2, // Align to top-left corner of the grid square
        text: `${columnLabel(col)}${row + 1}`,
        font_family: "Arial",
        font_size: 16,
        color: "#000000",
        stroke: "transparent",
        layer: "map",
      } as Partial<Text>);
      labels.push(text);
    }
  }
  setTimeout(() => labels.forEach((t) => t.remove()), LABEL_DURATION_MS);
  debug(`Created ${labels.length} grid labels (${numCols}x${numRows})`);
}

function columnLabel(col: number): string {
  let label = "";
  let n = col + 1;
  while (n > 0) {
    n--;
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26);
  }
  return label;
}
