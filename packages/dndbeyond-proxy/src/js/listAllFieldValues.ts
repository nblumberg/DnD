import { Creature } from "creature";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

export function listAllFieldValues<P extends keyof Creature>(field: P) {
  const baseFilePath = join(__dirname, "..", "..", "data", "monsters");
  const files = readdirSync(baseFilePath).filter((file) =>
    file.endsWith(".json")
  );
  const values = new Map<Creature[P], string[]>();
  files.forEach((file) => {
    const creature = JSON.parse(
      readFileSync(join(baseFilePath, file), "utf8")
    ) as Creature;
    if (!values.has(creature[field])) {
      values.set(creature[field], []);
    }
    values.get(creature[field])?.push(file.replace(".json", ""));
  });
  console.log(
    `${field}:\n${Array.from(values.entries())
      .map(
        ([key, value]) =>
          `${key}: ${value.length > 21 ? value.length : value.join(", ")}`
      )
      .join("\n")}`
  );
}
