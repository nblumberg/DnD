export type DefaultDirection = 'up' | 'right' | 'down' | 'left';
export type DirectionArray = [string, string, string, string];
export const defaultDirections: DefaultDirection[] = ['up', 'right', 'down', 'left'];

export const directions: DirectionArray = [...(defaultDirections as [string, string, string, string])];

export function translateDirection(defaultDirection: DefaultDirection): string {
  return directions[defaultDirections.indexOf(defaultDirection)];
}
