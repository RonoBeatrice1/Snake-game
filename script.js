const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const snakeSize = 20;
let snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
let food = { x: getRandomPosition(), y: getRandomPosition() };
let dx = snakeSize;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameOverScreen = document.getElementById("gameOverScreen");
let newGameBtn = document.getElementById("newGameBtn");
let highScoreBtn = document.getElementById("highScoreBtn");
let quitGameBtn = document.getElementById("quitGameBtn");
let countdownContainer = document.getElementById("countdownContainer");
let countdownText = document.getElementById("countdownText");

newGameBtn.addEventListener("click", startCountdown);
highScoreBtn.addEventListener("click", showHighScore);
quitGameBtn.addEventListener("click", quitGame);

document.addEventListener("keydown", changeDirection);

let gameLoop;
let countdownTimer;
let countdownValue = 3;

function draw() {
  clearCanvas();
  drawSnake();
  drawFood();
  moveSnake();
  checkCollision();
  drawScore();

  gameLoop = setTimeout(draw, 100);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  snake.forEach((segment) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
  });
}

function drawFood() {
  ctx.fillStyle = "green";
  ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = { x: getRandomPosition(), y: getRandomPosition() };
  } else {
    snake.pop();
  }
}

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;

  const goingUp = dy === -snakeSize;
  const goingDown = dy === snakeSize;
  const goingRight = dx === snakeSize;
  const goingLeft = dx === -snakeSize;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -snakeSize;
    dy = 0;
  }

  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -snakeSize;
  }

  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = snakeSize;
    dy = 0;
  }

  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = snakeSize;
  }
}

function checkCollision() {
  const head = snake[0];
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    isCollisionWithSelf()
  ) {
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
    gameOver();
  }
}

function isCollisionWithSelf() {
  const head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

function gameOver() {
  clearTimeout(gameLoop);
  gameOverScreen.style.display = "block";

  const gameOverMessage = document.getElementById("gameOverMessage");
  gameOverMessage.textContent = "Game Over! Your score is: " + score;

  const congratsMessage = document.getElementById("congratsMessage");
  congratsMessage.style.display = score > highScore ? "block" : "none";

  newGameBtn.style.display = "block";
  highScoreBtn.style.display = "block";
  quitGameBtn.style.display = "block";

  document.removeEventListener("keydown", changeDirection);
}

function startCountdown() {
  newGameBtn.style.display = "none";
  highScoreBtn.style.display = "none";
  quitGameBtn.style.display = "none";

  countdownContainer.style.display = "block";
  countdownValue = 3;
  countdownText.textContent = countdownValue;

  countdownTimer = setInterval(() => {
    countdownValue--;
    countdownText.textContent = countdownValue;

    if (countdownValue === 0) {
      clearInterval(countdownTimer);
      countdownContainer.style.display = "none";
      startNewGame();
    }
  }, 1000);
}

function startNewGame() {
  snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
  dx = snakeSize;
  dy = 0;
  score = 0;
  gameOverScreen.style.display = "none";
  document.addEventListener("keydown", changeDirection);
  clearTimeout(gameLoop); // Clear any existing game loop

  // Hide the options buttons
  newGameBtn.style.display = "none";
  highScoreBtn.style.display = "none";
  quitGameBtn.style.display = "none";

  // Start the game loop
  draw();
}

function showHighScore() {
  alert("High Score: " + highScore);
}

function quitGame() {
  if (confirm("Are you sure you want to quit the game?")) {
    window.close();
  }
}

function getRandomPosition() {
  return Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
}

draw();
