export interface AsyncKey {
  unlock: () => void;
}

export function createAsyncLock(): (key: AsyncKey) => Promise<void> {
  let lastPromise = Promise.resolve();

  return (key: AsyncKey) => lastPromise.then(() => {
    const promise = new Promise<void>((resolve) => {
      key.unlock = resolve;
    });
    lastPromise = promise;
  });
}
