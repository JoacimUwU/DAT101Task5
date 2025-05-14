"use strict";
import lib2d from "./common/libs/lib2d.mjs";
import libSprite from "./common/libs/libSprite.mjs";
import { GameProps, EGameStatus, playSound } from "./FlappyBird.mjs";



class THero extends libSprite.TSprite {
  #spi;
  #gravity = 9.81 / 100;
  #velocity = 0;
  #sineWave;
  constructor(aSpriteCanvas, aSpriteInfo, aPosition) {
    super(aSpriteCanvas, aSpriteInfo, aPosition);
    this.#spi = aSpriteInfo;
    this.animateSpeed = 10;
    this.isDead = false;
    this.rotation = 0;
    this.#sineWave = new lib2d.TSineWave(1.5, 2);
    this.hasLanded = false;

  }

  draw() {
    super.draw();
  }

  update() {
    const groundY = GameProps.ground.posY;
    const bottomY = this.posY + this.#spi.height;
    if (bottomY < groundY) {
      if (this.posY < 0) {
        this.posY = 0;
        this.#velocity = 0;
      }
      this.translate(0, this.#velocity);
      this.rotation = this.#velocity* 10;
      this.#velocity += this.#gravity;
    } else {
      this.posY = groundY - this.#spi.height;
      if (!this.hasLanded) {
        this.hasLanded = true;
      
        // ---------------- TASK 5: Game Over! ----------------
        // Flappy has landed — now play game over sound and show screen
      
        playSound(GameProps.sounds.gameOver);
        GameProps.status = EGameStatus.gameOver;
        this.animateSpeed = 0;
        GameProps.sounds.running.stop();
        console.log("🎮 GAME OVER triggered by ground impact");
      }
      
    }
    
  }

  flap() {
    this.#velocity = -3;
  }

  updateIdle(){
    this.translate(0, this.#sineWave.value);
  }

}

export default THero;
