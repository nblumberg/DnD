export interface AsyncKey {
  unlock: () => void;
}

export function createAsyncLock(key: AsyncKey): () => Promise<void> {
  let lastPromise = Promise.resolve();

  return () => lastPromise.then(() => {
    const promise = new Promise<void>((resolve) => {
      key.unlock = resolve;
    });
    lastPromise = promise;
    return promise;
  });
}
