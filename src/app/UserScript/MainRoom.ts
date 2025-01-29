import { Room, RoomManager } from '@/app/script/Room';
import { Coordinate, Global } from '@/app/UserScript/main';
import { Dot } from '@/app/script/Dot';

export class MainRoom extends Room {
  private MainRoomintervalId: NodeJS.Timeout | undefined;
  
  constructor({ roomManager }: { roomManager: RoomManager<Room> }) {
    super({
            roomName   : 'main',
            roomManager: roomManager
          });
  }
  
  Awake(): void {
    // Room.prototype.Awake.call(this);
    super.Awake();
    // this.init();
    // this.test2();
    // const x = 64;
    // const y = 64;
    // const _dot = new Dot({
    //                        x: x,
    //                        y: y
    //                        // y: Math.floor(Math.random() * Global.canvas.height)
    //                      });
    // const _dot2 = new Dot({
    //                        x: x+2,
    //                        y: y
    //                        // y: Math.floor(Math.random() * Global.canvas.height)
    //                      });
    // _dot.setTemperature = -273;
    // _dot2.setTemperature = 273;
    // Global.map[x][y] = _dot;
    // Global.map[x+2][y] = _dot2;
    // _dot.CurrentRoom = this;
    // _dot2.CurrentRoom = this;
    // this.AddGameObject({ gameObject: _dot });
    // this.AddGameObject({ gameObject: _dot2 });
    this.MainRoomintervalId = setInterval(() => {
      this.addDotByCount(10);
    }, this.RoomManager.game.gameTickSpeed);
  };
  
  Update(): void {
    super.Update();
    const canvas = Global.canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (context) {
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (const gameObject of this._gameObjects) {
        if (gameObject instanceof Dot) {
          context.fillStyle = gameObject.getColor;
          // if(gameObject.getPosition.x%2 === 1){
          //   context.translate(-.5, 0);
          // }
          // if(gameObject.getPosition.y%2 === 1){
          //   context.translate(0, -.5);
          // }
          context.fillRect(gameObject.getPosition.x, gameObject.getPosition.y, 1, 1);
          context.setTransform(1, 0, 0, 1, 0, 0);
        }
      }
    }
  };
  
  OnDestroy(): void {
    super.OnDestroy();
    clearInterval(this.MainRoomintervalId);
  };
  
  OnApplicationQuit(): void {
    super.OnApplicationQuit();
    clearInterval(this.MainRoomintervalId);
  }
  
  init(): void {
    console.log('init');
    for (let x = 0; x < Global.canvas.width; x++) {
      for (let y = Global.canvas.height - 1; y >= Global.canvas.height * 0; y--) {
        const _dot = new Dot({
                               x: x,
                               y: y
                               // y: Math.floor(Math.random() * Global.canvas.height)
                             });
        _dot.setTemperature = -273;
        if (x === 64 && y === 64) {
          _dot.setTemperature = 4_000_000;
        }
        Global.map[x][y] = _dot;
        _dot.CurrentRoom = this;
        this.AddGameObject({
                             gameObject: _dot,
                           });
        // this._dots.push(_dot);
      }
    }
  }
  
  test2(): void {
    console.log('test2');
    let temp = 0;
    for (let y = Global.canvas.height - 1; y >= Global.canvas.height * 0; y--) {
      for (let x = 0; x < Global.canvas.width; x++) {
        const _dot = new Dot({
                               x: x,
                               y: y
                               // y: Math.floor(Math.random() * Global.canvas.height)
                             });
        _dot.setTemperature = -273 + (temp++);
        Global.map[x][y] = _dot;
        _dot.CurrentRoom = this;
        this.AddGameObject({ gameObject: _dot });
      }
    }
  }
  
  private addDotByCount(count: number) {
    let isFull = true;
    Global.map.forEach((row) => {
      row.forEach((cell) => {
        if (!(cell instanceof Dot)) {
          isFull = false;
        }
      });
    });
    if (isFull) return;
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * Global.canvas.width);
      if (Global.map[x][0] === 0) {
        const _dot = new Dot({
                               x: x,
                               y: 0
                               // y: Math.floor(Math.random() * Global.canvas.height)
                             });
        Global.map[x][0] = _dot;
        _dot.CurrentRoom = this;
        this.AddGameObject({ gameObject: _dot });
        // this._dots.push(_dot);
      } else {
        console.log('already exist');
      }
    }
  }
  
  drawLine = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
    const canvas: HTMLCanvasElement = Global.canvas;
    const context = canvas.getContext('2d', { alpha: false });
    
    // context.webkitImageSmoothingEnabled = false;
    // context.mozImageSmoothingEnabled = false;
    if (context) {
      context.imageSmoothingEnabled = false;
      context.setTransform(1, 0, 0, 1, 0, 0);
      // context.translate(.5, .5);
      context.strokeStyle = 'red';
      context.lineWidth = 1;
      context.lineCap = 'butt';
      context.lineJoin = 'miter';
      // context.imageSmoothingEnabled = false;
      
      context.beginPath();
      context.moveTo(originalMousePosition.x, originalMousePosition.y);
      context.lineTo(newMousePosition.x, newMousePosition.y);
      context.closePath();
      
      context.stroke();
      
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.fillStyle = 'red';
      context.fillRect(10, 10, 1, 1);
    }
  };
}
