import { Board } from "./Board";
import { ActiveWord } from "./Word";
import { ACROSS, Direction, DirectionNumber, DOWN } from "./direction";
import { Coordinates } from "./position";

export interface CellShape {
  value?: string;
  words?: Map<ActiveWord, number>;
  wordIndices?: number[];
  cellNumbers?: { ACROSS?: number; DOWN?: number };
}

export interface SerializedCell {
  value: string;
  words: DirectionNumber[]; // references to the words
  numbers?: DirectionNumber[]; // numbers displayed in the cell
}

export class Cell implements CellShape {
  value?: string;
  words: Map<ActiveWord, number> = new Map();
  cellNumbers?: { ACROSS?: number; DOWN?: number };
  coordinates: Coordinates;

  private board: Board;

  constructor(cell: CellShape, board: Board, coordinates: Coordinates) {
    this.value = cell.value;
    this.words = cell.words ?? this.words;
    this.cellNumbers = cell.cellNumbers ?? this.cellNumbers;
    this.board = board;
    this.coordinates = coordinates;
  }

  setValue(letter: string, word: ActiveWord, wordIndex: number): void {
    this.value = letter;
    if (!this.words) {
      this.words = new Map();
    }
    this.words.set(word, wordIndex);
  }

  private navigate(direction: Direction, increment: -1 | 1): Cell | undefined {
    const { minX, minY, maxX, maxY } = this.board.getBounds();
    let newCell: Cell | undefined;
    let { x, y } = this.coordinates;
    if (direction === ACROSS) {
      x += increment;
    } else {
      y += increment;
    }
    while (!newCell) {
      if (direction === ACROSS) {
        if (increment < 0) {
          if (x < minX) {
            x = maxX;
          }
        } else if (x > maxX) {
          x = minX;
        }
      } else {
        if (increment < 0) {
          if (y < minY) {
            y = maxY;
          }
        } else if (y > maxY) {
          y = minY;
        }
      }
      newCell = this.board.getCell(x, y);
      if (direction === ACROSS) {
        x += increment;
      } else {
        y += increment;
      }
    }
    return newCell;
  }

  up(): Cell | undefined {
    return this.navigate(DOWN, -1);
  }

  right(): Cell | undefined {
    return this.navigate(ACROSS, 1);
  }

  down(): Cell | undefined {
    return this.navigate(DOWN, 1);
  }

  left(): Cell | undefined {
    return this.navigate(ACROSS, -1);
  }
}
