import { Room, RoomManager } from '@/app/script/Room';
import { GameObject } from '@/app/script/GameObject';

export class Game extends GameObject {
  Awake = (): void => {
    throw new Error('Method not implemented.');
  };
  
  Start = (): void => {
    throw new Error('Method not implemented.');
  };
  
  FixedUpdate = (): void => {
    throw new Error('Method not implemented.');
  };
  
  OnTrigger = (): void => {
    throw new Error('Method not implemented.');
  };
  
  OnCollision = (): void => {
    throw new Error('Method not implemented.');
  };
  
  Update = (): void => {
    throw new Error('Method not implemented.');
  };
  
  LateUpdate = (): void => {
    throw new Error('Method not implemented.');
  };
  
  OnDestory = (): void => {
    throw new Error('Method not implemented.');
  };
  
  OnApplicationQuit = (): void => {
    throw new Error('Method not implemented.');
  };
  
  get RoomManager() {
    return this._roomManager;
  }
  
  private _roomManager: RoomManager<Room>;
  public gameTickSpeed: number = 1000;
  
  constructor() {
    super();
    this._roomManager = new RoomManager({
                                          game: this
                                        });
    
  }
  
}

