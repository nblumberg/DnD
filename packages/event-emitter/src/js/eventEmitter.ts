export interface DataChangeHandler<T> {
  (data: T): void;
}

export interface PropertyChangeHandler<T, P extends keyof T> {
  (value: T[P]): void;
}

type PropertyListeners<T> = {
  [P in keyof T]?: Set<PropertyChangeHandler<T, P>>;
};

export interface AddListener<T> {
  (handler: DataChangeHandler<T>): T;
}

export interface AddPropertyListener<T> {
  <P extends keyof T>(property: P, handler: PropertyChangeHandler<T, P>): T[P];
}

export interface RemoveListener<T> {
  <P extends keyof T>(
    ...args:
      | []
      | [DataChangeHandler<T>]
      | [PropertyChangeHandler<T, P>, P]
      | [undefined, P]
  ): void;
}

export interface SetData<T> {
  (data: Partial<T>, deleteUndefined?: boolean): void;
}

export function createEventEmitter<T>(data: T): {
  addListener: AddListener<T>;
  addPropertyListener: AddPropertyListener<T>;
  removeListener: RemoveListener<T>;
  setData: SetData<T>;
} {
  const allDataListeners: Set<DataChangeHandler<T>> = new Set();

  // TODO: WeakMap?
  const propertyChangeListeners: PropertyListeners<T> = {};

  function addHandler<P extends keyof T>(
    key: P,
    handler: PropertyChangeHandler<T, P>
  ): void {
    let set: Set<PropertyChangeHandler<T, P>>;
    if (!Object.prototype.hasOwnProperty.call(propertyChangeListeners, key)) {
      set = new Set();
      propertyChangeListeners[key] = set;
    }
    set = propertyChangeListeners[key]!;
    set.add(handler);
  }

  return {
    addListener(handler) {
      allDataListeners.add(handler);
      return { ...data };
    },

    addPropertyListener(property, handler) {
      addHandler(property, handler);
      return data[property];
    },

    removeListener(...args) {
      const [handler, property] = args;
      if (args.length === 0) {
        // Remove all listeners
        allDataListeners.clear();
        Object.keys(propertyChangeListeners).forEach((key) => {
          delete propertyChangeListeners[key as keyof T];
        });
      } else if (!property) {
        allDataListeners.delete(handler as DataChangeHandler<T>);
      } else {
        if (
          !Object.prototype.hasOwnProperty.call(
            propertyChangeListeners,
            property
          )
        ) {
          return;
        }
        if (handler) {
          propertyChangeListeners[property]!.delete(
            handler as PropertyChangeHandler<T, typeof property>
          );
        } else {
          delete propertyChangeListeners[property];
        }
      }
    },

    setData(newData, deleteUndefined = false) {
      const oldData = { ...data };
      if (deleteUndefined) {
        Object.keys(data as object).forEach(
          (key) => delete data[key as keyof T]
        );
      }
      Object.assign(data as object, newData);
      for (const listeners of allDataListeners.values()) {
        listeners({ ...data });
      }
      for (const property in propertyChangeListeners) {
        const dataKey: keyof T = property;
        if (oldData[dataKey] !== data[dataKey]) {
          let result: any;
          if (Array.isArray(data[dataKey])) {
            result = [...(data[dataKey] as any[])];
          } else if (data[dataKey] && typeof data[dataKey] === "object") {
            result = { ...(data[dataKey] as object) };
          } else {
            result = data[dataKey];
          }
          for (const listener of propertyChangeListeners[property]!.values()) {
            listener(result);
          }
        }
      }
    },
  };
}
