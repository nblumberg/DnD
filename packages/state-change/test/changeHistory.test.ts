import { describe, expect, test } from "@jest/globals";
import { getObjectFromChanges, trackAdd } from "../src/js";
import {
  ChangeHistory,
  trackPropertyChange,
  trackRemove,
} from "../src/js/change";
import { beforeOnce } from "./beforeOnce";

const originalObject = {
  id: "test item",
  name: "original name",
};

describe("When", () => {
  let history: ChangeHistory<typeof originalObject> = { changes: [] };
  let currentObject: typeof originalObject;
  beforeOnce(() => {
    history.changes = [];
  });
  describe("an item is added to state", () => {
    beforeOnce(() => {
      history = trackAdd(history, originalObject, "add item");
      currentObject = originalObject;
    });
    test("it should track the add in the history and it should contain the full, original item", () => {
      expect(history.changes).toBeDefined();
      expect(history.changes.length).toEqual(1);
      const [change] = history.changes;
      expect(change.type).toEqual("+");
      expect(change.action).toEqual("add item");
      expect(change.newValue).toBe(originalObject);
    });
    describe("and then the item is changed", () => {
      beforeOnce(() => {
        history = trackPropertyChange(
          history,
          currentObject,
          "name change",
          "name",
          undefined,
          "changed name"
        );
        currentObject = { ...currentObject, name: "changed name" };
      });
      test("it should track the change in the history", () => {
        expect(history.changes).toBeDefined();
        expect(history.changes.length).toEqual(2);
        const change = history.changes[1];
        expect(change.type).toEqual("c");
        expect(change.object).toEqual(originalObject.id);
        expect(change.action).toEqual("name change");
        expect(change.newValue).toEqual("changed name");
        expect(change.oldValue).toEqual(undefined);
      });
      test("it should not change the original item", () => {
        expect(originalObject.name).toEqual("original name");
      });
      test("it should be able to reconstruct the updated item from history", () => {
        const reconstructedObject = getObjectFromChanges(
          originalObject.id,
          history
        );
        expect(reconstructedObject).toBeDefined();
        expect(reconstructedObject!.name).toEqual("changed name");
      });

      describe("and then the item is removed from state", () => {
        beforeOnce(() => {
          history = trackRemove(history, currentObject, "remove item");
        });
        test("it should track the removal in the history", () => {
          expect(history.changes).toBeDefined();
          expect(history.changes.length).toEqual(3);
          const change = history.changes[2];
          expect(change.type).toEqual("-");
          expect(change.object).toEqual(currentObject.id);
          expect(change.action).toEqual("remove item");
        });
        test("it should return undefined when trying to reconstruct the item from history", () => {
          expect(
            getObjectFromChanges(currentObject.id, history)
          ).not.toBeDefined();
        });
      });
    });
  });
});
