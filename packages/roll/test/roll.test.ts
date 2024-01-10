import { beforeEach, describe, expect, test } from "@jest/globals";
import type { RollHistory } from "../src/js/roll";
import { Roll } from "../src/js/roll";

describe("When Roll", () => {
  describe("is instantiated", () => {
    function equalRolls(expected: Roll, actual: Roll) {
      expect(actual.dieCount).toEqual(expected.dieCount);
      expect(actual.dieSides).toEqual(expected.dieSides);
      expect(actual.extra).toEqual(expected.extra);
      expect(actual.crits).toEqual(expected.crits);
    }

    describe("with invalid parameters", () => {
      test("it should throw an error", () => {
        expect(() => {
          // @ts-expect-error
          new Roll();
        }).toThrow();
        expect(() => {
          // @ts-expect-error
          new Roll(6);
        }).toThrow();
        expect(() => {
          // @ts-expect-error
          new Roll(1, 20, "6");
        }).toThrow();
        expect(() => {
          // @ts-expect-error
          new Roll(1, 20, 6, "1");
        }).toThrow();
      });
    });
    describe("with a string", () => {
      test("it should parse the string as expected", () => {
        const expectations: Record<string, Roll> = {
          "1d20": new Roll({ dieCount: 1, dieSides: 20 }),
          "1d20+3": new Roll({ dieCount: 1, dieSides: 20, extra: 3 }),
          "5d6-1": new Roll({ dieCount: 5, dieSides: 6, extra: -1 }),
        };
        Object.entries(expectations).forEach(([str, expected]) => {
          equalRolls(expected, new Roll(str));
        });
      });
    });
    describe("with an object", () => {
      test("it should copy only the expected properties", () => {
        const expected = new Roll({
          dieCount: 5,
          dieSides: 4,
          extra: 5,
          crits: 20,
        });
        // @ts-expect-error
        const actual = new Roll({
          dieCount: 5,
          dieSides: 4,
          extra: 5,
          crits: 20,
          other: true,
        });
        equalRolls(expected, actual);
      });
    });
    describe("with an array", () => {
      test("it should parse the array as expected", () => {
        type ArgArray =
          | [number, number]
          | [number, number, number]
          | [number, number, number, number];
        const expectations: Map<ArgArray, Roll> = new Map();
        expectations.set([3, 6], new Roll({ dieCount: 3, dieSides: 6 }));
        expectations.set(
          [1, 12, 3],
          new Roll({ dieCount: 1, dieSides: 12, extra: 3 })
        );
        expectations.set(
          [1, 20, -1],
          new Roll({ dieCount: 1, dieSides: 20, extra: -1 })
        );
        expectations.set(
          [1, 20, 7, 20],
          new Roll({ dieCount: 1, dieSides: 20, extra: 7, crits: 20 })
        );
        for (const [array, expected] of expectations.entries()) {
          equalRolls(expected, new Roll(...array));
        }
      });
    });
  });

  function expectedHistory(
    rollHistory: RollHistory,
    result: number,
    dice: number[]
  ) {
    expect(rollHistory).toBeDefined();
    expect(typeof rollHistory).toBe("object");
    expect(rollHistory.total).toBeDefined();
    expect(rollHistory.total).toEqual(result);
    expect(rollHistory.dice).toBeDefined();
    expect(Array.isArray(rollHistory.dice)).toBe(true);
    expect(rollHistory.dice.length).toEqual(dice.length);
    rollHistory.dice.forEach((actual, i) => expect(actual).toEqual(dice[i]));
  }

  describe("roll is called", () => {
    let roll: Roll;
    beforeEach(() => {
      roll = new Roll({
        dieCount: 1,
        dieSides: 20,
        extra: 3,
        crits: 20,
      });
    });
    test("it should return a number", () => {
      const result = roll.roll();
      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThanOrEqual(4);
      expect(result).toBeLessThanOrEqual(23);
    });
    test("the roll should be accessible via getLastRoll", () => {
      const result1 = roll.roll();
      expect(typeof result1).toBe("number");
      expect(result1).toBeGreaterThanOrEqual(4);
      expect(result1).toBeLessThanOrEqual(23);
      const lastRoll1 = roll.getLastRoll();
      expectedHistory(lastRoll1, result1, [result1 - roll.extra]);
      const result2 = roll.roll();
      const lastRoll2 = roll.getLastRoll();
      expectedHistory(lastRoll2, result2, [result2 - roll.extra]);
      expect(lastRoll2).not.toBe(lastRoll1);
    });
  });

  describe("max is called", () => {
    let roll: Roll;
    beforeEach(() => {
      roll = new Roll({
        dieCount: 1,
        dieSides: 20,
        extra: 3,
        crits: 20,
      });
    });
    test("it should return the maximum value of the roll", () => {
      const result = roll.max();
      expect(result).toEqual(23);
    });
    test("the roll should be accessible via getLastRoll", () => {
      const result = roll.max();
      expect(result).toEqual(23);
      const lastRoll = roll.getLastRoll();
      expectedHistory(lastRoll, result, [20]);
    });
  });

  describe("min is called", () => {
    let roll: Roll;
    beforeEach(() => {
      roll = new Roll({
        dieCount: 1,
        dieSides: 20,
        extra: -3,
        crits: 20,
      });
    });
    test("it should return the minimum value of the roll (which can't be lower than 1)", () => {
      const result = roll.min();
      expect(result).toEqual(1);
    });
    test("the roll should be accessible via getLastRoll", () => {
      const result = roll.min();
      expect(result).toEqual(1);
      const lastRoll = roll.getLastRoll();
      expectedHistory(lastRoll, result, [1]);
    });
  });

  describe("add is called", () => {
    let roll: Roll;
    beforeEach(() => {
      roll = new Roll({
        dieCount: 3,
        dieSides: 6,
        extra: 3,
      });
    });
    describe("without dice values", () => {
      test("it should add a new roll with the given total accessible via getLastRoll and average the dice", () => {
        roll.add(18);
        const lastRoll = roll.getLastRoll();
        expectedHistory(lastRoll, 18, [5, 5, 5]);
      });
    });
    describe("with dice values", () => {
      test("it should add a new roll with the given total accessible via getLastRoll and use the passed dice", () => {
        roll.add(16, [6, 2, 5]);
        const lastRoll = roll.getLastRoll();
        expectedHistory(lastRoll, 16, [6, 2, 5]);
      });
    });
  });

  describe("getLastRoll is called", () => {
    describe("and no rolls have been made", () => {
      test("it should return an empty RollHistory", () => {
        const roll = new Roll("1d20");
        const lastRoll = roll.getLastRoll();
        expectedHistory(lastRoll, 0, []);
        expect(Object.keys(lastRoll).length).toEqual(2);
      });
    });
    test("it should return a different RollHistory after each roll", () => {
      const roll = new Roll("1d20");
      const lastRolls: RollHistory[] = [];
      for (let i = 0; i < 5; i++) {
        const result = roll.roll();
        const lastRoll = roll.getLastRoll();
        lastRolls.push(lastRoll);
        expectedHistory(lastRoll, result, [result - roll.extra]);
      }
      {
        const result = roll.max();
        const lastRoll = roll.getLastRoll();
        lastRolls.push(lastRoll);
        expectedHistory(lastRoll, result, [result - roll.extra]);
      }
      {
        const result = roll.min();
        const lastRoll = roll.getLastRoll();
        lastRolls.push(lastRoll);
        expectedHistory(lastRoll, result, [result - roll.extra]);
      }
      {
        roll.add(16);
        const lastRoll = roll.getLastRoll();
        lastRolls.push(lastRoll);
        expectedHistory(lastRoll, 16, [16 - roll.extra]);
      }
      lastRolls.forEach((history) => {
        const filteredHistory = lastRolls.filter((entry) => entry !== history);
        expect(filteredHistory.length).toEqual(lastRolls.length - 1);
      });
    });
  });

  describe("isCriticalSuccess is called", () => {
    describe("on a non-crits Roll", () => {
      test("it should return false", () => {
        const roll = new Roll({ dieCount: 1, dieSides: 20, extra: 3 });
        roll.max();
        expect(roll.isCriticalSuccess()).toEqual(false);
      });
    });
    describe("on a crits Roll", () => {
      describe("that isn't 1d20", () => {
        test("it should return false", () => {
          const roll = new Roll({
            dieCount: 3,
            dieSides: 6,
            extra: 3,
            crits: 18,
          });
          roll.max();
          expect(roll.isCriticalSuccess()).toEqual(false);
        });
      });
      describe("that is 1d20", () => {
        describe("and the last roll wasn't a critical success", () => {
          test("it should return false", () => {
            const roll = new Roll({
              dieCount: 1,
              dieSides: 20,
              extra: 3,
              crits: 20,
            });
            roll.min();
            expect(roll.isCriticalSuccess()).toEqual(false);
          });
        });
        describe("and the last roll was a critical success", () => {
          test("it should return true", () => {
            const roll = new Roll({
              dieCount: 1,
              dieSides: 20,
              extra: 3,
              crits: 20,
            });
            roll.max();
            expect(roll.isCriticalSuccess()).toEqual(true);
          });
          describe("that's not max value", () => {
            test("it should return true", () => {
              const roll = new Roll({
                dieCount: 1,
                dieSides: 20,
                extra: 3,
                crits: 19,
              });
              roll.add(22, [19]);
              expect(roll.isCriticalSuccess()).toEqual(true);
            });
          });
        });
      });
    });
  });

  describe("isCriticalFailure is called", () => {
    describe("on a non-crits Roll", () => {
      test("it should return false", () => {
        const roll = new Roll({ dieCount: 1, dieSides: 20, extra: 3 });
        roll.min();
        expect(roll.isCriticalFailure()).toEqual(false);
      });
    });
    describe("on a crits Roll", () => {
      describe("that isn't 1d20", () => {
        test("it should return false", () => {
          const roll = new Roll({
            dieCount: 3,
            dieSides: 6,
            extra: 3,
            crits: 18,
          });
          roll.min();
          expect(roll.isCriticalFailure()).toEqual(false);
        });
      });
      describe("that is 1d20", () => {
        describe("and the last roll wasn't a critical failure", () => {
          test("it should return false", () => {
            const roll = new Roll({
              dieCount: 1,
              dieSides: 20,
              extra: 3,
              crits: 20,
            });
            roll.max();
            expect(roll.isCriticalFailure()).toEqual(false);
          });
        });
        describe("and the last roll was a critical failure", () => {
          test("it should return true", () => {
            const roll = new Roll({
              dieCount: 1,
              dieSides: 20,
              extra: 3,
              crits: 20,
            });
            roll.min();
            expect(roll.isCriticalFailure()).toEqual(true);
          });
        });
      });
    });
  });

  describe("breakdown is called", () => {
    test("it should return the expected text", () => {
      const expectations: Record<string, [Roll, [number, number[]]]> = {
        "[1d20+3] CRIT": [new Roll(1, 20, 3, 20), [23, [20]]],
        "[1d20-1] FUMBLE": [new Roll(1, 20, -1, 20), [1, [1]]],
        "[1d20+1] 15 + 1": [new Roll(1, 20, 1, 20), [16, [15]]],
        "[1d20-1] 15 - 1": [new Roll(1, 20, -1, 20), [14, [15]]],
        "[3d6+3] 2 + 4 + 1 + 3": [new Roll(3, 6, 3), [10, [2, 4, 1]]],
        "[3d6-3] 2 + 4 + 1 - 3": [new Roll(3, 6, -3), [4, [2, 4, 1]]],
      };
      Object.entries(expectations).forEach(([expected, [roll, addArgs]]) => {
        roll.add(...addArgs);
        expect(roll.breakdown()).toEqual(expected);
      });
    });
    describe("with breakdown text in the last roll", () => {
      test("it should append the breakdown text before any conditional text", () => {
        const roll = new Roll(1, 20, 3, 20);
        roll.add(16);
        const lastRoll = roll.getLastRoll();
        lastRoll.breakdown = " test1";
        expect(roll.breakdown(" test2")).toEqual("[1d20+3] 13 + 3 test1 test2");
      });
    });
    describe("with conditional text", () => {
      test("it should append the conditional text", () => {
        const roll = new Roll(1, 20, 3, 20);
        roll.add(16);
        expect(roll.breakdown(" test")).toEqual("[1d20+3] 13 + 3 test");
      });
    });
  });

  describe("toString is called", () => {
    test("it should return the expected text", () => {
      const expectations: Record<string, Roll> = {
        "1d3": new Roll(1, 3),
        "1d4": new Roll(1, 4),
        "1d6": new Roll(1, 6),
        "3d6": new Roll(3, 6),
        "1d8": new Roll(1, 8),
        "1d10": new Roll(1, 10),
        "1d12": new Roll(1, 12),
        "1d20": new Roll(1, 20),
        "1d30": new Roll(1, 30),
        "2d10": new Roll(2, 10),
        "1d20+1": new Roll(1, 20, 1, 20),
        "1d20-1": new Roll(1, 20, -1, 20),
        "3d6+3": new Roll(3, 6, 3),
        "3d6-3": new Roll(3, 6, -3),
      };
      Object.entries(expectations).forEach(([expected, roll]) => {
        expect(roll.toString()).toEqual(expected);
      });
    });
  });

  describe("anchor is called", () => {
    test("it should return an HTML anchor (outerHTML string) containing the last roll result as the innerText and the breakdown as the title", () => {
      const roll = new Roll("3d6+3");
      roll.add(14, [4, 2, 3]);
      const anchor = roll.anchor();
      expect(anchor).toEqual(
        `<a href="javascript:void(0);" title="[3d6+3] 4 + 2 + 3 + 3">14</a>`
      );
    });
    describe("with conditional breakdown text", () => {
      test("it should append the text to the title", () => {
        const roll = new Roll("3d6+3");
        roll.add(14, [4, 2, 3]);
        const anchor = roll.anchor({ breakdown: " test" });
        expect(anchor).toEqual(
          `<a href="javascript:void(0);" title="[3d6+3] 4 + 2 + 3 + 3 test">14</a>`
        );
      });
    });
    describe("with conditional text", () => {
      test("it should append the text to the innerText", () => {
        const roll = new Roll("3d6+3");
        roll.add(14, [4, 2, 3]);
        const anchor = roll.anchor({ text: " test" });
        expect(anchor).toEqual(
          `<a href="javascript:void(0);" title="[3d6+3] 4 + 2 + 3 + 3">14 test</a>`
        );
      });
    });
    describe("with a conditional value", () => {
      test("it should add the value to the innerText value", () => {
        const roll = new Roll("3d6+3");
        roll.add(14, [4, 2, 3]);
        const anchor = roll.anchor({ total: 4, text: " test" });
        expect(anchor).toEqual(
          `<a href="javascript:void(0);" title="[3d6+3] 4 + 2 + 3 + 3">18 test</a>`
        );
      });
    });
  });
});
