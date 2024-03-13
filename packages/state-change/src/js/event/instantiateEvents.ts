import { preExistingUniqueId } from "../util/unique";
import { ChangeEvent } from "./changeEvent";
import { History, IChangeEvent } from "./types";

const typeMap: { [key: string]: { new (...args: any[]): ChangeEvent } } = {};

export function registerType(
  type: string,
  constructor: { new (...args: any[]): ChangeEvent }
): void {
  typeMap[type] = constructor;
}

export function instantiateEvents(
  events: IChangeEvent[],
  history: History
): ChangeEvent[] {
  return events.map((item) => {
    preExistingUniqueId(item.id);
    const constructor = typeMap[item.type];
    if (!constructor) {
      throw new Error(`No constructor for type ${item.type}`);
    }
    return new constructor({ ...item, history });
  });
}
