'use client';
import styles from './page.module.css';
import React, { useEffect, useRef, useState } from 'react';
import { Dot } from '@/app/script/Dot';
import { Coordinate, Global } from '@/app/UserScript/main';
import { Game } from '@/app/script/Game';
import { MainRoom } from '@/app/UserScript/MainRoom';


export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [degree, setDegree] = useState(0);
  const [specificHeat, setSpecificHeat] = useState(0);
  const [mousePosition, setMousePosition] = useState<Coordinate>({
                                                                   x: 0,
                                                                   y: 0
                                                                 });
  
  useEffect(() => {
    const cnv = canvasRef.current;
    if (!cnv) {
      return;
    }
    Global.canvas = canvasRef.current as HTMLCanvasElement;
    Global.map = Array.from({ length: Global.canvas.width }, () => new Array(Global.canvas.height).fill(0));
    
    
    const game = new Game();
    game.gameTickSpeed = 100;
    const _mainRoom = new MainRoom({ roomManager: game.RoomManager });
    game.RoomManager.AddRoom({
                               room: _mainRoom
                             });
    // _mainRoom.AddGameObject({ gameObject: dotList.dots });
    game.RoomManager.CurrentRoom = _mainRoom;
    
  }, []);
  
  
  useEffect(() => {
    const updatedDegree = () => {
      if (mousePosition.x < 0 || mousePosition.y < 0 || mousePosition.x >= Global.canvas.width || mousePosition.y >= Global.canvas.height) {
        return;
      }
      const x = mousePosition.x;
      const y = mousePosition.y;
      // console.log(x,y)
      // console.log(Global.canvas.getBoundingClientRect())
      if (Global.map[x][y] instanceof Dot) {
        const _t = 1;
        const temp = (Global.map[x][y] as Dot).getTemperature;
        setDegree(Math.floor(temp * _t) / _t);
        const _specificHeat = (Global.map[x][y] as Dot).specificHeat;
        setSpecificHeat(Math.floor(_specificHeat * _t) / _t);
      }
    };
    const updatedDegreeId = setInterval(updatedDegree, 10);
    return () => {
      clearInterval(updatedDegreeId);
    };
  }, [mousePosition]);
  
  const Move = (e: TouchEvent | MouseEvent) => {
    let _x;
    let _y;
    if ((e as TouchEvent).touches) {
      e = e as TouchEvent;
      _x = e.touches[0].clientX - Global.canvas.getBoundingClientRect().left;
      _y = e.touches[0].clientY - Global.canvas.getBoundingClientRect().top;
    } else {
      e = e as MouseEvent;
      _x = e.clientX - Global.canvas.getBoundingClientRect().left;
      _y = e.clientY - Global.canvas.getBoundingClientRect().top;
    }
    const transform = Global.canvas.getContext('2d')!.getTransform();
    // console.log(
    //   Math.floor((_x - transform.e) / transform.a / 6),
    //   Math.floor((_y - transform.f) / transform.d/6))
    const _temp = Global.canvas.clientWidth / Global.canvas.width;
    const x = Math.floor((_x - transform.e) / transform.a / _temp);
    const y = Math.floor((_y - transform.f) / transform.d / _temp);
    setMousePosition({
                       x,
                       y
                     });
  };
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div id={styles.game}>
          <canvas ref={canvasRef} width={'128px'} height={'128px'} style={{ 'imageRendering': 'pixelated' }}
                  onTouchMove={Move as () => void}
                  onMouseMove={Move as () => void}>
          </canvas>
          <p className={styles.degree}>{degree.toLocaleString()}°C <br/>{specificHeat.toLocaleString()}J/kg·℃</p>
        </div>
      </main>
    </div>
  );
}
