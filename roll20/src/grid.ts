import type { ChatMessage, Id } from "./builtIns";
import { getPlayerName } from "./players";
import { getCurrentPageId } from "./utilities";

// ===========================
// !grid API
// Labels every 70x70-pixel grid square on the current page with its column/row
// coordinate (e.g. "A1", "BD16"). Labels disappear after 5 seconds.
// ===========================

const GRID_API_KEY = "!grid";
const GRID_PIXEL_SIZE = 70;
const LABEL_DURATION_MS = 5000;

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

function createGridLabels(pageId: Id, numCols: number, numRows: number): void {
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
        layer: "objects",
      } as Partial<Text>);
      labels.push(text);
    }
  }
  setTimeout(() => labels.forEach(t => t.remove()), LABEL_DURATION_MS);
  log(`Created ${labels.length} grid labels (${numCols}x${numRows})`);
}

function onChatMessage(msg: ChatMessage): void {
  if (msg.type !== "api" || !msg.content.startsWith(GRID_API_KEY)) {
    return;
  }
  const pageId = getCurrentPageId();
  const page = getObj("page", pageId);
  if (!page) {
    sendChat("GridAPI", `/w ${getPlayerName(msg.playerid)} No active page found.`);
    return;
  }
  createGridLabels(pageId, page.get("width"), page.get("height"));
}

on("ready", () => {
  log("Starting up !grid API");
});

on("chat:message", onChatMessage);
