import { ActiveWord } from "../board/Word";
import { readBoard } from "./readBoard";

declare global {
  interface Window {
    mode: "play" | "generate";
    data: ActiveWord[];
  }
}

function getCrossword(): HTMLDivElement {
  const id = "crossword";
  const element = document.getElementById(id) as HTMLDivElement;
  if (!element) {
    throw new Error(`Can't find #${id}`);
  }
  return element;
}

function getAcross(): HTMLDivElement {
  const id = "across";
  const element = document.getElementById(id) as HTMLDivElement;
  if (!element) {
    throw new Error(`Can't find #${id}`);
  }
  return element;
}

function getDown(): HTMLDivElement {
  const id = "down";
  const element = document.getElementById(id) as HTMLDivElement;
  if (!element) {
    throw new Error(`Can't find #${id}`);
  }
  return element;
}

function createRow(id: string): void {
  const row = document.createElement("div");
  row.classList.add("row");
  row.id = id;
  getCrossword().appendChild(row);
}

function setUpInput({ cell }: { cell: HTMLDivElement }): void {
  cell.addEventListener("click", (_event: MouseEvent) => {
    cell.focus();
  });
  cell.addEventListener("keydown", (event: KeyboardEvent) => {
    cell.innerText = event.code.toString().toUpperCase();
  });
}

function createCell({
  rowId,
  content,
  numbers,
  editable,
}: {
  rowId: string;
  content: string;
  numbers: { ACROSS?: number; DOWN?: number };
  editable: boolean;
}): void {
  const row = document.getElementById(rowId);
  if (!row) {
    throw new Error(`Can't find row #${rowId}`);
  }

  const isLetter = !!content;
  const cell = document.createElement("div");
  if (editable && isLetter) {
    setUpInput({ cell });
  } else {
    cell.innerHTML = content;
  }
  cell.dataset.letter = content;
  cell.classList.add("square");
  if (isLetter) {
    cell.classList.add("letter");
  }
  if (numbers.ACROSS) {
    cell.classList.add("across");
    cell.classList.add(`across-${numbers.ACROSS}`);
    cell.dataset.across = `${numbers.ACROSS}`;
  }
  if (numbers.DOWN) {
    cell.classList.add("down");
    cell.classList.add(`down-${numbers.DOWN}`);
    cell.dataset.down = `${numbers.DOWN}`;
  }
  row.appendChild(cell);
}

async function save(): Promise<void> {
  const id = document.getElementById("id")?.textContent?.trim();
  await fetch(`/crossword/save/${id}`);
}

function play(): void {
  const id = document.getElementById("id")?.textContent?.trim();
  window.location.href = `/crossword/${id}`;
}

function main() {
  const { mode } = window;
  const board = readBoard();
  board.iterate(({ y, value, cell, firstOfNewRow }) => {
    const rowId = `row-${y}`;
    if (firstOfNewRow) {
      createRow(rowId);
    }
    createCell({
      rowId,
      content: value ?? "",
      numbers: cell?.cellNumbers ?? {},
      editable: mode === "play",
    });
  });
  const across = getAcross();
  board.getAcross().forEach(({ clue }) => {
    const li = document.createElement("li");
    li.innerText = clue;
    across.append(li);
  });
  const down = getDown();
  board.getDown().forEach(({ clue }) => {
    const li = document.createElement("li");
    li.innerText = clue;
    down.append(li);
  });

  if (mode === "play") {
    document.getElementById("buttons")?.remove();
  } else {
    document.getElementById("play")?.addEventListener("click", play);
    document.getElementById("save")?.addEventListener("click", save);
  }
}

main();
