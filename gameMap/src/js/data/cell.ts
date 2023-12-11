import { Material } from "./material";
import { Size } from "./size";

export interface Cell {
  x: number;
  y: number;
  floor: {
    material: Material;
    standable?: Size;
  };
  wall: {
    material: Material;
    lineOfSight: boolean;
    lineOfEffect: boolean;
    passable?: Size;
  };
}
