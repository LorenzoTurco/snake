/////////////////////GLOBAL VARIABLES///////////////////////

const canvas = document.getElementById("canvas").getContext("2d");
const score = document.querySelector(".score-text__number");
const restartButton = document.querySelector(".button-container__restart");
const increaseSpeedButton = document.querySelector(
  ".button-container__increase-speed"
);
const speedButton = document.querySelector(".button-container__increase-speed");
const decreaseSpeedButton = document.querySelector(
  ".button-container__decrease-speed"
);

const tile = 16; //px per tile
let direction = "down";
let food = {
  x: Math.floor(Math.random() * 30 + 1) * tile,
  y: Math.floor(Math.random() * 30 + 1) * tile,
};
let highscore = 0;
let snake = [];
snake[0] = {
  //setting starting position of the head of the snake
  x: 256,
  y: 0,
};

let currentSpeed = 100;

/////////////////////FUNCTIONS///////////////////////

const restart = () => {
  //reset
  direction = "down";

  food = {
    x: Math.floor(Math.random() * 30 + 1) * tile,
    y: Math.floor(Math.random() * 30 + 1) * tile,
  };
  highscore = 0;
  snake = [];
  snake[0] = {
    x: 256,
    y: 0,
  };

  score.innerHTML = highscore;
  clearInterval(game);
  game = setInterval(startGame, 100);
};

const increaseSpeed = () => {
  clearInterval(game);
  if (currentSpeed > 30) {
    currentSpeed = currentSpeed - 20;
  }
  game = setInterval(startGame, currentSpeed);
};

const decreaseSpeed = () => {
  clearInterval(game);
  if (currentSpeed < 260) {
    currentSpeed = currentSpeed + 20;
  }
  game = setInterval(startGame, currentSpeed);
};

const update = (event) => {
  if (event.keyCode == 37 && direction != "right") direction = "left";
  if (event.keyCode == 38 && direction != "down") direction = "up";
  if (event.keyCode == 39 && direction != "left") direction = "right";
  if (event.keyCode == 40 && direction != "up") direction = "down";
};

const checkIfCollide = () => {
  for (i = 1; i < snake.length; i++) {
    // check if collided
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      //check if x and y coordinates of the snake head touch the coordinates of the snake body
      return true;
    }
  }
  return false;
};

const checkIfEndOfCanvas = () => {
  if (snake[0].x == 30 * tile && direction == "right") snake[0].x = 0;
  if (snake[0].x == 0 && direction == "left") snake[0].x = 32 * tile;
  if (snake[0].y == 30 * tile && direction == "down") snake[0].y = 0;
  if (snake[0].y == 0 && direction == "up") snake[0].y = 32 * tile;
};

const updateXPosition = (snakeX) => {
  if (direction == "right") snakeX += tile;
  if (direction == "left") snakeX -= tile;

  return snakeX;
};

const updateYPosition = (snakeY) => {
  if (direction == "up") snakeY -= tile;
  if (direction == "down") snakeY += tile;

  return snakeY;
};

const updateIfFruitFound = (snakeX, snakeY) => {
  if (snakeX != food.x || snakeY != food.y) {
    snake.pop(); //remove snake from current location
  } else {
    //change location of food & don't remove new body tile
    food.x = Math.floor(Math.random() * 30 + 1) * tile;
    food.y = Math.floor(Math.random() * 30 + 1) * tile;
    highscore += 1;
    score.innerHTML = highscore;
  }

  snake.unshift({
    x: snakeX,
    y: snakeY,
  });
};

const drawArea = () => {
  // draw area where snake can move
  canvas.fillStyle = "tomato";
  canvas.fillRect(0, 0, 32 * tile, 32 * tile);
  //creates a rectangle (x, y, width, height)
  //creates a rectangle from position 0 , 0 of our 512 x 512 canvas
  //give rectangle a width of 512 and height of 512
};

const drawSnake = () => {
  // draw snake on the map
  for (i = 0; i < snake.length; i++) {
    // draw every tile of  the snake
    canvas.fillStyle = "green";
    canvas.fillRect(snake[i].x, snake[i].y, tile, tile);
    //draw rectangle at coordinates snake[i].x and snake[i].y with height tile and width tile
  }
};

const drawFood = () => {
  canvas.fillStyle = "red";
  canvas.fillRect(food.x, food.y, tile, tile);
};

////////////////////GAME/////////////////////////

const startGame = () => {
  checkIfEndOfCanvas();

  if (checkIfCollide()) {
    clearInterval(game);
    alert(`Game Over!  Highscore: ${highscore}`);

    restart();
    setInterval(startGame, 100);
  }

  // create canvas items
  drawArea();
  drawSnake();
  drawFood();

  let snakeX = updateXPosition(snake[0].x);
  let snakeY = updateYPosition(snake[0].y);

  updateIfFruitFound(snakeX, snakeY);
};
let game = setInterval(startGame, 100); //call startFame every 100 milliseconds until clearInterval() is called
//add button to begin game rather than start immediately
document.addEventListener("keydown", update);
restartButton.addEventListener("click", restart);
increaseSpeedButton.addEventListener("click", increaseSpeed);
decreaseSpeedButton.addEventListener("click", decreaseSpeed);
