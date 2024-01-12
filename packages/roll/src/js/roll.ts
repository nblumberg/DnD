import { Serializable } from "serializable";

export interface RollHistory {
  dice: number[];
  total: number;
  isMax?: true;
  isMin?: true;
  manual?: true;
  breakdown?: string;
}

export type RollParams =
  | [string | Roll]
  | [
      {
        dieCount: number;
        dieSides: number;
        extra?: number;
        crits?: number;
      },
    ]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

export class Roll extends Serializable {
  dieCount: number;
  dieSides: number;
  extra = 0;
  crits: number = Infinity;
  private history: RollHistory[] = [];

  constructor(...args: RollParams) {
    super();
    if (!args.length) {
      throw new Error("New Roll missing arguments");
    }
    if (args.length === 1) {
      if (typeof args[0] === "string") {
        const { dieCount, dieSides, extra } = parseString(args[0]);
        this.dieCount = dieCount;
        this.dieSides = dieSides;
        this.extra = extra;
      } else if (typeof args[0] === "object") {
        const { dieCount, dieSides, extra, crits } = parseObject(args[0]);
        this.dieCount = dieCount;
        this.dieSides = dieSides;
        this.extra = extra;
        this.crits = crits;
      } else {
        throw new Error(
          `New Roll expected a single Object or string argument: ${args}`
        );
      }
    } else {
      if (typeof args[0] !== "number" && typeof args[1] !== "number") {
        throw new Error(`New Roll expected an array of numbers: ${args}`);
      }
      this.dieCount = args[0];
      this.dieSides = args[1];
      if (args.length > 2) {
        if (typeof args[2] !== "number") {
          throw new Error(`New Roll expected an array of numbers: ${args}`);
        }
        this.extra = args[2];
      }
      if (args.length > 3) {
        if (typeof args[3] !== "number") {
          throw new Error(`New Roll expected an array of numbers: ${args}`);
        }
        this.crits = args[3];
      }
    }
  }

  roll(): number {
    log("roll");
    return roll(this.dieCount, this.dieSides, this.extra, this.history).total;
  }

  max(): number {
    log("max");
    return roll(this.dieCount, this.dieSides, this.extra, this.history, "max")
      .total;
  }

  min(): number {
    log("min");
    return roll(this.dieCount, this.dieSides, this.extra, this.history, "min")
      .total;
  }

  /**
   * Manually add a result to the Roll history
   */
  add(total: number, dice?: number[]): void {
    log("add", arguments);
    const historyEntry: RollHistory = {
      total,
      dice: [],
      manual: true,
    };
    if (dice) {
      historyEntry.dice = dice;
    } else {
      const value = Math.floor((total - this.extra) / this.dieCount);
      const remainder = (total - this.extra) % this.dieCount;
      for (let i = 0; i < this.dieCount; i++) {
        const die =
          Math.floor(value) +
          (i === this.dieCount - 1 && remainder ? remainder : 0);
        historyEntry.dice.push(die);
      }
    }
    this.history.push(historyEntry);
  }

  getLastRoll(): RollHistory {
    log("getLastRoll");
    return this.history && this.history.length
      ? this.history[this.history.length - 1]
      : { dice: [], total: 0 };
  }

  private isCritable(): RollHistory | undefined {
    if (
      this.crits === Infinity ||
      this.dieCount !== 1 ||
      this.dieSides !== 20
    ) {
      return;
    }
    return this.getLastRoll();
  }

  /**
   * Was the last roll a critical success?
   */
  isCriticalSuccess(): boolean {
    log("isCriticalSuccess");
    const lastRoll = this.isCritable();
    if (!lastRoll) {
      return false;
    }
    return lastRoll.dice[0] >= this.crits;
  }

  /**
   * Was the last roll a critical failure?
   */
  isCriticalFailure(): boolean {
    log("isCriticalFailure");
    const lastRoll = this.isCritable();
    if (!lastRoll) {
      return false;
    }
    return lastRoll.dice[0] === 1;
  }

  /**
   * Output a text representation of the last roll, e.g.:
   * <ul>
   * <li><code>5 + 1 + 2</code></li>
   * <li><code>CRIT</code></li>
   * <li><code>FUMBLE</code></li>
   * <li><code>17 + 2 some conditional text</code></li>
   * </ul>
   * @param conditional Optional text to append
   */
  breakdown(conditional?: string): string {
    log("breakdown", arguments);
    const lastRoll = this.getLastRoll();
    let output = "";
    const fixed =
      this.crits && (this.isCriticalSuccess() || this.isCriticalFailure());
    if (fixed) {
      output += this.isCriticalSuccess() ? "CRIT" : "FUMBLE";
    } else {
      output += lastRoll.dice.join(" + ");
    }
    if ((this.extra || !output) && !fixed) {
      if (output) {
        output += this.extra >= 0 ? " + " : " - ";
      }
      output += Math.abs(this.extra);
    }
    if (lastRoll.breakdown) {
      output += lastRoll.breakdown;
    }
    if (conditional) {
      output += conditional;
    }
    return `[${this.breakdownToString()}] ${output}`;
  }

