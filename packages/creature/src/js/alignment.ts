import { ClassMembers, Serializable } from "serializable";

export enum AlignmentParam {
  LG = "Lawful Good",
  NG = "Neutral Good",
  CG = "Chaotic Good",
  LN = "Lawful Neutral",
  N = "Neutral",
  CN = "Chaotic Neutral",
  LE = "Lawful Evil",
  NE = "Neutral Evil",
  CE = "Chaotic Evil",
  ANY = "Any Alignment",
  U = "Unaligned",
}

type TriValue = true | undefined | false;

export class Alignment
  extends Serializable<AlignmentRaw>
  implements AlignmentRaw
{
  lawChaos: TriValue;
  goodEvil: TriValue;
  shortName: string;
  longName: string;

  constructor(
    ...args: [AlignmentParam | string] | [TriValue, TriValue, string, string]
  ) {
    super();
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
        case AlignmentParam.LG:
          return LawfulGood;
        case AlignmentParam.NG:
          return NeutralGood;
        case AlignmentParam.CG:
          return ChaoticGood;
        case AlignmentParam.LN:
          return LawfulNeutral;
        case AlignmentParam.N:
          return Neutral;
        case AlignmentParam.CN:
          return ChaoticNeutral;
        case AlignmentParam.LE:
          return LawfulEvil;
        case AlignmentParam.NE:
          return NeutralEvil;
        case AlignmentParam.CE:
          return ChaoticEvil;
        case AlignmentParam.ANY:
          console.warn("Treating Any Alignment as Neutral");
          return Neutral;
        case AlignmentParam.U:
          console.warn("Treating Unaligned as Neutral");
          return Neutral;
        default:
          throw new Error(`Unrecognized Alignment value ${args[0]}`);
      }
    }
  }

  override toString(longFormat: boolean = true): string {
    return longFormat ? this.longName : this.shortName;
  }
}

export type AlignmentRaw = ClassMembers<Alignment>;

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
