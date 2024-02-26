import { Creature } from "creature";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

export function listAllFieldValues(fieldPath: string | string[]) {
  const fields = Array.isArray(fieldPath) ? fieldPath : [fieldPath];
  const baseFilePath = join(__dirname, "..", "..", "data", "monsters");
  const files = readdirSync(baseFilePath).filter((file) =>
    file.endsWith(".json")
  );
  const values = new Map<any, Set<string>>();
  files.forEach((file) => {
    const creature = JSON.parse(
      readFileSync(join(baseFilePath, file), "utf8")
    ) as Creature;

    const creatureValues = getPropertyValues(creature, fields);
    if (creatureValues.length === 0) {
      return;
    }
    creatureValues.forEach((value) => {
      if (!values.has(value)) {
        values.set(value, new Set());
      }
      values.get(value)!.add(file.replace(".json", ""));
    });
  });
  console.log(
    `${fields.join(".")}:\n${Array.from(values.entries())
      .map(
        ([key, value]) =>
          `${key}: ${
            value.size > 21 ? value.size : Array.from(value.values()).join(", ")
          }`
      )
      .join("\n")}`
  );
}

function getPropertyValues(obj: any, path: string[]): any[] {
  if (path.length === 0) {
    return [obj];
  }
  const [key] = path;
  if (typeof key === "undefined") {
    throw new Error(`Invalid field path: ${path.join(".")}`);
  }
  if (key === "*") {
    if (Array.isArray(obj)) {
      return obj.flatMap((item) => getPropertyValues(item, path.slice(1)));
    } else if (typeof obj === "object") {
      return Object.values(obj).flatMap((value) =>
        getPropertyValues(value, path.slice(1))
      );
    }
  }
  if (typeof obj[key] === "undefined") {
    return [];
  }
  return getPropertyValues(obj[key], path.slice(1));
}
