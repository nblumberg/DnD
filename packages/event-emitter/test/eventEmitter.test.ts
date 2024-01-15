import { describe, expect, test } from "@jest/globals";
import { createEventEmitter } from "../src/js/eventEmitter";

interface TestData {
  array: number[];
  bool: boolean;
  num: number;
  obj: { a: number };
  str: string;
}

const initialData: TestData = {
  array: [1, 2, 3],
  bool: true,
  num: 1,
  obj: { a: 1 },
  str: "test",
};
const changes: Partial<TestData>[] = [
  { array: [4, 5, 6] },
  { bool: false },
  { num: 6 },
  { obj: { a: 2 } },
  { str: "test2" },
];

describe("createEventEmitter", () => {
  let eventEmitter: ReturnType<typeof createEventEmitter<TestData>>;

  test('it should register a listener with "addListener" and trigger it with "setData"', () => {
    eventEmitter = createEventEmitter({ ...initialData });

    const callback = jest.fn();
    eventEmitter.addListener(callback);

    let expected = { ...initialData };
    changes.forEach((change) => {
      eventEmitter.setData(change);

      expected = { ...expected, ...change };
      expect(callback).toHaveBeenCalledWith(expected);
    });
  });

  test('it should register a listener for a specific property with "addPropertyListener" and trigger is with "setData" only of that property', () => {
    for (const property of Object.keys(initialData)) {
      eventEmitter = createEventEmitter({ ...initialData });

      const callback = jest.fn();
      eventEmitter.addPropertyListener(property as keyof TestData, callback);
      changes.forEach((change) => {
        eventEmitter.setData(change);

        if (change.hasOwnProperty(property)) {
          expect(callback).toHaveBeenCalledWith(change[property]);
        } else {
          expect(callback).not.toHaveBeenCalled();
        }
        callback.mockClear();
      });
    }
  });

  test('it should unregister a listener with "removeListener"', () => {
    eventEmitter = createEventEmitter({ ...initialData });
    const listeners: jest.Mock<any, any, any>[] = [];
    listeners.push(jest.fn());
    eventEmitter.addListener(listeners[0]);
    eventEmitter.removeListener(listeners[0]);
    for (const property of Object.keys(initialData)) {
      const propertyListener = jest.fn();
      listeners.push(propertyListener);
      eventEmitter.addPropertyListener(
        property as keyof TestData,
        propertyListener
      );
      eventEmitter.removeListener(propertyListener, property as keyof TestData);
    }

    changes.forEach((change) => {
      eventEmitter.setData(change);

      listeners.forEach((listener) => {
        expect(listener).not.toHaveBeenCalled();
      });
    });
  });
});
