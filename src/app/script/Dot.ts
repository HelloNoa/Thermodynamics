import { Clamp, RandomTemperature, RandomTemperatureColorHex, ShuffleArray } from '@/util/util';
import { Coordinate, Global } from '@/app/UserScript/main';
import { GameObject } from '@/app/script/GameObject';
import { Room } from '@/app/script/Room';

export class Dot extends GameObject {
  
  private position: Coordinate;
  private isFalling: boolean = true;
  private color: string = 'ff0000';
  private temperature: number = 0;
  private _specificHeat: number = 1;
  
  private _currentRoom: Room | undefined;
  
  get CurrentRoom() {
    return this._currentRoom;
  }
  
  set CurrentRoom(value) {
    this._currentRoom = value;
  }
  
  constructor(Position: Coordinate) {
    super();
    this.position = Position;
    // this.color = RandomHexColor();
    this.temperature = RandomTemperature();
    this.color = RandomTemperatureColorHex(this.temperature);
    this.specificHeat = Math.random() * 41.86 + 1;
  }
  
  
  Awake = (): void => {
  
  };
  
  Update = (): void => {
    this.fall();
    this.thermal_conduction();
  };
  
  public get specificHeat() {
    return this._specificHeat;
  }
  
  public set specificHeat(value: number) {
    this._specificHeat = value;
  }
  
  public get getPosition() {
    return this.position;
  }
  
  public get getColor() {
    return this.color;
  }
  
  public get getTemperature() {
    return this.temperature;
  }
  
  public set setTemperature(value: number) {
    this.color = RandomTemperatureColorHex(value);
    this.temperature = value;
  }
  
  public fall() {
    this.position = this.canFall(this.position, {
      x: this.position.x,
      y: this.position.y + 1
    });
    this.side();
  }
  
  public side() {
    // if (!this.isFalling) {
    if (Math.random() > 0.1) {
      let x = 0;
      if (Math.random() > 0.5) {
        x = Clamp(this.position.x - 1, 0, Global.canvas.width - 1);
      } else {
        x = Clamp(this.position.x + 1, 0, Global.canvas.width - 1);
      }
      this.position = this.canFall(this.position, {
        x: x,
        y: this.position.y
      });
    }
    // }
  }
  
  public thermal_conduction() {
    const _positionList: Coordinate[] = [
      {
        x: this.getPosition.x - 1,
        y: this.getPosition.y
      },
      {
        x: this.getPosition.x + 1,
        y: this.getPosition.y
      },
      {
        x: this.getPosition.x,
        y: this.getPosition.y - 1
      },
      {
        x: this.getPosition.x,
        y: this.getPosition.y + 1
      },
    ];
    ShuffleArray<Coordinate>(_positionList)
      .forEach(_position => {
        if (_position.x < 0 || _position.x >= Global.canvas.width || _position.y < 0 || _position.y >= Global.canvas.height) {
          return;
        }
        // try {
        if (Global.map[_position.x][_position.y] instanceof Dot) {
          const _dot = Global.map[_position.x][_position.y] as Dot;
          // const temp = 0.01 * this.CurrentRoom!.RoomManager.game.gameTickSpeed * 100;
          const _middle = (this.getTemperature + _dot.getTemperature) / 2;
          const _v = Math.abs((this.getTemperature - _dot.getTemperature) /2 /*/ temp*/);
          if (Math.abs(this.getTemperature - _dot.getTemperature) < 1) {
            this.setTemperature = _middle;
            _dot.setTemperature = _middle;
          } else {
            if (this.getTemperature > _dot.getTemperature) {
              // this.setTemperature = this.getTemperature - (_v * (1 / this.specificHeat));
              // _dot.setTemperature = _dot.getTemperature + (_v * (1 / _dot.specificHeat));
              this.setTemperature = this.getTemperature - (_v / this.specificHeat);
              _dot.setTemperature = _dot.getTemperature + (_v / _dot.specificHeat);
            } else {
              this.setTemperature = this.getTemperature + (_v / this.specificHeat);
              _dot.setTemperature = _dot.getTemperature - (_v / _dot.specificHeat);
            }
          }
          
          this.color = RandomTemperatureColorHex(this.getTemperature);
          _dot.color = RandomTemperatureColorHex(_dot.getTemperature);
        }
        // } finally {
        //   this.color = RandomTemperatureColorHex(this.getTemperature);
        // }
      });
    // console.log(Global.map[this.getPosition.x - 1][this.getPosition.y] instanceof Dot);
    // console.log(Global.map[this.getPosition.x + 1][this.getPosition.y] instanceof Dot);
    // console.log(Global.map[this.getPosition.x][this.getPosition.y - 1] instanceof Dot);
    // console.log(Global.map[this.getPosition.x][this.getPosition.y + 1] instanceof Dot);
  }
  
  private canFall(_old: Coordinate, _new: Coordinate) {
    if (Global.map[_new.x][_new.y] === 0) {
      Global.map[_old.x][_old.y] = 0;
      Global.map[_new.x][_new.y] = this;
      return _new;
    } else {
      return _old;
    }
  }
  
}