  private breakdownToString(): string {
    log("breakdownToString", arguments);
    return this.toString();
  }

  /**
   * e.g.
   * <ul>
   * <li><code>1d20+3</code></li>
   * <li><code>1d20-1</code></li>
   * <li><code>5d6</code></li>
   * </ul>
   */
  override toString(): string {
    log("toString");
    const dice =
      this.dieCount * this.dieSides ? `${this.dieCount}d${this.dieSides}` : "";
    const operand = this.extra >= 0 ? "+" : "";
    return `${dice}${dice && this.extra ? operand : ""}${
      this.extra || !dice ? this.extra : ""
    }`;
  }

  private anchorHtml(conditional?: { total?: number; text?: string }): string {
    log("anchorHtml", arguments);
    const historyEntry = this.getLastRoll();
    return `${(historyEntry?.total ?? 0) + (conditional?.total ?? 0)}${
      conditional?.text ?? ""
    }`;
  }

  /**
   * Output an HTML anchor representation of the last roll, e.g.
   * <code>%lt;a href="javascript:void(0);" title="see breakdown()"&gt;see anchorHtml()&lt;/a&gt;</code>
   * @param conditional Optional text to append to the title and HTML, and a value to add to the total
   */
  anchor(conditional?: {
    breakdown?: string;
    total?: number;
    text?: string;
  }): string {
    log("anchor", arguments);
    return `<a href="javascript:void(0);" title="${this.breakdown(
      conditional?.breakdown
    )}">${this.anchorHtml(conditional)}</a>`;
  }
}

const diceSyntaxRegExp =
  /^(?<dieCount>\d+)d(?<dieSides>\d+)\s*(?<extra>[+-]\s*\d+)?$/;

function parseString(str: string): {
  dieCount: number;
  dieSides: number;
  extra: number;
} {
  if (!str) {
    throw new Error("New Roll expected a string argument");
  }
  const results = diceSyntaxRegExp.exec(str);
  if (!results || !results.groups) {
    throw new Error(
      `New Roll string argument doesn't match expected CdS+E syntax: ${str}`
    );
  }
  const { dieCount, dieSides, extra } = results.groups;
  return {
    dieCount: parseInt(dieCount, 10),
    dieSides: parseInt(dieSides, 10),
    extra: extra ? parseInt(extra, 10) : 0,
  };
}

function parseObject(obj: any): {
  dieCount: number;
  dieSides: number;
  extra: number;
  crits: number;
} {
  if (!obj) {
    throw new Error(`New Roll expected an Object argument: ${obj}`);
  }
  let { dieCount, dieSides, extra, crits } = obj;
  if (typeof dieCount !== "number") {
    throw new Error(`Expected passed dieCount to be a number: ${dieCount}`);
  }
  if (typeof dieSides !== "number") {
    throw new Error(`Expected passed dieSides to be a number: ${dieSides}`);
  }
  if (typeof extra !== "number") {
    extra = 0;
  }
  if (typeof crits !== "number") {
    crits = Infinity;
  }
  return { dieCount, dieSides, extra, crits };
}

function roll(
  dieCount: number,
  dieSides: number,
  extra: number,
  history: RollHistory[],
  fixed?: "max" | "min"
): RollHistory {
  let value = 0;
  let historyEntry: RollHistory = { dice: [], total: 0 };
  history.push(historyEntry);
  for (let i = 0; i < dieCount; i++) {
    let die: number;
    switch (fixed) {
      case "max":
        die = dieSides;
        break;
      case "min":
        die = 1;
        break;
      default:
        die = Math.ceil(Math.random() * dieSides);
        break;
    }
    historyEntry.dice.push(die);
    value += die;
  }
  historyEntry.total = Math.max(value + extra, 1); // no results lower than 1
  if (fixed === "max") {
    historyEntry.isMax = true;
  } else if (fixed === "min") {
    historyEntry.isMin = true;
  }
  return historyEntry;
}

let log: typeof console.log = () => {};

export function setLog(fn: typeof console.log): void {
  log = fn;
}
