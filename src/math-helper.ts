export interface Vector2 {
  x: number;
  y: number;
}

export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
