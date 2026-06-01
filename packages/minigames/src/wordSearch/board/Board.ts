import { Cell, CellShape } from "./Cell";
import * as DIRECTION from "./direction";
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
  protected words: Map<ActiveWordObject, boolean> = new Map();
  protected cells: Map<string, Cell> = new Map();

  clear(): void {
    this.words.clear();
    this.cells.clear();
  }

  clone(): Board {
    const clone = new Board();
    clone.words = new Map(this.words);
    for (const [key, value] of this.cells.entries()) {
      clone.cells.set(key, new Cell(value, this, keyToCoordinates(key)));
    }
    return clone;
  }

  getWords(): ActiveWordObject[] {
    return Array.from(this.words.keys());
  }

  getWordCount(): number {
    return this.words.size;
  }

  /**
   * Add a word to the board
   * @param {ActiveWordObject} word The word to add
   * @param {boolean} included Whether the word is actually on the board or a red herring
   */
  addWord(word: ActiveWordObject, included: boolean): void {
    this.words.set(word, included);

    let { x: xIndex, y: yIndex } = word;
    word.characters.forEach((value, i) => {
      switch (word.direction) {
        case DIRECTION.LEFT_2_RIGHT: {
          xIndex = word.x + i;
          break;
        }
        case DIRECTION.TOP_LEFT_2_BOTTOM_RIGHT: {
          xIndex = word.x + i;
          yIndex = word.y + i;
          break;
        }
        case DIRECTION.TOP_2_BOTTOM: {
          yIndex = word.y + i;
          break;
        }
        case DIRECTION.TOP_RIGHT_2_BOTTOM_LEFT: {
          xIndex = word.x - i;
          yIndex = word.y + i;
          break;
        }
        case DIRECTION.RIGHT_2_LEFT: {
          xIndex = word.x - i;
          break;
        }
        case DIRECTION.BOTTOM_RIGHT_2_TOP_LEFT: {
          xIndex = word.x - i;
          yIndex = word.y - i;
          break;
        }
        case DIRECTION.BOTTOM_2_TOP: {
          yIndex = word.y - i;
          break;
        }
        case DIRECTION.BOTTOM_LEFT_2_TOP_RIGHT: {
          xIndex = word.x + i;
          yIndex = word.y - i;
          break;
        }
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
    const words = Array.from(this.words.entries()).map(
      ([activeWord, included]) => {
        const subset: ActiveWord & { characters?: string[] } = {
          ...activeWord,
        };
        delete subset.characters;
        return [subset, included];
      }
    );
    return JSON.stringify(words);
  }

  deserialize(words: Array<[ActiveWord, boolean]>): void {
    const activeWords: Array<[ActiveWordObject, boolean]> = words.map(
      ([word, included]) => [new ActiveWordObject(word, word), included]
    );
    for (const [word, included] of activeWords) {
      this.addWord(word, included);
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
