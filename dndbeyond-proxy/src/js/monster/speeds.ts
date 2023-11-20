export type Speeds = Record<
  string,
  number | { rate: number; precision: string }
>;

const initialDigitRegExp = /^\d/;
const speedRegExp =
  /(?<method>\D+)?(\s*)?(?<rate>\d+)\s+ft\.\s*\(?(?<precision>\w+)?\)?/;

export function getSpeeds(value: string): Speeds {
  const [initial, ...means] = value.trim().split(",");

  const speeds: Speeds = {};

  if (initialDigitRegExp.test(initial.trim())) {
    // It's a walk speed
    speeds.walk = parseInt(initial, 10);
  } else {
    means.unshift(initial);
  }

  means.forEach((entry) => {
    const { method, rate, precision } = speedRegExp.exec(entry).groups;
    if (precision) {
      speeds[method.trim()] = { rate: parseInt(rate, 10), precision };
    }
    speeds[method.trim()] = parseInt(rate, 10);
  });

  return speeds;
}
