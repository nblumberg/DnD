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

export interface Alignment {
  lawChaos: TriValue;
  goodEvil: TriValue;
  shortName: string;
  longName: string;
}

export function alignmentParamToAlignment(
  params: string | AlignmentParam
): Alignment {
  let text = params as string;
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
      throw new Error(`Unrecognized Alignment value ${params}`);
  }
}

function baseAlignment(
  lawChaos: TriValue,
  goodEvil: TriValue,
  shortName: string,
  longName: string
): Alignment {
  return {
    lawChaos,
    goodEvil,
    shortName,
    longName,
  };
}

export const LawfulGood = baseAlignment(true, true, "LG", "Lawful Good");
export const NeutralGood = baseAlignment(undefined, true, "NG", "Neutral Good");
export const ChaoticGood = baseAlignment(false, true, "CG", "Chaotic Good");
export const LawfulNeutral = baseAlignment(
  true,
  undefined,
  "LN",
  "Lawful Neutral"
);
export const Neutral = baseAlignment(undefined, undefined, "N", "Neutral");
export const ChaoticNeutral = baseAlignment(
  false,
  undefined,
  "CN",
  "Chaotic Neutral"
);
export const LawfulEvil = baseAlignment(true, false, "LE", "Lawful Evil");
export const NeutralEvil = baseAlignment(
  undefined,
  false,
  "NE",
  "Neutral Evil"
);
export const ChaoticEvil = baseAlignment(false, false, "CE", "Chaotic Evil");
