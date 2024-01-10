import { parseRegExpGroups } from "../utils";

export type Speeds = Record<
  string,
  number | { rate: number; precision: string }
>;

const commaDelimitedRegExp = /(?!\B\([^()]*),(?![^()]*\)\B)/g; // some parentheticals include commas, see https://www.dndbeyond.com/monsters/2560738-bheur-hag
const initialDigitRegExp = /^\d/;
const speedRegExp =
  /(?<method>\D+)?(\s*)?(?<rate>\d+)\s+ft\.\s*\(?(?<precision>[^)]+)?\)?/;

export function getSpeeds(value: string): Speeds {
  const [initial, ...means] = value.trim().split(commaDelimitedRegExp); //",");

  const speeds: Speeds = {};

  if (initialDigitRegExp.test(initial.trim())) {
    // It's a walk speed
    speeds.walk = parseInt(initial, 10);
  } else {
    means.unshift(initial);
  }

  means.forEach((entry) => {
    const { method, rate, precision } = parseRegExpGroups(
      "speedRegExp",
      speedRegExp,
      entry
    );
    if (precision) {
      speeds[method.trim()] = { rate: parseInt(rate, 10), precision };
    }
    speeds[method.trim()] = parseInt(rate, 10);
  });

  if (!Object.keys(speeds).length) {
    throw new Error("Failed to parse speeds");
  }

  return speeds;
}
