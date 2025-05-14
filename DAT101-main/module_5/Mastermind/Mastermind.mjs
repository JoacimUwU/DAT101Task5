"use strict";

//--------------------------------------------------------------------------------------------------------------------
//------ Imports
//--------------------------------------------------------------------------------------------------------------------
import lib2D from "./common/libs/lib2d_v2.mjs";
import libSprite from "./common/libs/libSprite_v2.mjs";
import { TColorPicker } from "./ColorPicker.mjs";
import MastermindBoard from "./MastermindBoard.mjs";
import { TMenu } from "./menu.mjs";


//--------------------------------------------------------------------------------------------------------------------
//------ Variables, Constants and Objects
//--------------------------------------------------------------------------------------------------------------------

// prettier-ignore
export const SpriteInfoList = {
  Board:              { x: 640, y:   0, width: 441, height: 640, count: 1 },
  ButtonNewGame:      { x:   0, y:  45, width: 160, height:  45, count: 4 },
  ButtonCheckAnswer:  { x:   0, y:   0, width: 160, height:  45, count: 4 },
  ButtonCheat:        { x:   0, y: 139, width:  75, height:  49, count: 4 },
  PanelHideAnswer:    { x:   0, y:  90, width: 186, height:  49, count: 1 },
  ColorPicker:        { x:   0, y: 200, width:  34, height:  34, count: 8 },
  ColorHint:          { x:   0, y: 250, width:  19, height:  18, count: 3 },
};

const cvs = document.getElementById("cvs");
const spcvs = new libSprite.TSpriteCanvas(cvs);

//Add all you game objects here
export const GameProps = {
  board: null,
  colorPickers:[],
  // ---------------- Task 4: Snap Areas - Active Guess Row ----------------
  // Only one row is active at a time for guessing; starts at Row1
  snapTo:{
    positions: MastermindBoard.ColorAnswer.Row1,
    distance: 20
  },
  computerAnswers: [],
  roundIndicator: null,
  menu: null,
  playerAnswers: [null, null, null, null],
  answerHintRow: MastermindBoard.AnswerHint.Row1,
}


//--------------------------------------------------------------------------------------------------------------------
//------ Functions
//--------------------------------------------------------------------------------------------------------------------

export function newGame() {
  // ---------------- Task 6: New Game ----------------
  // Fully resets game state, removes old pegs, and sets up new round

  // 1. Remove all draggable pegs from the canvas
  for (let i = 0; i < GameProps.colorPickers.length; i++) {
    const colorPicker = GameProps.colorPickers[i];
    spcvs.removeSpriteButton(colorPicker);
  }
  GameProps.colorPickers = [];

  // 2. Reset answers and snapping logic
  GameProps.playerAnswers = [null, null, null, null];
  GameProps.computerAnswers = [];

  // Reset the entire array (deep copy of Row1)
  GameProps.snapTo.positions = MastermindBoard.ColorAnswer.Row1.map(p => ({ x: p.x, y: p.y }));
  GameProps.answerHintRow = MastermindBoard.AnswerHint.Row1;

  // 3. Move the round indicator to row 1
  moveRoundIndicator();

  // 4. Generate new hidden answer
  generateComputerAnswer();

  // 5. Recreate color pickers
  // ---------------- Task 2: Color Picker Instances ----------------
  // Create 8 draggable color pegs from the color palette on the left side

  const ColorKeys = Object.keys(MastermindBoard.ColorPicker);
  for (let i = 0; i < ColorKeys.length; i++) {
    const colorName = ColorKeys[i];
    const colorPicker = new TColorPicker(spcvs, SpriteInfoList.ColorPicker, colorName, i);
    GameProps.colorPickers.push(colorPicker);
  }
}


function drawGame(){
  spcvs.clearCanvas();
  //Draw all game objects here, remember to think about the draw order (layers in PhotoShop for example!)
  GameProps.board.draw();

  for(let i = 0; i < GameProps.computerAnswers.length; i++){
    const computerAnswer = GameProps.computerAnswers[i];
    computerAnswer.draw();
  }
  
  GameProps.roundIndicator.draw();

  GameProps.menu.draw();

  for(let i = 0; i < GameProps.colorPickers.length; i++){
    const colorPicker = GameProps.colorPickers[i];
    colorPicker.draw();
  }

  requestAnimationFrame(drawGame);
}

// ---------------- Task 3: Computer's Secret Code ----------------
// Generates 4 random TSprite pegs to act as the secret answer
// Stored in GameProps.computerAnswers[] and drawn behind panel
function generateComputerAnswer(){
  //Først må vi genere 4 tilfeldige farger
  //Deretter må vi plassere disse fargene i computerAnswers
  //Vi må bruke libSprite.TSprite for å lage en sprite for hver farge
  for(let i = 0; i < 4 ; i++){
    const colorIndex = Math.floor(Math.random() * SpriteInfoList.ColorPicker.count);
    const pos = MastermindBoard.ComputerAnswer[i];
    const sprite = new libSprite.TSprite(spcvs, SpriteInfoList.ColorPicker,pos);
    sprite.index = colorIndex;
    GameProps.computerAnswers.push(sprite);
  }

}
// ---------------- Task 4: Round Indicator ----------------
// Moves the round indicator (gray pin) next to the current guess row
export function moveRoundIndicator(){
  const pos = GameProps.snapTo.positions[0];
  GameProps.roundIndicator.x = pos.x - 84;
  GameProps.roundIndicator.y = pos.y + 7;
}

//--------------------------------------------------------------------------------------------------------------------
//------ Event Handlers
//--------------------------------------------------------------------------------------------------------------------

//loadGame runs once when the sprite sheet is loaded
function loadGame() {
  //Set canvas with and height to match the sprite sheet
  cvs.width = SpriteInfoList.Board.width;
  cvs.height = SpriteInfoList.Board.height;
  spcvs.updateBoundsRect();
  // ---------------- Task 1: Game Board ----------------
// We create and draw the main board background using TSprite
  let pos = new lib2D.TPoint(0, 0);
  GameProps.board = new libSprite.TSprite(spcvs, SpriteInfoList.Board, pos);

  pos = GameProps.snapTo.positions[0];
  GameProps.roundIndicator = new libSprite.TSprite(spcvs, SpriteInfoList.ColorHint, pos);
  GameProps.roundIndicator.index = 2;
  moveRoundIndicator();

  GameProps.menu = new TMenu(spcvs);

  newGame();
  requestAnimationFrame(drawGame); // Start the animation loop
}


//--------------------------------------------------------------------------------------------------------------------
//------ Main Code
//--------------------------------------------------------------------------------------------------------------------


spcvs.loadSpriteSheet("./Media/SpriteSheet.png", loadGame);
window.addEventListener("resize", spcvs.updateBoundsRect.bind(spcvs));