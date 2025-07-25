// Game state arrays
let gameSeq = []; // stores the game sequence
let userSeq = []; // stores the user's input

// Color button IDs
let btns = ["orange", "rose", "softblue", "teal"];

// Track game state
let started = false;
let level = 0;

// DOM Elements
let h2 = document.querySelector("h2");
let scoreDisplay = document.querySelector("#score"); 
let highScoreDisplay = document.querySelector("#high-score");

// Load high score from localStorage
let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.innerText = `High Score: ${highScore}`;

// Start game on keypress
document.addEventListener("keypress", function () {
  if (!started) {
    console.log("Game started.");
    started = true;
    levelUp(); // Begin the game
  }
});

// Flash animation for game sequence
function gameflash(btn) {
  btn.classList.add("flash");
  setTimeout(() => {
    btn.classList.remove("flash");
  }, 250);
}

// Flash animation for user input
function userflash(btn) {
  btn.classList.add("userflash");
  setTimeout(() => {
    btn.classList.remove("userflash");
  }, 250);
}

// Play the full sequence back to the user
function playSequence() {
  let i = 0;
  let interval = setInterval(() => {
    let color = gameSeq[i];
    let btn = document.querySelector(`.${color}`);
    gameflash(btn);
    i++;
    if (i >= gameSeq.length) {
      clearInterval(interval); // End playback
    }
  }, 600);
}

// Advance to next level
function levelUp() {
  level++;
  h2.innerText = `Level ${level}`;
  scoreDisplay.innerText = `Score: ${level - 1}`; 

  // Choose a random button and add to game sequence
  let randIdx = Math.floor(Math.random() * 4);
  let randColor = btns[randIdx];
  gameSeq.push(randColor);
  console.log("Game Sequence:", gameSeq);

  playSequence();
}

// Handle user button click
function btnPress() {
  let btn = this;
  userflash(btn); // Show user click effect

  let userColor = btn.getAttribute("id");
  console.log(userColor);

  userSeq.push(userColor); // Add user's choice to sequence
  checkAnswer(userSeq.length - 1); // Check correctness
}

// Add click listeners to each color button
let allBtns = document.querySelectorAll(".button");
for (let btn of allBtns) {
  btn.addEventListener("click", btnPress);
}

// Check the user's input against the game sequence
function checkAnswer(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    // Correct input so far
    if (userSeq.length === gameSeq.length) {
      setTimeout(() => {
        userSeq = []; // Reset user input
        levelUp();    // Go to next level
      }, 1000);
    }
  } else {
    // Wrong input — Game Over
    document.body.classList.add("wrong-flash"); // Flash red background
    setTimeout(() => {
      document.body.classList.remove("wrong-flash");
    }, 200);

    // Update high score if needed
    if ((level - 1) > highScore) {
      highScore = level - 1;
      localStorage.setItem("highScore", highScore);
      highScoreDisplay.innerText = `High Score: ${highScore}`;
    }

    // Show Game Over message
    h2.innerText = `Game Over! Your Score: ${level - 1}. Press any key to restart.`;

    // Optional extra class for body animation (not defined in CSS)
    document.body.classList.add("game-over");
    setTimeout(() => {
      document.body.classList.remove("game-over");
    }, 200);

    resetGame(); // Reset state
  }
}

// Reset game state variables
function resetGame() {
  started = false;
  gameSeq = [];
  userSeq = [];
  level = 0;
  scoreDisplay.innerText = "Score: 0"; 
}