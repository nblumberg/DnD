export interface Unique extends Record<string, any> {
  id: string;
}

export function getUniqueId(): string {
  return `${Date.now()}-${Math.random()}`;
}
