import { describe, expect, test } from "@jest/globals";
import { Serializable } from "../src/js/serializable";

describe("When Serializable", () => {
  describe(".toJSON is called", () => {
    test("it should return the expected output", () => {
      const tests: Record<string, Serializable> = {
        "{}": new Serializable(),
        '{\n  "test": []\n}': new (class Test extends Serializable {
          test: any[] = [];
          constructor() {
            super();
          }
        })(),
      };
      Object.entries(tests).forEach(([expected, target]) => {
        expect(target.toJSON()).toEqual(expected);
      });
    });
  });
});
