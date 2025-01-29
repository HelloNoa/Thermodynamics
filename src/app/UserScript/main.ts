import { Dot } from '@/app/script/Dot';
import { Game } from '@/app/script/Game';

export interface Coordinate {
  x: number;
  y: number;
}

export class Global {
  public static canvas: HTMLCanvasElement;
  public static map: number[][] | Dot[][];
  public static game:Game;
  
  public static ResetMap() {
    Global.map = Array.from({ length: Global.canvas.width }, () => new Array(Global.canvas.height).fill(0));
  }
}
