import { describe, expect, test } from "@jest/globals";
import { getHistoryHandle, getObjectState } from "../src/js/stateChange";
import { beforeOnce } from "./beforeOnce";

const originalObject = {
  id: "test item",
  name: "original name",
};

describe("When", () => {
  let target: ReturnType<typeof getHistoryHandle<typeof originalObject>>;
  let currentObject: typeof originalObject;
  beforeOnce(() => {
    target = getHistoryHandle<typeof originalObject>("Test");
    target.setHistory([]);
  });
  describe("an item is added to state", () => {
    beforeOnce(() => {
      target.pushStateAdd(originalObject, "add item");
      currentObject = originalObject;
    });
    test("it should track the add in the history and it should contain the full, original item", () => {
      const history = target.getHistory();
      expect(history).toBeDefined();
      expect(history.length).toEqual(1);
      const [historyEntry] = history;
      expect(historyEntry.type).toEqual("+");
      expect(historyEntry.action).toEqual("add item");
      expect(historyEntry.newValue).toBe(originalObject);
    });
    describe("and then the item is changed", () => {
      beforeOnce(() => {
        target.pushStateChange(
          currentObject,
          "name change",
          "name",
          undefined,
          "changed name"
        );
        currentObject = { ...currentObject, name: "changed name" };
      });
      test("it should track the change in the history", () => {
        const history = target.getHistory();
        expect(history).toBeDefined();
        expect(history.length).toEqual(2);
        const historyEntry = history[1];
        expect(historyEntry.type).toEqual("c");
        expect(historyEntry.object).toEqual(originalObject.id);
        expect(historyEntry.action).toEqual("name change");
        expect(historyEntry.newValue).toEqual("changed name");
        expect(historyEntry.oldValue).toEqual(undefined);
      });
      test("it should not change the original item", () => {
        expect(originalObject.name).toEqual("original name");
      });
      test("it should be able to reconstruct the updated item from history", () => {
        const reconstructedObject = getObjectState(
          originalObject.id,
          target.getHistory()
        );
        expect(reconstructedObject).toBeDefined();
        expect(reconstructedObject!.name).toEqual("changed name");
      });

      describe("and then the item is removed from state", () => {
        beforeOnce(() => {
          target.pushStateRemove(currentObject, "remove item");
        });
        test("it should track the removal in the history", () => {
          const history = target.getHistory();
          expect(history).toBeDefined();
          expect(history.length).toEqual(3);
          const historyEntry = history[2];
          expect(historyEntry.type).toEqual("-");
          expect(historyEntry.object).toEqual(currentObject.id);
          expect(historyEntry.action).toEqual("remove item");
        });
        test("it should return undefined when trying to reconstruct the item from history", () => {
          expect(
            getObjectState(currentObject.id, target.getHistory())
          ).not.toBeDefined();
        });
      });
    });
  });
});
