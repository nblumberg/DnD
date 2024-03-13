import { Unique } from "../util/unique";
import { StateChange } from "./types";

export function toggleStateChange<T extends Unique, P extends keyof T>(
  action: "apply" | "undo",
  change: StateChange<T, P>,
  object: T
): T {
  if (change.object !== object.id) {
    throw new Error(
      `Attempting to ${action} state change ${change.id} (${change.object}) to object ${object.id}`
    );
  }
  const { property } = change;
  const value = action === "apply" ? change.newValue : change.oldValue;
  const type = typeof (object[property] ?? value);
  switch (type) {
    case "bigint":
    case "boolean":
    case "number":
    case "string":
    case "symbol":
    case "undefined":
      if (value === undefined) {
        return Object.fromEntries(
          Object.entries(object).filter(([key]) => key !== property)
        ) as T;
      }
      return {
        ...object,
        [property]: value,
      };
    case "object":
      if (Array.isArray(value)) {
        return {
          ...object,
          [property]: value,
        };
      } else if (!value) {
        if (change.type === "c+" || change.type === "c-") {
          return {
            ...object,
            [property]: Object.fromEntries(
              Object.entries(object[property]).filter(
                ([key]) =>
                  !Object.prototype.hasOwnProperty.call(
                    change.oldValue ?? change.newValue,
                    key
                  )
              )
            ),
          };
        } else {
          return Object.fromEntries(
            Object.entries(object).filter(([key]) => key !== property)
          ) as T;
        }
      }
      return {
        ...object,
        [property]: { ...object[property], ...value },
      };
    case "function":
    default:
      throw new Error(
        `Cannot ${action} state change ${change.id} (${
          change.object
        }) to object ${object.id} property ${String(property)} of type ${type}`
      );
  }
}
