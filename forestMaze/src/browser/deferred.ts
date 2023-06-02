interface Deferred<T> extends Promise<T> {
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
}

export interface VoidDeferred extends Deferred<void> {
  resolve: () => void;
  reject: (reason?: any) => void;
}

export function createDeferred<T>() : Deferred<T> {
  let resolve: (value: T) => void;
  let reject: (reason?: any) => void;
  const deferred: Partial<Deferred<T>> = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  deferred.resolve = resolve!;
  deferred.reject = reject!;
  return deferred as Deferred<T>;
}

export function createVoidDeferred<T>() : Deferred<void> {
  let resolve: () => void;
  let reject: (reason?: any) => void;
  const deferred: Partial<VoidDeferred> = new Promise((_resolve, _reject) => {
    resolve = _resolve as () => void;
    reject = _reject;
  });
  deferred.resolve = resolve!;
  deferred.reject = reject!;
  return deferred as VoidDeferred;
}
