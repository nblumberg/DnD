export interface Unique extends Record<string, any> {
  id: string;
}
let i = 0;

export function getUniqueId(): string {
  return `${i++}`;
  // return `${Date.now()}-${Math.random()}`;
}

export function preExistingUniqueId(id: string): void {
  const x = parseInt(id, 10);
  i = x + 1;
}
