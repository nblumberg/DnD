/**
 * Prevent multiple high frequency calls to the function, only taking the latest call within timeout
 * @param {Function} fn The function to debounce
 * @param {number} [timeout=300] The time to delay
 * @returns
 */
export function debounce(fn: Function, timeout = 300) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(null, args);
    }, timeout);
  };
}
