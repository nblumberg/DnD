export {};
declare global {
  /**
   * Schedules a function to run after a delay (milliseconds). Returns a numeric timer ID.
   * @param handler The function to call after the delay.
   * @param timeout Delay in milliseconds. Defaults to 0.
   * @returns A numeric ID that can be passed to clearTimeout to cancel the timer.
   */
  function setTimeout(handler: (...args: unknown[]) => void, timeout?: number): number;

  /**
   * Cancels a timer previously established by setTimeout.
   * @param id The timer ID returned by setTimeout.
   */
  function clearTimeout(id?: number): void;

  /**
   * Schedules a function to run repeatedly at a fixed interval (milliseconds). Returns a numeric timer ID.
   * @param handler The function to call on each interval.
   * @param timeout Interval in milliseconds.
   * @returns A numeric ID that can be passed to clearInterval to cancel the timer.
   */
  function setInterval(handler: (...args: unknown[]) => void, timeout?: number): number;

  /**
   * Cancels a repeating timer previously established by setInterval.
   * @param id The timer ID returned by setInterval.
   */
  function clearInterval(id?: number): void;
}
