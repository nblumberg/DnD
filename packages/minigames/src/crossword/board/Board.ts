import { Cell, CellShape } from "./Cell";
import { ACROSS, DOWN } from "./direction";
import { Coordinates } from "./position";
import { ActiveWord, ActiveWordObject } from "./Word";

interface IterateCallbackParameters {
  x: number;
  y: number;
  firstOfNewRow: boolean;
  value?: string;
  cell?: Cell;
}
type IterateCallback = (parameters: IterateCallbackParameters) => void;

export class Board {
  protected words: Set<ActiveWordObject> = new Set();
  protected cells: Map<string, Cell> = new Map();

  clear(): void {
    this.words.clear();
    this.cells.clear();
  }

  clone(): Board {
    const clone = new Board();
    for (const word of this.words) {
      clone.words.add(word);
    }
    for (const [key, value] of this.cells.entries()) {
      clone.cells.set(key, new Cell(value, this, keyToCoordinates(key)));
    }
    return clone;
  }

  getWords(): ActiveWordObject[] {
    return Array.from(this.words);
  }

  getWordCount(): number {
    return this.words.size;
  }

  getAcross(): ActiveWordObject[] {
    return Array.from(this.words)
      .filter(({ direction }) => direction === ACROSS)
      .sort(({ number: a }, { number: b }) => a - b);
  }

  getDown(): ActiveWordObject[] {
    return Array.from(this.words)
      .filter(({ direction }) => direction === DOWN)
      .sort(({ number: a }, { number: b }) => a - b);
  }

  /**
   * Add a word to the board
   * @param {ActiveWordObject} word The word to add
   */
  addWord(word: ActiveWordObject): void {
    this.words.add(word);

    let { x: xIndex, y: yIndex } = word;
    word.characters.forEach((value, i) => {
      if (word.direction === ACROSS) {
        xIndex = word.x + i;
      } else {
        yIndex = word.y + i;
      }
      let cell = this.getCell(xIndex, yIndex);
      if (!cell) {
        const words: Map<ActiveWordObject, number> = new Map();
        words.set(word, i);
        this.setCell(xIndex, yIndex, {
          value,
          words: words,
        });
      } else {
        cell.setValue(value, word, i);
      }
    });
    this.numberWords();
  }

  /**
   * Iterate through the available words and number them and the cells
   * according to the order they appear on the board, left to right,
   * top to bottom
   */
  private numberWords(): void {
    let across = 1;
    let down = 1;
    this.iterate(({ cell }) => {
      if (!cell || !cell.value) {
        // Skip empty cells
        return;
      }
      for (const [word, index] of cell.words.entries()) {
        if (index !== 0) {
          // Skip words that aren't the start of the word
          continue;
        }
        const activeWord = word as ActiveWordObject;
        if (activeWord.direction === ACROSS) {
          cell.cellNumbers = { ...cell.cellNumbers, ACROSS: across };
          activeWord.number = across;
          across++;
        } else {
          cell.cellNumbers = { ...cell.cellNumbers, DOWN: down };
          activeWord.number = down;
          down++;
        }
      }
    });
  }

  getCell(x: number, y: number): Cell | undefined {
    return this.cells.get(coordinatesToKey(x, y));
  }

  setCell(x: number, y: number, cell: CellShape): void {
    this.cells.set(
      coordinatesToKey(x, y),
      cell instanceof Cell ? cell : new Cell(cell, this, { x, y })
    );
  }

  unsetCell(x: number, y: number): void {
    this.cells.delete(coordinatesToKey(x, y));
  }

  getBounds(): { minX: number; minY: number; maxX: number; maxY: number } {
    const coordinates = this.cells.keys();
    let minX = 0;
    let minY = 0;
    let maxX = 0;
    let maxY = 0;
    for (const key of coordinates) {
      const { x, y } = keyToCoordinates(key);
      if (x < minX) {
        minX = x;
      }
      if (y < minY) {
        minY = y;
      }
      if (x > maxX) {
        maxX = x;
      }
      if (y > maxY) {
        maxY = y;
      }
    }
    return { minX, minY, maxX, maxY };
  }

  iterate(callback: IterateCallback): void {
    const { minX, minY, maxX, maxY } = this.getBounds();
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const firstOfNewRow = x === minX;
        const cell = this.getCell(x, y);
        callback({ x, y, value: cell?.value, cell, firstOfNewRow });
      }
    }
  }

  serialize(): string {
    const words = Array.from(this.words.values()).map((activeWord) => {
      const subset: ActiveWord & { characters?: string[] } = {
        ...activeWord,
      };
      delete subset.characters;
      return subset;
    });
    return JSON.stringify(words);
  }

  deserialize(words: ActiveWord[]): void {
    const activeWords = words.map((word) => new ActiveWordObject(word, word));
    for (const word of activeWords) {
      this.addWord(word);
    }
  }

  toString(): string {
    let output = "";
    this.iterate(({ value, firstOfNewRow }) => {
      if (firstOfNewRow) {
        output += "\n";
      }
      output += value ?? " ";
    });
    return output;
  }
}

function coordinatesToKey(x: number, y: number): string {
  return `${x},${y}`;
}

function keyToCoordinates(key: string): Coordinates {
  const [x, y] = key.split(",").map((value) => Number.parseInt(value));
  return { x, y };
}
