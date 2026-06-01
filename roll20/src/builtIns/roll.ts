import { Id } from "./ids";

/**
 Roll Result Structure Ex. 1
After you call JSON.parse on the content property of a "rollresult" or "gmrollresult" message, you'll get an object with the following format (this is the result from the command /roll {2d6}+5+1t[weather] Attack!)

{
  "type":"V", //"V" = "Validated Roll" (this will always be "V" right now)
  "rolls": [
    {
      "type":"G", //"G" indicates a grouped roll. A group is like a series of "sub-rolls" within a roll.
      "rolls": [
        [
          {
            "type":"R", //"R" = "Roll"
            "dice":2, // Number of dice rolled (2dX means 2 dice)
            "sides":6, //Number of sides for the dice (Xd6 means 6 sides)
            "mods":{},
            "results": [ //An array of the results of each roll.
             {
               "v":1 // We rolled a 1 for our first 2d6
             },
             {
               "v":5 //We rolled a 5 for our second 2d6
             }
            ]
          }
        ]
      ],
      "mods":{},
      "resultType":"sum", //The result is a sum (as opposed to a success check)
      "results": [
        {
          "v":6 // In this case, the overall result (total) of the group.
        }
      ]
    },
    {
      "type":"M", //"M" = Math Expression
      "expr":"+5+"
    },
    {
      "type":"R", //"R" = Roll
      "dice":1,
      "table":"weather", //The table property is set to the name of the table used if this roll was made against a table
      "mods":{},
      "sides":2, //You can probably just ignore this for table rolls.
      "results": [
        {
          "v":0, //The "value" of the table item rolled. For text tables this is always 0.
          "tableidx":1, //The index of the item in the table that was rolled.
          "tableItem": { //A copy of the table item object as it existed when the table was rolled.
            "name":"rainy", 
            "avatar":"", //This will be a URL to an image if the rollable table uses image icons
            "weight":1,
            "id":"-IpzPx2j_9piP09ceyOv"
          }
        }
      ]
    },
    {
      "type":"C", // "C" = Comment
      "text":" Attack!"
    }
  ],
  "resultType":"sum", //The overall result type of the entire roll
  "total":11 // The overall total of the entire roll (including all sub-groups)
}

Roll Result Structure Ex. 2
An annotated structure for the result of /roll {1d6!!>5}>6 (showing exploding modifications and target successes):

{
  "type":"V",
  "rolls": [
    {
      "type":"G",
      "rolls": [
        [
          {
            "type":"R",
            "dice":1,
            "sides":6,
            "mods": { //Modifications to the roll
              "compounding": { //"compounding" = "Compounding exploding (!!)"
                "comp":">=", //Comparison type
                "point":5 //Comparison point
              }
            },
            "results": [
              {
                "v":13 //Overall dice result. Note that since this is compounding exploding there is only one dice result.
              }
            ]
          }
        ]
      ],
      "mods": {
        "success": {
          "comp":">=",
          "point":6
        }
      },
      "resultType":"sum",
      "results": [
        {
          "v":13
        }
      ]
    }
  ],
  "resultType":"success", // In this case, the result is a count of successes
  "total":1 //Total number of successes
}
 */


type RollType = "R" | "G" | "M" | "C";

/**
 * Base for the different roll types
 */
interface Roll {
  type: RollType;
}

/** 
 * An individual dice roll ("R" segment) 
 */
export interface IndividualRoll extends Roll {
  type: "R";
  dice: number;
  sides: number;
  mods: RollMods;
  resultType: ResultType;
  results: DiceResult[];

  /**
   * The table property is set to the name of the table used if this roll was made against a table
   */
  table?: string;
}

/** 
 * A grouped roll containing nested sub-rolls ("G" segment) 
 */
export interface GroupedRoll extends Roll {
  type: "G";
  rolls: RollPart[][];
  mods: RollMods;
  resultType: ResultType;
  results: DiceResult[];
}

/** 
 * A math expression within a roll ("M" segment) 
 */
export interface MathExpression extends Roll {
  type: "M";
  expr: string;
}

/** 
 * A text annotation within a roll ("C" segment) 
 */
export interface RollComment extends Roll {
  type: "C";
  text: string;
}

export type RollPart =
  | IndividualRoll
  | GroupedRoll
  | MathExpression
  | RollComment;

  /**
 * The result is a sum (as opposed to a success check)
 */
type ResultType = "sum" | "success";

/** 
 * An individual die result within a roll 
 */
export interface DiceResult {
  /** 
   * The numeric value of this die.
   * The "value" of the table item rolled. For text tables this is always 0.
   */
  v: number;
  
  /** 
   * The index of the item in the table that was rolled (table rolls only) 
   */
  tableidx?: number;

  /** 
   * A copy of the table item object as it existed when the table was rolled (table rolls only)
   */
  tableItem?: {
    name: string;

    /**
     * This will be a URL to an image if the rollable table uses image icons
     */
    avatar: string;

    weight: number;

    id: Id;
  };
}

/** 
 * Modifiers applied to a dice roll, e.g. exploding or success-counting 
 */
export interface RollMods {
  /** 
   * Compounding exploding dice (`!!`) 
   */
  compounding?: { comp: string; point: number };

  /** 
   * Success-count threshold 
   */
  success?: { comp: string; point: number };

  [key: string]: unknown;
}

