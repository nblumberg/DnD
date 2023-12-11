import { Cell } from "../data/cell";
import { MATERIAL } from "../data/material";

function randomBetween(max: number, min = 0): number {
  return Math.round(Math.random() * (max - min)) + min;
}

function roundm(n: number, m: number): number {
  return Math.floor((n + m - 1) / m) * m;
}

function randomPointInCircle(radius: number): { x: number; y: number } {
  const t = 2 * Math.PI * Math.random();
  const u = Math.random() + Math.random();
  let r = null;
  if (u > 1) {
    r = 2 - u;
  } else {
    r = u;
  }
  return {
    x: roundm(radius * r * Math.cos(t), 1),
    y: roundm(radius * r * Math.sin(t), 1),
  };
}

interface Room {
  height: number;
  width: number;
  x: number;
  y: number;
}

function randomRoom(): Room {
  return {
    height: randomBetween(60, 3),
    width: randomBetween(60, 3),
    ...randomPointInCircle(100),
  };
}

const dirt: Cell = {
  x: -1,
  y: -1,
  floor: {
    material: MATERIAL.dirt,
    standable: "colossal",
  },
  wall: {
    material: MATERIAL.empty,
    lineOfSight: true,
    lineOfEffect: true,
  },
};

const floor: Cell = {
  x: -1,
  y: -1,
  floor: {
    material: MATERIAL.stonework,
    standable: "colossal",
  },
  wall: {
    material: MATERIAL.empty,
    lineOfSight: true,
    lineOfEffect: true,
  },
};

const wall: Cell = {
  ...floor,
  wall: {
    material: MATERIAL.stonework,
    lineOfSight: false,
    lineOfEffect: false,
  },
};

export function generateMap(): Cell[][] {
  const roomCount = randomBetween(30, 1);
  const rooms = new Array<Room>(roomCount);
  for (let i = 0; i < roomCount; i++) {
    rooms[i] = randomRoom();
  }

  let mapMinX = Number.POSITIVE_INFINITY;
  let mapMaxX = Number.NEGATIVE_INFINITY;
  let mapMinY = Number.POSITIVE_INFINITY;
  let mapMaxY = Number.NEGATIVE_INFINITY;
  rooms.forEach((room) => {
    const minX = room.x;
    mapMinX = Math.min(minX, mapMinX);
    const maxX = room.x + room.width;
    mapMaxX = Math.max(maxX, mapMaxX);
    const minY = room.y;
    mapMinY = Math.min(minY, mapMinY);
    const maxY = room.y + room.height;
    mapMaxY = Math.max(maxY, mapMaxY);
  });

  let mapOffsetX = 0;
  let mapOffsetY = 0;
  if (mapMinX < 0) {
    mapOffsetX = Math.abs(mapMinX);
    mapMaxX += mapOffsetX;
    mapMinX = 0;
  }
  if (mapMinY < 0) {
    mapOffsetY = Math.abs(mapMinY);
    mapMaxY += mapOffsetY;
    mapMinY = 0;
  }

  const cells = new Array<Cell[]>(mapMaxY + 1);
  for (let i = 0; i <= mapMaxY; i++) {
    cells[i] = new Array<Cell>(mapMaxX + 1);
  }

  rooms.forEach((room) => {
    const minX = room.x + mapOffsetX;
    const maxX = room.x + mapOffsetX + room.width;
    const minY = room.y + mapOffsetY;
    const maxY = room.y + mapOffsetY + room.height;
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        try {
          if (x === minX || x === maxX || y === minY || y === maxY) {
            const cell: Cell = Object.assign({}, wall, { x, y });
            cells[y][x] = cell;
          } else {
            const cell: Cell = Object.assign({}, floor, { x, y });
            cells[y][x] = cell;
          }
        } catch (e) {
          console.error(`Problem creating Cell ${x}, ${y}`, e);
        }
      }
    }
  });

  for (let x = 0; x <= mapMaxX; x++) {
    for (let y = 0; y <= mapMaxY; y++) {
      if (!cells[y][x]) {
        cells[y][x] = Object.assign({}, dirt, { x, y });
      }
    }
  }

  return cells;
}
