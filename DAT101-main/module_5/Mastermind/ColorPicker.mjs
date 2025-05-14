// ---------------- Task 5: Drag, Drop, and Replace Logic ----------------
// This class handles all drag and drop logic for player pegs:
// - snapping to row
// - cloning from palette
// - removing or returning pegs

"use strict";
import lib2D from "./common/libs/lib2d_v2.mjs";
import libSprite from "./common/libs/libSprite_v2.mjs";
import MastermindBoard from "./MastermindBoard.mjs";
import { GameProps } from "./Mastermind.mjs";

const Positions = MastermindBoard.ColorPicker;

// ---------------- Task 2: Color Pickers ----------------
// Custom draggable class for player's colored pegs (extends TSpriteDraggable)
export class TColorPicker extends libSprite.TSpriteDraggable {
  #spcvs;
  #spi;
  #color;
  #snapPos;
  #snapIndex;
  #hasMoved;
  #isFromPalette; // NEW: tracks if peg was dragged from palette

  constructor(spcvs, spriteInfo, color, index){
    super(spcvs, spriteInfo, Positions[color]);
    this.index = index;
    this.snapTo = GameProps.snapTo;
    this.#spcvs = spcvs;
    this.#spi = spriteInfo;
    this.#color = color;
    this.#snapPos = null;
    this.#hasMoved = false;
    this.#snapIndex = -1;
    this.#isFromPalette = true; // by default, pegs start from palette
  }

  // Task 5: Prevent double-snap
  // Only allow snapping to positions that are still available (not taken)
  onCanDrop(aDropPos){
    return GameProps.snapTo.positions.includes(aDropPos);
  }

  // Task 5: Clone the color peg and mark it as placed (not from palette)
  clone(){
    const clone = new TColorPicker(
      this.#spcvs,
      this.#spi,
      this.#color,
      this.index
    );
    clone.#isFromPalette = false;
    return clone;
  }

  // Task 5: Snap peg to available point in current row and register it in GameProps
  onDrop(aDropPosition){
    GameProps.colorPickers.push(this.clone());
    this.#snapIndex = GameProps.snapTo.positions.indexOf(aDropPosition);
    this.#snapPos = new lib2D.TPoint(
      GameProps.snapTo.positions[this.#snapIndex].x,
      GameProps.snapTo.positions[this.#snapIndex].y
    );
    GameProps.snapTo.positions[this.#snapIndex] = null;
    GameProps.playerAnswers[this.#snapIndex] = this;
    this.#hasMoved = true;
  }

  // Task 5: Free the snap point if peg was already placed, allow replacement
  onMouseDown(){
    super.onMouseDown();
    const index = GameProps.colorPickers.indexOf(this);
    GameProps.colorPickers.splice(index, 1);
    GameProps.colorPickers.push(this);
    if(this.#snapPos !== null){
      GameProps.snapTo.positions[this.#snapIndex] = this.#snapPos;
      this.#snapPos = null;
      GameProps.playerAnswers[this.#snapIndex] = null;
    }
  }

  // Task 5: Return peg to palette if from source, otherwise remove from game
  onCancelDrop(){
    if(this.#hasMoved){
      const index = GameProps.colorPickers.indexOf(this);
      GameProps.colorPickers.splice(index, 1);
      this.spcvs.removeSpriteButton(this); 
    } else if (this.#isFromPalette) {
      // Return peg to original palette position
      const pos = Positions[this.#color];
      this.posX = pos.x;
      this.posY = pos.y;
    }
  }
}
