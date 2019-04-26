class FlappyBirdGameWorld {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    //constants
    this.CANVAS_WIDTH = 288;
    this.CANVAS_HEIGHT = 512;
    this.FOREGROUND_INITIAL_X_POSITION = -10;
    this.FOREGROUND_REFRESH_RATE = 25;

    //setting canvas size
    this.canvas.width = this.CANVAS_WIDTH;
    this.canvas.height = this.CANVAS_HEIGHT;
    this.POINT_DISTANCE = 55;

    //declaring variables
    this.bird;
    this.pipes = []; //There might be more than one pipe in the screen
    this.background;
    this.foreground;
    this.gameEnd;
    this.beginScreen;
    this.score;
    this.pointAudio;
    this.counter;

    this.init();
  }

  //Defining canvas height and width, canvas' context and loading images and audio
  init() {
    let birdInitialPositionX = 100;
    let birdInitialPositionY = 200;
    let pipeInitialPositionX = this.CANVAS_WIDTH;
    let pipeInitialPositionY = 0;

    this.bird = new Bird(birdInitialPositionX, birdInitialPositionY);
    this.pipes.push(new Pipe(pipeInitialPositionX, pipeInitialPositionY)); //A pipe object consist of both upper and lower pipe

    this.background = MediaLoader.getImageElement("sprites/background-day.png");
    this.foreground = MediaLoader.getImageElement("sprites/base.png");
    this.pointAudio = MediaLoader.getAudioElement("audio/point.wav");

    this.score = 0;
    this.beginScreen = true;
    this.counter = 0;
    this.foregroundXPosition = this.FOREGROUND_INITIAL_X_POSITION;

    document.addEventListener(
      "keyup",
      function(event) {
        if (event.keyCode === 13) {
          if (this.beginScreen) {
            this.pipes = [];
            this.pipes.push(new Pipe(this.CANVAS_WIDTH, 0));
            this.score = 0;
            this.beginScreen = false;
          }
        }
        if (event.keyCode === 32 && !this.beginScreen) {
          this.bird.wingAudio.play();
          this.bird.yPosition += this.bird.FLY_DISTANCE;
          this.bird.acceleration = this.bird.GRAVITY;
        }
      }.bind(this)
    );
  }

  playGame() {
    this.drawObjects();
    if (this.counter++ % this.bird.FLAP_REFRESH_RATE == 0) {
      this.bird.imageFlag++;
    }
    if (this.counter++ % this.FOREGROUND_REFRESH_RATE == 0) {
      this.foregroundXPosition = this.FOREGROUND_INITIAL_X_POSITION;
    }
    requestAnimationFrame(() => this.playGame());
  }

  drawObjects() {
    this.drawBackground();
    if (!this.beginScreen) {
      this.updateAndDrawPipes();
      this.drawText(this.score, this.CANVAS_WIDTH / 2 - 15, 50, 50);
    } else {
      this.drawText("PRESS ENTER TO START", 35, 50, 20);
      this.drawText("SPACE TO FLAP", 80, 80, 18);
      if (this.score > 0)
        this.drawText("Your score is " + this.score, 80, 160, 15);
    }
    this.updateAndDrawBird();
    this.drawForeground();
  }

  updateAndDrawBird() {
    if (!this.beginScreen) this.bird.yPosition += this.bird.acceleration;
    else {
      this.bird.acceleration = this.bird.GRAVITY;
    }
    this.bird.acceleration += this.bird.ACCELERATION_RATE;
    this.bird.draw(this.ctx);
  }

  updateAndDrawPipes() {
    for (let i = 0; i < this.pipes.length; i++) {
      if (this.pipes[i].xPosition <= -this.pipes[i].WIDTH) {
        //Removing a pair of pipe that is out of screen
        this.pipes.shift();
        i--;
      } else {
        if (this.detectCollision(this.bird, this.pipes[i])) {
          this.bird.xPosition = this.bird.initialPositionX;
          this.bird.yPosition = this.bird.initialPositionY;
          this.bird.dieAudio.play();
          this.beginScreen = true;
        }

        this.pipes[i].xPosition--;
        //Draws both upper and lower pipe(pair of pipe)
        this.pipes[i].draw(this.ctx);

        //Respawing new pair of pipe and random vertical position between 0 and - pipe height
        if (this.pipes[i].xPosition == this.pipes[i].NEXT_PIPE_SPAWN_DISTANCE) {
          let pipeYOffset = 25;
          let randomYPosition = Math.floor(
            Math.random() * (-pipeYOffset + this.pipes[i].UPPER_PIPE_HEIGHT) -
              this.pipes[i].UPPER_PIPE_HEIGHT +
              pipeYOffset
          );
          this.pipes.push(new Pipe(this.CANVAS_WIDTH, randomYPosition));
        }

        if (this.pipes[i].xPosition == this.POINT_DISTANCE) {
          this.pointAudio.play();
          this.score++;
        }
      }
    }
  }

  detectCollision(bird, pipe) {
    //if bird touches the ground
    let hasBirdCollidedWithTheGround =
      bird.yPosition + bird.HEIGHT >=
      this.CANVAS_HEIGHT - this.foreground.height;

    //if bird touches or is in inside the area of pipes
    let hasBirdCollidedWithAPipe =
      bird.xPosition + bird.WIDTH >= pipe.xPosition &&
      bird.xPosition <= pipe.xPosition + pipe.WIDTH &&
      (bird.yPosition <= pipe.yPosition + pipe.UPPER_PIPE_HEIGHT ||
        bird.yPosition + bird.HEIGHT >=
          pipe.yPosition + pipe.LOWER_PIPE_VERTICAL_OFFSET);

    if (hasBirdCollidedWithTheGround || hasBirdCollidedWithAPipe) return true;
    return false;
  }

  drawBackground() {
    this.ctx.drawImage(
      this.background,
      0,
      0,
      this.CANVAS_WIDTH,
      this.CANVAS_HEIGHT
    );
  }

  drawForeground() {
    this.ctx.drawImage(
      this.foreground,
      this.foregroundXPosition--,
      this.CANVAS_HEIGHT - this.foreground.height
    );
  }

  drawText(text, xPosition, yPosition, size) {
    this.ctx.font = size + "px flappyBird";
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(text, xPosition, yPosition);
  }
}

class MediaLoader {
  static getImageElement(src) {
    let imageElement = new Image();
    imageElement.src = src;
    return imageElement;
  }

  static getAudioElement(src) {
    let audioElement = new Audio();
    audioElement.src = src;
    return audioElement;
  }
}
