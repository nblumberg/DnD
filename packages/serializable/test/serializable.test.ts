import { describe, expect, jest, test } from "@jest/globals";
import { Serializable } from "../src/js/serializable";

describe("When Serializable", () => {
  describe(".asJSON is called", () => {
    describe("with an empty Serializable", () => {
      test("it should return an empty object", () => {
        expect(new Serializable().asJSON()).toEqual("{}");
      });
    });
    describe("with a Serializable with child properties", () => {
      test("it should return the serialized object", () => {
        const target = new (class OtherProperties extends Serializable<any> {
          array = [1, 2, 3];
          b = true;
          b2 = false;
          num = 666;
          str = "string";
          subobj = { child: true };
        })();

        expect(target.asJSON()).toEqual(
          `{\n  "array": [\n    1,\n    2,\n    3\n  ],\n  "b": true,\n  "b2": false,\n  "num": 666,\n  "str": "string",\n  "subobj": {\n    "child": true\n  }\n}`
        );
      });
    });
    describe("with a Serializable with nested child objects", () => {
      test("it should return the serialized object", () => {
        const target = new (class CircularReference extends Serializable<any> {
          child = { grandchild: { greatGrandchild: "great-great-grandchild" } };
        })();

        expect(target.asJSON()).toEqual(
          `{\n  "child": {\n    "grandchild": {\n      "greatGrandchild": "great-great-grandchild"\n    }\n  }\n}`
        );
      });
    });
    describe("with a Serializable with circular references", () => {
      test("it should return the serialized object without the circular references", () => {
        const target = new (class CircularReference extends Serializable<any> {
          test: any[] = [];
          self = this;
          child = { grandchild: { greatGrandchild: this } };
        })();

        expect(target.asJSON()).toEqual(
          `{\n  "test": [],\n  "child": {\n    "grandchild": {}\n  }\n}`
        );
      });
    });
    describe("with a Serializable with a child Serializable property", () => {
      test("it should return the serialized object without the circular references", () => {
        const target = new (class Parent extends Serializable<any> {
          test: any[] = [];
          self = this;
          child?: Serializable<any>;
        })();
        const target2 = new (class Child extends Serializable<any> {
          self = this;
          b = true;
        })();
        jest.spyOn(target2, "raw");
        target.child = target2;

        expect(target.asJSON()).toEqual(
          `{\n  "test": [],\n  "child": {\n    "b": true\n  }\n}`
        );
        expect(target2.raw).toHaveBeenCalled();
      });
    });
  });
});
