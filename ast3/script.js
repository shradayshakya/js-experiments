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
    //loading images
    this.loadImages();

    //declaring size and widths of objects
    this.birdHeight = 24;
    this.birdWidth = 34;

    this.pipeTopHeight = 250;
    this.pipeWidth = 52;
    this.gapBetweenPipes = 100;

    this.baseHeight = 112;

    this.PIPE_BOTTOM_CONSTANT = this.pipeTopHeight + this.gapBetweenPipes;

    //declaring initial positions of objects
    this.birdPositionX = 100;
    this.birdPositionY = this.CANVAS_HEIGHT / 2;

    this.gravity = 1.5;

    this.pipes = [];
    this.pipes[0] = {
      x: this.CANVAS_WIDTH,
      y: -100
    }

    //adding event listeners
    document.addEventListener('keyup', function(event){
      if(event.key === ' '){
        this.birdPositionY -= 42;
      }
    }.bind(this));
}  
  
  //Game starts from here
  playGame() {
    this.drawObjects();
    requestAnimationFrame(()=>this.playGame());
  }

  collisionDetection(pipe){
    //if bird touches the ground
      if(this.birdPositionY + this.birdHeight >= this.CANVAS_HEIGHT - this.baseHeight){
        location.reload();
      } 

      //if bird touches or is in inside the area of pipes
      console.log();
      if(this.birdPositionX+this.birdWidth >= pipe.x && this.birdPositionX <= pipe.x +this.pipeWidth && (this.birdPositionY <= pipe.y + this.pipeTopHeight || this.birdPositionY+this.birdHeight >= pipe.y + this.PIPE_BOTTOM_CONSTANT)){
        location.reload();
      }
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

    this.drawPipes();

    this.ctx.drawImage(this.baseImage,0, this.CANVAS_HEIGHT-this.baseImage.height)

    this.drawBird();
  }

  drawBird() {
    this.ctx.drawImage(this.birdImage, this.birdPositionX, this.birdPositionY);

    this.birdPositionY += this.gravity;
  }

  drawPipes() {
    for(let i = 0; i <  this.pipes.length ; i++){
      if(this.pipes[i].x <= -this.pipeWidth){
        this.pipes.shift();
        i--;
      }
      else{
        this.ctx.drawImage(this.pipeTopImage, this.pipes[i].x, this.pipes[i].y);
        this.ctx.drawImage(this.pipeBottomImage, this.pipes[i].x, this.pipes[i].y + this.PIPE_BOTTOM_CONSTANT);
        if(this.pipes[i].x ==125){
          let limit = 20;
          this.pipes.push({
            x: this.CANVAS_WIDTH,
            y: Math.floor(Math.random()* this.pipeTopHeight)-this.pipeTopHeight +5
          });
        }
        
      this.collisionDetection(this.pipes[i]);
        this.pipes[i].x-=1;
      }
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

//accepts image source and return image element
  getImageElement(src) {
    var image = new Image();
    image.src = src;
    return image;
  }
}

var canvas = document.getElementById("canvas");
var flappyBirdCanvas = new FlappyBirdCanvas(canvas);
flappyBirdCanvas.playGame();
