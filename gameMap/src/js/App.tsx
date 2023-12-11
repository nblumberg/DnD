import { Grid } from "./components/Grid";
import { Materials } from "./data/material";
import { generateMap } from "./utils/map-generator";

const urlParams = new URLSearchParams(window.location.search);
const height = parseInt(urlParams.get("height"), 10) || 30;
const width = parseInt(urlParams.get("width"), 10) || 30;

function chooseRandom<T>(array: readonly T[]): T {
  const max = array.length;
  return array[Math.floor(Math.random() * max)];
}

const notEmptyMaterials = Materials.filter((value) => value !== "empty");

export function App() {
  // console.log(height, width);

  // const cells: Cell[][] = new Array<Cell[]>(height);
  // for (let y = 0; y < height; y++) {
  //   cells[y] = new Array<Cell>(width);
  //   for (let x = 0; x < cells[y].length; x++) {
  //     const floor = chooseRandom(notEmptyMaterials);
  //     cells[y][x] = {
  //       x,
  //       y,
  //       floor: {
  //         material: floor,
  //         standable: "colossal",
  //       },
  //       wall: {
  //         material:
  //           Math.random() > 0.8 ? chooseRandom(notEmptyMaterials) : "empty",
  //         lineOfEffect: true,
  //         lineOfSight: true,
  //         passable: "colossal",
  //       },
  //     };
  //   }
  // }

  const cells = generateMap();

  return <Grid cells={cells} tokens={[]} />;
}
