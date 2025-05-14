## Task 1: Countdown to Flight  
- File: `menu.mjs`  
- Functions: `#onClick`, `#onCountDown`  
- What it does: Plays a countdown sound (3 → 2 → 1) when the player clicks the Play button.  
  Uses setTimeout to delay each number and plays sound with each step. The game starts after the final beep.
## Task 2: A Tasty Treat  
- File: `FlappyBird.mjs`  
- Function: `animateGame()`  
- What it does: Detects when Flappy is close to a bait (within 15 pixels), removes the bait,
  plays a food/eating sound, and increases the player’s score.
## Task 3: The Flap of Wings  
- File: `FlappyBird.mjs`  
- Function: `onKeyDown(event)`  
- What it does: When the spacebar is pressed, the bird flaps (moves upward) and a flap sound plays.  
  Sound only plays if the hero is not marked as dead.
## Task 4: A Deadly Encounter  
- File: `obstacle.mjs`  
- Function: `update()`  
- What it does: Detects when Flappy collides with a pipe.  
  Plays the death sound (`dead.mp3`) and marks Flappy as dead.  
  After this, Flappy falls until hitting the ground (handled in Task 5).
## Task 5: Game Over!  
- File: `hero.mjs`  
- Function: `update()`  
- What it does: Detects when Flappy hits the ground.  
  If the bird hasn't already landed, plays the game over sound, stops animation and running sound,  
  and sets the game status to `gameOver` to trigger the game over screen.

## Task 6: Day and Night Mode  
- Files: `FlappyBird.html`, `FlappyBird.mjs`, `obstacle.mjs`  
- Functions: `setDayNight()`, `obstacle.setDayNight()`  
- What it does: Lets the player toggle between Day and Night mode using radio buttons.  
  The background image and pipe sprites change accordingly.  
  Newly spawned pipes also receive the correct sprite mode based on the selected setting.
