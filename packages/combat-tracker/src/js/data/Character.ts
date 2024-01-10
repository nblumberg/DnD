import { Actor } from "./Actor";

export class Character extends Actor {
  constructor(name: string, id: string) {
    super({ name, id, unique: true });
  }
}

export const PCs = [
  new Character("Ser Eaton Dorito", "eaton"),
  new Character("Harrow Zinvaris", "harrow"),
  new Character("John Rambo McClane", "john"),
  new Character("Nacho Chessier IV", "nacho"),
  new Character("Rhiannon Fray", "rhiannon"),
  new Character("Throne", "throne"),
];
