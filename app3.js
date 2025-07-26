// Game state arrays
let gameSeq = []; // stores the game sequence
let userSeq = []; // stores the user's input

// Color button IDs
let btns = ["orange", "rose", "softblue", "teal"];

// Toggle dark mode
document.querySelector("#darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Track game state
let started = false;
let level = 0;
let gameOver = false; // flag to block clicks after game ends

// DOM Elements
let h2 = document.querySelector("h2");
let scoreDisplay = document.querySelector("#score");
let highScoreDisplay = document.querySelector("#high-score");
let timerDisplay = document.getElementById("timer");

// Load high score from localStorage
let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.innerText = `High Score: ${highScore}`;

// Start game on keypress
document.addEventListener("keypress", function () {
  if (!started) {
    console.log("Game started.");
    started = true;
    gameOver = false;
    levelUp(); // Begin the game
  }
});

// Flash animation for game sequence
function gameflash(btn) {
  // Safety check: If the button element is not found, warn in the console and stop execution.
  // This prevents the program from crashing due to 'null.classList' error.
  if (!btn) {
    console.warn("Button element not found for flash");
    return;
  }

  // If the button exists, temporarily add the "flash" class to create a white flash effect
  btn.classList.add("flash");

  // Remove the flash effect after 250 milliseconds (0.25 seconds)
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
      startUserTimer();        // Start timer for user input
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
  if (!started || gameOver) return;

  let btn = this;
  userflash(btn);
  let userColor = btn.getAttribute("id");

  userSeq.push(userColor);
  checkAnswer(userSeq.length - 1);
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
      clearInterval(userTimer); // Stop timer
      setTimeout(() => {
        userSeq = [];
        levelUp();
      }, 1000);
    }
  } else {
    // Wrong input — Game Over
    handleGameOver("Wrong input! Game Over.");
  }
}

// Game Over handler
function handleGameOver(message) {
  document.body.classList.add("wrong-flash");
  setTimeout(() => {
    document.body.classList.remove("wrong-flash");
  }, 200);

  // Update high score if needed
  if ((level - 1) > highScore) {
    highScore = level - 1;
    localStorage.setItem("highScore", highScore);
    highScoreDisplay.innerText = `High Score: ${highScore}`;
  }

  h2.innerText = `${message} Your Score: ${level - 1}. Press any key to restart.`;
  resetGame();
}

// Reset game state variables
function resetGame() {
  started = false;
  gameOver = true;
  gameSeq = [];
  userSeq = [];
  level = 0;
  clearInterval(userTimer);
  scoreDisplay.innerText = "Score: 0";
  timerDisplay.innerText = "Time Left: 5s";
}

// Timer logic
let userTimer;
let timeLeft = 5;

function startUserTimer() {
  clearInterval(userTimer);
  timeLeft = 5;
  updateTimerText();

  userTimer = setInterval(() => {
    timeLeft--;
    updateTimerText();

    if (timeLeft <= 0) {
      clearInterval(userTimer);
      handleGameOver("Time's up!");
    }
  }, 1000);
}

function updateTimerText() {
  timerDisplay.innerText = `Time Left: ${timeLeft}s`;
}
