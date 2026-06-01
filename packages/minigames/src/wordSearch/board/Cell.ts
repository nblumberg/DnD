import { Board } from "./Board";
import { ActiveWord } from "./Word";
import * as DIRECTION from "./direction";
import { Direction } from "./direction";
import { Coordinates } from "./position";

export interface CellShape {
  value?: string;
  words?: Map<ActiveWord, number>;
  wordIndices?: number[];
}

export interface SerializedCell {
  value: string;
  words: Array<[ActiveWord, number]>; // references to the words
}

export class Cell implements CellShape {
  value?: string;
  words: Map<ActiveWord, number> = new Map();
  coordinates: Coordinates;

  private board: Board;

  constructor(cell: CellShape, board: Board, coordinates: Coordinates) {
    this.value = cell.value;
    this.words = cell.words ?? this.words;
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

  private incrementWithinBounds({
    value,
    increment,
    min,
    max,
  }: {
    value: number;
    increment: number;
    min: number;
    max: number;
  }): number {
    if (value + increment < min) {
      return max;
    } else if (value + increment > max) {
      return min;
    }
    return value + increment;
  }

  private incrementXYWithinBounds({
    direction,
    increment,
    x,
    y,
    minX,
    maxX,
    minY,
    maxY,
  }: {
    direction: Direction;
    increment: number;
    x: number;
    y: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  }): Coordinates {
    switch (direction) {
      case DIRECTION.LEFT_2_RIGHT: {
        x = this.incrementWithinBounds({
          value: x,
          increment,
          min: minX,
          max: maxX,
        });
        break;
      }
      case DIRECTION.TOP_LEFT_2_BOTTOM_RIGHT: {
        x = this.incrementWithinBounds({
          value: x,
          increment,
          min: minX,
          max: maxX,
        });
        y = this.incrementWithinBounds({
          value: y,
          increment,
          min: minY,
          max: maxY,
        });
        break;
      }
      case DIRECTION.TOP_2_BOTTOM: {
        y = this.incrementWithinBounds({
          value: y,
          increment,
          min: minY,
          max: maxY,
        });
        break;
      }
      case DIRECTION.TOP_RIGHT_2_BOTTOM_LEFT: {
        x = this.incrementWithinBounds({
          value: x,
          increment: -increment,
          min: minX,
          max: maxX,
        });
        y = this.incrementWithinBounds({
          value: y,
          increment,
          min: minY,
          max: maxY,
        });
        break;
      }
      case DIRECTION.RIGHT_2_LEFT: {
        x = this.incrementWithinBounds({
          value: x,
          increment: -increment,
          min: minX,
          max: maxX,
        });
        break;
      }
      case DIRECTION.BOTTOM_RIGHT_2_TOP_LEFT: {
        x = this.incrementWithinBounds({
          value: x,
          increment: -increment,
          min: minX,
          max: maxX,
        });
        y = this.incrementWithinBounds({
          value: y,
          increment: -increment,
          min: minY,
          max: maxY,
        });
        break;
      }
      case DIRECTION.BOTTOM_2_TOP: {
        y = this.incrementWithinBounds({
          value: y,
          increment: -increment,
          min: minY,
          max: maxY,
        });
        break;
      }
      case DIRECTION.BOTTOM_LEFT_2_TOP_RIGHT: {
        x = this.incrementWithinBounds({
          value: x,
          increment,
          min: minX,
          max: maxX,
        });
        y = this.incrementWithinBounds({
          value: y,
          increment: -increment,
          min: minY,
          max: maxY,
        });
        break;
      }
    }
    return { x, y };
  }

  private navigate(direction: Direction, increment: -1 | 1): Cell | undefined {
    const { minX, minY, maxX, maxY } = this.board.getBounds();
    let newCell: Cell | undefined;
    let { x, y } = this.incrementXYWithinBounds({
      ...this.coordinates,
      direction,
      increment,
      minX,
      maxX,
      minY,
      maxY,
    });

    while (!newCell) {
      newCell = this.board.getCell(x, y);
      ({ x, y } = this.incrementXYWithinBounds({
        x,
        y,
        direction,
        increment,
        minX,
        maxX,
        minY,
        maxY,
      }));
    }
    return newCell;
  }

  upLeft(): Cell | undefined {
    return this.navigate(DIRECTION.BOTTOM_RIGHT_2_TOP_LEFT, 1);
  }

  up(): Cell | undefined {
    return this.navigate(DIRECTION.BOTTOM_2_TOP, 1);
  }

  upRight(): Cell | undefined {
    return this.navigate(DIRECTION.BOTTOM_LEFT_2_TOP_RIGHT, 1);
  }

  right(): Cell | undefined {
    return this.navigate(DIRECTION.LEFT_2_RIGHT, 1);
  }

  downLeft(): Cell | undefined {
    return this.navigate(DIRECTION.TOP_RIGHT_2_BOTTOM_LEFT, 1);
  }

  down(): Cell | undefined {
    return this.navigate(DIRECTION.TOP_2_BOTTOM, 1);
  }

  downRight(): Cell | undefined {
    return this.navigate(DIRECTION.TOP_LEFT_2_BOTTOM_RIGHT, 1);
  }

  left(): Cell | undefined {
    return this.navigate(DIRECTION.RIGHT_2_LEFT, 1);
  }
}
