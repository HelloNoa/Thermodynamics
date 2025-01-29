import { Dot } from '@/app/script/Dot';

export interface Coordinate {
  x: number;
  y: number;
}

export class Global {
  public static canvas: HTMLCanvasElement;
  public static map: number[][] | Dot[][];
}
