var canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 500;
var ctx = canvas.getContext("2d");

var fps = 60;

var pauseScreen = false;

var playerFirstScore = 0;
var playerSecondScore = 0;

var ballPositionX = canvas.width / 2;
var ballPositionY = canvas.height / 2;
var ballRadius = 10;
var ballSpeedX = 5;
var ballSpeedY = 5;

var WINNIG_SCORE = 3;

var paddleWidth = 10;
var paddleHeight = 100;

var paddleFirstPositionX = 0;
var paddleFirstPositionY = canvas.height / 2 - paddleHeight / 2;

var paddleSecondPositionX = canvas.width - paddleWidth;
var paddleSecondPositionY = canvas.height / 2 - paddleHeight / 2;

function calculateMousePosition(event){
  var mouseX = event.clientX;
  var mouseY = event.clientY;

  return {
    x: mouseX,
    y: mouseY
  }
}

canvas.onmousemove = function(event){
  paddleFirstPositionY = calculateMousePosition(event).y - paddleHeight/2;
};

canvas.onclick = function(event){
  if(pauseScreen){
    resetScore();
    pauseScreen = false;
  }
}

window.onload = function() {
  setInterval(function() {
   if(!pauseScreen){
    moveEverything();
    drawEverything();
   }else{
    clearScreen();
    displayPauseScreen();
  }
  }, 1000 / fps);
  drawEverything();
};


function resetBall(){
  ballSpeedX = -ballSpeedX;
  ballSpeedY = 5;
  ballPositionX = canvas.width / 2;
  ballPositionY = canvas.height / 2;
  if(playerFirstScore >= WINNIG_SCORE || playerSecondScore >= WINNIG_SCORE){
    pauseScreen = true;
  }
}

function displayPauseScreen(){
  ctx.fillStyle = "white";
  ctx.font = "15px Arial";
  if(playerFirstScore > playerSecondScore){
    ctx.fillText("PLAYER 1 WINS!!!", canvas.width*0.42, canvas.height*0.3);
  }else if(playerSecondScore > playerFirstScore){
    ctx.fillText("PLAYER 2 WINS!!!", canvas.width*0.42, canvas.height*0.3);
  }else{
    ctx.fillText("BOTH PLAYER WINS!!!", canvas.width*0.42, canvas.height*0.8);  
  }
  ctx.font = "8px Arial";
  ctx.fillText("CLICK TO CONTINUE", canvas.width*0.445, canvas.height*0.8);
}



function resetScore(){
  playerFirstScore = 0;
  playerSecondScore = 0;
}

function computerMovement(){
  if(ballPositionY - 20 > paddleSecondPositionY+paddleHeight/2){
    paddleSecondPositionY += 4;
  }else if(ballPositionY + 20 < paddleSecondPositionY+paddleHeight/2){
    paddleSecondPositionY -= 4;
  }
}

function moveEverything() {

  ballPositionX = ballPositionX + ballSpeedX;
  ballPositionY = ballPositionY + ballSpeedY;
  computerMovement();
  if(ballPositionX >= canvas.width - ballRadius){
    if(ballPositionY+ballRadius >= paddleSecondPositionY && ballPositionY+ballRadius <= paddleSecondPositionY + paddleHeight){
      ballSpeedX = -ballSpeedX;
      var differenceYOfBallFromCenterOfaPaddle = ballPositionY - (paddleSecondPositionY + paddleHeight/2);
        ballSpeedY= differenceYOfBallFromCenterOfaPaddle*0.25;
    }else{  
      playerFirstScore++;
      resetBall();
    }
  }

  if(ballPositionX <= ballRadius ){
    if(ballPositionY+ballRadius >= paddleFirstPositionY && ballPositionY+ballRadius <= paddleFirstPositionY+paddleHeight){
      ballSpeedX = -ballSpeedX;
      var differenceYOfBallFromCenterOfaPaddle = ballPositionY - (paddleFirstPositionY + paddleHeight/2);
      ballSpeedY = differenceYOfBallFromCenterOfaPaddle*0.25;
    }else{
      
      playerSecondScore++;
      resetBall();
    }
  }

  if(ballPositionY >= canvas.height - ballRadius || ballPositionY <= ballRadius){
    ballSpeedY = -ballSpeedY;
  }
}

function drawEverything() {
  clearScreen();

  
  drawCircle(ballPositionX, ballPositionY, ballRadius, "white");

  drawNet();
  
  drawPaddle(
    paddleFirstPositionX,
    paddleFirstPositionY,
    paddleWidth,
    paddleHeight,
    "blue"
  );
  drawPaddle(
    paddleSecondPositionX,
    paddleSecondPositionY,
    paddleWidth,
    paddleHeight,
    "red"
  );
  drawScores();
}

function clearScreen() {
  drawPaddle(0, 0, canvas.width, canvas.height, "black");
}

function drawScores(){
  ctx.font = "20px Arial";
  ctx.fillStyle = "blue";
  ctx.fillText(playerFirstScore, 100, 100);
  ctx.fillStyle = "red";
  ctx.fillText(playerSecondScore, canvas.width-100, 100);
}

function drawPaddle(
  paddlePositionX,
  paddlePositionY,
  paddleWidth,
  paddleHeight,
  color
) {
  ctx.fillStyle = color;
  ctx.fillRect(paddlePositionX, paddlePositionY, paddleWidth, paddleHeight);
}

function drawNet(){
  ctx.fillStyle="white";
  for(var i = 0; i < canvas.height; i+=40){
    ctx.fillRect(canvas.width/2-1, i, 2, 10,);
  }
}

function drawCircle(positionX, positionY, ballRadius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(positionX, positionY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
}
