export function checkMemoryUsage(): void {
  const { heapUsed, heapTotal } = process.memoryUsage();
  const memoryUsage = (heapUsed / heapTotal) * 100;
  console.log(`[memory ${memoryUsage}%]`);
  if ((heapUsed / heapTotal) * 100 > 95) {
    console.warn("Waiting on garbage collection");
    if (global.gc) {
      global.gc();
    } else {
      console.log(
        "Garbage collection unavailable.  Pass --expose-gc when launching node to enable forced garbage collection."
      );
    }
  }
}
