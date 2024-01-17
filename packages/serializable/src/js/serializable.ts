export class Serializable<C> {
  /** Clone this object, stripping out functions, circular references, and private-style-named members */
  raw(nodes?: WeakSet<any>): C {
    const json = this.asJSON(nodes);
    return JSON.parse(json);
  }

  /**
   * NOTE: "toJSON" seems to be called by JSON.stringify, causing infinite recursion, though I can't find any documentation on it.
   */
  asJSON(nodes?: WeakSet<any>): string {
    if (!nodes) {
      nodes = new WeakSet();
    }
    nodes?.add(this);
    const json = JSON.stringify(
      this,
      (key, value) => {
        if (key === "" && value === this) {
          return this;
        }
        if (typeof value === "function") {
          return undefined;
        }
        if (nodes?.has(value)) {
          return undefined;
        }
        if (value && typeof value === "object" && !Array.isArray(value)) {
          if ("raw" in value && typeof value.raw === "function") {
            return value.raw(nodes);
          }
          const proto = Object.getPrototypeOf(value);
          if (proto !== Object.prototype && proto !== Date.prototype) {
            // TODO: other built-in types?
            console.warn(`Encountered unserializeable object ${key}`);
          }
        }
        return value;
      },
      "  "
    );
    nodes.delete(this);
    return json;
  }

  toString(): string {
    return this.asJSON();
  }
}

/** Create a new type from a class that just has it's members and not its methods */
export type ClassMembers<C> = {
  [K in keyof C as C[K] extends Function ? never : K]: C[K];
};

// type Acyclical<C> = {
//   [K in keyof C]: C[K] extends C ? never : C[K];
// };

// type ToPOJO<C> = {
//   [K in keyof C]: C[K] extends AnyClass ? ToPOJO<C[K]> : C[K];
// };

// type Raw<C> = ClassMembers<ToPOJO<Acyclical<C>>>;

// class TestChild {
//   array: number[] = [1, 2, 3];
//   b = true;
//   child = { test: true };
//   num = 666;
//   self = this;
//   test(): void {}
// }

// class Test {
//   array: number[] = [1, 2, 3];
//   b = true;
//   child = { test: true };
//   complex = new TestChild();
//   cycle = new Test();
//   num = 666;
//   self = this;
//   test(): void {}
// }

// type TestRaw = ClassMembers<Test>;
