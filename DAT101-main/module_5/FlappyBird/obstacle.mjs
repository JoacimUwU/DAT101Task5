"use strict";
import libSprite from "./common/libs/libSprite.mjs";
import lib2d from "./common/libs/lib2d.mjs";
import { GameProps, playSound } from "./FlappyBird.mjs";




class TObstacle {
  #upper;
  #lower;
  #spi;
  constructor(aSpriteCanvas, aSpriteInfo) {
    this.#spi = aSpriteInfo;
    const minTop = -320 + 25;
    let top = Math.floor(Math.random() * minTop);
    let pos = new lib2d.TPosition(650, top);
    this.#upper = new libSprite.TSprite(aSpriteCanvas, aSpriteInfo, pos);
    this.#upper.index = 3;
    const groundY = GameProps.ground.posY;
    top += this.#spi.height + 150;
    const gap = top - groundY - 25;

    top = Math.floor(Math.random() * gap) + groundY - 25;
    pos.y = top;
    this.#lower = new libSprite.TSprite(aSpriteCanvas, aSpriteInfo, pos);
    this.#lower.index = 2;
    this.hasPassed = false;
  }
  setDayNight(isDay) {
    this.#upper.index = isDay ? 3 : 1;
    this.#lower.index = isDay ? 2 : 0;
  }

  draw(){
    this.#upper.draw();
    this.#lower.draw();
  }

  update(){
    this.#upper.translate(-1, 0);
    this.#lower.translate(-1, 0);
    const hasCollided = 
    GameProps.hero.hasCollided(this.#upper) || 
    GameProps.hero.hasCollided(this.#lower);

    
if (hasCollided && !GameProps.hero.isDead) {
  GameProps.hero.isDead = true;

  // ---------------- TASK 4: A Deadly Encounter ----------------
  // Flappy hits a pipe — play death sound and let him fall

  playSound(GameProps.sounds.dead); //death sound only
  GameProps.hero.animateSpeed = 0;  //stop flapping
  console.log("☠️ Flappy hit a pipe and is falling...");
}


  }

  get right(){
    return this.#upper.right;
  }

  get left(){
    return this.#upper.left;
  }

  get posX(){
    return this.#upper.posX;
  }
}

export default TObstacle;
