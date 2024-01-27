import { Creature } from "creature";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

export function listWithFieldValue<P extends keyof Creature>(
  field: P,
  value?: Creature[P]
): string[] {
  const baseFilePath = join(__dirname, "..", "..", "data", "monsters");
  const files = readdirSync(baseFilePath).filter((file) =>
    file.endsWith(".json")
  );
  const values: string[] = [];
  files.forEach((file) => {
    const creature = JSON.parse(
      readFileSync(join(baseFilePath, file), "utf8")
    ) as Creature;
    if (value === undefined) {
      if (creature[field] !== undefined) {
        values.push(creature.name);
      }
    } else if (creature[field] === value) {
      values.push(creature.name);
    }
  });
  console.log(JSON.stringify(values, null, 2));
  return values;
}
