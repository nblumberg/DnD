import { APIObject } from "../builtIns";

/**
 * Gets a set of properties from an APIObject and returns them as a POJO
 * @param {APIObject} apiObject https://help.roll20.net/hc/en-us/articles/360037772793-API-Objects
 * @param  {...string} properties The APIObject properties to get
 * @returns A POJO of the selected properties
 */
export function extractProperties<T extends APIObject, K extends keyof T>(
  apiObject: T,
  properties: K[]
): Pick<T, K> {
  const values: Pick<T, K> = {} as unknown as Pick<T, K>;
  properties.forEach((prop) => {
    values[prop] = apiObject.get(prop);
  });
  return values;
}
