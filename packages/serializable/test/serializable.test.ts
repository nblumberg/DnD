import { describe, expect, test } from "@jest/globals";
import { Serializable } from "../src/js/serializable";

describe("When Serializable", () => {
  describe(".toJSON is called", () => {
    test("it should return the expected output", () => {
      const tests: Record<string, Serializable> = {
        "{}": new Serializable(),
        '{\n  "array": [\n    1,\n    2,\n    3\n  ],\n  "b": true,\n  "b2": false,\n  "num": 666,\n  "str": "string",\n  "subobj": {\n    "child": true\n  }\n}':
          new (class OtherProperties extends Serializable {
            array = [1, 2, 3];
            b = true;
            b2 = false;
            num = 666;
            str = "string";
            subobj = { child: true };
          })(),
        '{\n  "test": []\n}':
          new (class CircularReference extends Serializable {
            test: any[] = [];
            self = this;
          })(),
      };
      Object.entries(tests).forEach(([expected, target]) => {
        expect(target.toJSON()).toEqual(expected);
      });
    });
  });
});
