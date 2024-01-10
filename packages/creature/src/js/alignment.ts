export type AlignmentParam =
  | "Lawful Good"
  | "lg"
  | "Neutral Good"
  | "ng"
  | "Chaotic Good"
  | "cg"
  | "Lawful Neutral"
  | "ln"
  | "Neutral"
  | "n"
  | "Chaotic Neutral"
  | "cn"
  | "Lawful Evil"
  | "le"
  | "Neutral Evil"
  | "ne"
  | "Chaotic Evil"
  | "ce";

type TriValue = true | undefined | false;

export class Alignment {
  lawChaos: TriValue;
  goodEvil: TriValue;
  shortName: string;
  longName: string;
  constructor(
    ...args: [AlignmentParam] | [TriValue, TriValue, string, string]
  ) {
    if (typeof args[0] === "boolean" || typeof args[0] === "undefined") {
      this.lawChaos = args[0];
      this.goodEvil = args[1];
      this.shortName = args[2];
      this.longName = args[3];
    } else {
      this.shortName = "temporary";
      this.longName = "temporary";
      // return a different object from the constructor
      let text = args[0] as string;
      text = text
        .replace("Usually ", "")
        .replace("Typically ", "") as AlignmentParam;
      switch (text) {
        case "Lawful Good":
        case "lg":
          return LawfulGood;
        case "Neutral Good":
        case "ng":
          return NeutralGood;
        case "Chaotic Good":
        case "cg":
          return ChaoticGood;
        case "Lawful Neutral":
        case "ln":
          return LawfulNeutral;
        case "Neutral":
        case "n":
          return Neutral;
        case "Chaotic Neutral":
        case "cn":
          return ChaoticNeutral;
        case "Lawful Evil":
        case "le":
          return LawfulEvil;
        case "Neutral Evil":
        case "ne":
          return NeutralEvil;
        case "Chaotic Evil":
        case "ce":
          return ChaoticEvil;
        case "Any Alignment":
          console.warn("Treating Any Alignment as Neutral");
          return Neutral;
        case "Unaligned":
          console.warn("Treating Unaligned as Neutral");
          return Neutral;
        default:
          throw new Error(`Unrecognized Alignment value ${args[0]}`);
      }
    }
  }

  toString(longFormat: boolean = true): string {
    return longFormat ? this.longName : this.shortName;
  }
}

export const LawfulGood = new Alignment(true, true, "LG", "Lawful Good");
export const NeutralGood = new Alignment(undefined, true, "NG", "Neutral Good");
export const ChaoticGood = new Alignment(false, true, "CG", "Chaotic Good");
export const LawfulNeutral = new Alignment(
  true,
  undefined,
  "LN",
  "Lawful Neutral"
);
export const Neutral = new Alignment(undefined, undefined, "N", "Neutral");
export const ChaoticNeutral = new Alignment(
  false,
  undefined,
  "CN",
  "Chaotic Neutral"
);
export const LawfulEvil = new Alignment(true, false, "LE", "Lawful Evil");
export const NeutralEvil = new Alignment(
  undefined,
  false,
  "NE",
  "Neutral Evil"
);
export const ChaoticEvil = new Alignment(false, false, "CE", "Chaotic Evil");
