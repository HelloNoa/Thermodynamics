import { GameObject } from '@/app/script/GameObject';
import { Game } from '@/app/script/Game';
import { clearInterval } from 'node:timers';

export class RoomManager<T extends Room> {
  private RoomList: T[] = [];
  
  private currentRoom: T | undefined;
  
  private _game: Game;
  
  get game() {
    return this._game;
  }
  
  constructor({
                game
              }: { game: Game }) {
    this._game = game;
    /*
     this.Awake();
     this.Start();
     setInterval(() => {
     this.FixedUpdate();
     this.Update();
     this.LateUpdate();
     }, this.gameTickSpeed);
     */
  }
  
  public AddRoom({
                   room,
                   roomName
                 }: {
    room?: T,
    roomName?: string
  }) {
    if (room) {
      this.RoomList.push(room);
    } else if (roomName) {
      const room = new Room({
                              roomName,
                              roomManager: this
                            });
      this.RoomList.push(room as T);
      
    } else {
      throw new Error('Error has occur');
    }
  }
  
  public FindRoom(roomName: string) {
    return this.RoomList.find(room => room.RoomName === roomName);
  }
  
  public AllRooms() {
    return this.RoomList;
  }
  
  public get CurrentRoom() {
    return this.currentRoom as T;
  }
  
  public set CurrentRoom(room: T) {
    if (room) {
      if (this.currentRoom) {
        this.currentRoom.OnDestroy();
      }
      this.currentRoom = room;
      this.currentRoom.Awake();
      // if (this.currentRoom) {
      //   (this.currentRoom as Room).Awake();
      // }
    }
  }
}

export class Room extends GameObject {
  private name: string;
  protected _gameObjects: GameObject[] = [];
  private _roomManager: RoomManager<Room>;
  private intervalId: NodeJS.Timeout | undefined;
  
  constructor({
                roomName,
                roomManager
              }: { roomName: string, roomManager: RoomManager<Room> }) {
    super();
    this._roomManager = roomManager;
    this.name = roomName;
    for (const gameobject in this._gameObjects) {
      console.log(gameobject);
    }
  }
  
  get RoomManager() {
    return this._roomManager;
  }
  
  get gameObjects(): GameObject[] {
    return this._gameObjects;
  }
  
  public AddGameObject<T extends GameObject | GameObject[]>({
                                                              gameObject,
                                                            }: {
    gameObject: T,
  }) {
    for (const gm of [gameObject].flat()) {
      this._gameObjects.push(gm);
    }
    // console.log(this._gameObjects);
    // console.log(gameObject);
  }
  
  get RoomName() {
    return this.name;
  }
  
  Awake(): void {
    console.log('Awake1');
    for (const gameObject of this._gameObjects) {
      gameObject.Awake();
    }
    this.intervalId = setInterval(() => {
      this.Update();
    }, this._roomManager.game.gameTickSpeed);
  };
  
  Update(): void {
    for (const gameObject of this._gameObjects) {
      gameObject.Update();
    }
  };
  
  OnDestroy(): void {
    clearInterval(this.intervalId);
    for (const gameObject of this._gameObjects) {
      gameObject.OnDestroy();
    }
  };
  
  OnApplicationQuit(): void {
    clearInterval(this.intervalId);
    for (const gameObject of this._gameObjects) {
      gameObject.OnApplicationQuit();
    }
  };
  
}
