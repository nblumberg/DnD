export class Serializable {
  /** Clone this object, stripping out functions, circular references, and private-style-named members */
  raw(nodes?: any[]): any | undefined {
    if (!nodes) {
      nodes = [];
    }
    if (nodes.indexOf(this) !== -1) {
      // skip circular references
      return;
    }
    nodes.push(this);
    const r: Record<string, any> = {};
    for (const p in this) {
      const value: any = this[p];
      if (
        Object.prototype.hasOwnProperty.call(this, p) &&
        isSerializable(p, value)
      ) {
        if (value === null) {
          r[p] = null;
        } else if (
          typeof value === "object" &&
          typeof value?.raw === "function"
        ) {
          // has complex properties with .raw()
          r[p] = value.raw(nodes);
        } else if (Array.isArray(value)) {
          r[p] = rawArray(value, nodes);
        } else {
          r[p] = rawObj(value, nodes);
        }
      }
    }
    nodes.pop();
    return r;
  }

  toJSON(): string {
    return JSON.stringify(this.raw(), null, "  ");
  }

  toString(): string {
    return this.toJSON();
  }
}

function rawObj(obj: object, nodes?: any[]): object | undefined {
  if (!nodes) {
    nodes = [];
  }
  if (
    typeof obj === "undefined" ||
    obj === null ||
    typeof obj === "function" ||
    nodes.includes(obj)
  ) {
    // skip undefined, null, Function, or circular references
    return;
  } else if (typeof obj === "object") {
    if (typeof (obj as any)?.raw === "function") {
      return (obj as Serializable).raw(nodes);
    } else if (Array.isArray(obj)) {
      return rawArray(obj, nodes);
    } else {
      return Serializable.prototype.raw.call(obj, nodes);
    }
  } else {
    return obj; // obj is a String or raw data type
  }
}

function rawArray(array: any[], nodes?: any[]): any[] | undefined {
  if (!nodes) {
    nodes = [];
  }
  if (!Array.isArray(array) || nodes.indexOf(array) !== -1) {
    // TODO: don't stop nesting equivalent Arrays or multiple instances of [ 1, 2, 3 ] can't occur
    return;
  }
  nodes.push(array); // TODO: don't filter out empty Arrays
  const r = [...array.map((entry) => rawObj(entry))];
  nodes.pop();
  return r;
}

const HTMLElementConstructor = global.HTMLElement ?? class NeverMatch {};

function isSerializable(name: string, obj: any): boolean {
  return (
    typeof obj !== "function" &&
    !(obj instanceof HTMLElementConstructor) &&
    // !(obj instanceof jQuery) &&
    name.indexOf("$") !== 0 &&
    name.indexOf("$") !== 1 &&
    name.indexOf("__") !== 0
  );
}
