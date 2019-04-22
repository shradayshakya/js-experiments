class FlappyBirdCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.CANVAS_WIDTH = 288;
    this.CANVAS_HEIGHT = 512;
    this.canvas.width = this.CANVAS_WIDTH;
    this.canvas.height = this.CANVAS_HEIGHT;
    this.ctx = this.canvas.getContext("2d");
    this.init();
  }

  //Defining canvas height and width, canvas' context and loading images and audio
  init() {

    this.beginScreen = true;

    //loading images
    this.loadImages();
    this.loadAudios();

    //declaring size and widths of objects
    this.birdHeight = 24;
    this.birdWidth = 34;

    this.pipeTopHeight = 250;
    this.pipeWidth = 52;
    this.gapBetweenPipes = 100;

    this.baseHeight = 112;

    this.PIPE_BOTTOM_CONSTANT = this.pipeTopHeight + this.gapBetweenPipes;

    this.setBirdToInitialPosition();

    //vertical movement of the bird
    this.gravity = 1.8;

    this.pipes = [];
    this.pipes[0] = {
      x: this.CANVAS_WIDTH,
      y: -100
    };

    //adding event listeners
    document.addEventListener(
      "keyup",
      function(event) {
        if (event.key === " ") {
          if(this.beginScreen){
            this.setPipesToInitialStates();
            this.score = 0;
            this.beginScreen = false;
          }
          this.wingAudio.play();
          this.birdPositionY -= 42;
        }
      }.bind(this)
    );

    //Score
      this.score = 0;
  }

  setPipesToInitialStates(){
    this.pipes = [];
    this.pipes[0] = {
      x: this.CANVAS_WIDTH,
      y: -100
    };
  }

  setBirdToInitialPosition(){
    //declaring initial positions of objects
    this.birdPositionX = 100;
    this.birdPositionY = this.CANVAS_HEIGHT / 2;
  }

  //Game starts from here
  playGame() {
    this.drawObjects();
    requestAnimationFrame(() => this.playGame());
  }


  //this is where images are loaded and drawn in the canvas, images need to be loaded before they are drawn
  drawObjects() {
    this.ctx.drawImage(
      this.backgroundImage,
      0,
      0,
      this.CANVAS_WIDTH,
      this.CANVAS_HEIGHT
    );

    if(!this.beginScreen){
    this.drawPipes();
    this.applyGravity();
    this.drawScore();
    }else{
      this.ctx.font = "20px flappyBird";  
      this.ctx.textBaseline = 'top';
      this.ctx.fillStyle = "white";
      this.ctx.fillText("SPACE TO START", 60, 50);
      if(this.score > 0){
        this.ctx.font = "15px flappyBird";  
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = "white";
       this.ctx.fillText("Your score is "+this.score, 80, 100);
      }
    }

    this.ctx.drawImage(
      this.baseImage,
      0,
      this.CANVAS_HEIGHT - this.baseImage.height
    );

    this.drawBird();
  }

  drawScore(){
    this.ctx.font = "50px flappyBird";  
    this.ctx.textBaseline = 'top';
    this.ctx.fillStyle = "white";
    this.ctx.fillText(this.score, this.CANVAS_WIDTH/2 - 15, 50);
  }

  drawPipes() {
    for (let i = 0; i < this.pipes.length; i++) {
      if (this.pipes[i].x <= -this.pipeWidth) {
        this.pipes.shift();
        i--;
      } else {
        this.ctx.drawImage(this.pipeTopImage, this.pipes[i].x, this.pipes[i].y);
        this.ctx.drawImage(
          this.pipeBottomImage,
          this.pipes[i].x,
          this.pipes[i].y + this.PIPE_BOTTOM_CONSTANT
        );
        if (this.pipes[i].x == 125) {
          this.pipes.push({
            x: this.CANVAS_WIDTH,
            y:
              Math.floor(Math.random() * this.pipeTopHeight) -
              this.pipeTopHeight +
              5
          });
        }
        if(this.pipes[i].x == 55){
          this.pointAudio.play();
          this.score++;
        }

        this.collisionDetection(this.pipes[i]);
        this.pipes[i].x -= 1;
      }
    }
  }

  drawBird() {
    this.ctx.drawImage(this.birdImage, this.birdPositionX, this.birdPositionY);
  }

  applyGravity(){
    this.birdPositionY += this.gravity;
  }

  
  collisionDetection(pipe) {
    //if bird touches the ground
    let hasBirdTouchedTheGround =  this.birdPositionY + this.birdHeight >= this.CANVAS_HEIGHT - this.baseHeight;
    
      //if bird touches or is in inside the area of pipes
    let hasBirdTouchedOrIsInsideAPipe = this.birdPositionX + this.birdWidth >= pipe.x 
                                                            &&
                                        this.birdPositionX <= pipe.x + this.pipeWidth 
                                                            &&
                                        (this.birdPositionY <= pipe.y + this.pipeTopHeight 
                                                            ||
                                        this.birdPositionY + this.birdHeight >= pipe.y + this.PIPE_BOTTOM_CONSTANT);
    
      if (hasBirdTouchedTheGround || hasBirdTouchedOrIsInsideAPipe)
      {
        this.setBirdToInitialPosition();
        this.dieAudio.play();
        this.beginScreen = true;
      }
  }

  //loads all the images
  loadImages() {
    this.backgroundImage = this.getImageElement("sprites/background-day.png");
    this.birdImage = this.getImageElement("sprites/redbird-midflap.png");
    this.pipeTopImage = this.getImageElement("sprites/pipe-top.png");
    this.pipeBottomImage = this.getImageElement("sprites/pipe-bottom.png");
    this.baseImage = this.getImageElement("sprites/base.png");

  }

  loadAudios(){
    this.dieAudio = this.getAudioElement("audio/die.wav");
    this.hitAudio = this.getAudioElement("audio/hit.wav");
    this.swooshAudio = this.getAudioElement("audio/swoosh.wav");
    this.wingAudio = this.getAudioElement("audio/wing.wav");
    this.pointAudio = this.getAudioElement("audio/point.wav");

  }

  //accepts image source and return image element
  getImageElement(src) {
    let image = new Image();
    image.src = src;
    return image;
  }

  //accepts audio source and return audio element
  getAudioElement(src) {
    let audio = new Audio();
    audio.src = src;
    return audio;
  }
}

