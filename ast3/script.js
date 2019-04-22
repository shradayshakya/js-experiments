class Bird {
  constructor(xPosition, yPosition) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;

    //variables initiated in init
    this.image;
    this.wingAudio;
    this.hitAudio;
    this.dieAudio;

    //constants
    this.WIDTH = 34;
    this.HEIGHT = 24;
    this.FLY_DISTANCE = -42;

    this.init();
  }

  //initiating variables
  init() {
    this.image = MediaLoader.getImageElement("sprites/redbird-midflap.png");
    this.wingAudio = MediaLoader.getAudioElement("audio/wing.wav");
    this.hitAudio = MediaLoader.getAudioElement("audio/hit.wav");
    this.dieAudio = MediaLoader.getAudioElement("audio/die.wav");	
	}

  //accepts canvas context object and draws it in the canvas
  draw(ctx) {
    ctx.drawImage(this.image, this.xPosition, this.yPosition);
  }
}

class Pipe {
  constructor(xPosition, yPosition) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;

    //variables initiated in init
    this.upperPipeImage;
    this.lowerPipeImage;

    //constants
    this.WIDTH = 52;
    this.UPPER_PIPE_HEIGHT = 250;
    this.LOWER_PIPE_HEIGHT = 378;
    this.LOWER_PIPE_VERTICAL_OFFSET = this.UPPER_PIPE_HEIGHT + 100; //Here 100 is gap between upper and lower pipes
    this.NEXT_PIPE_SPAWN_DISTANCE = 125; //At what distance of incomming pipe, another pipe is generated

    this.init();
  }

  //initiating variables
  init() {
    this.upperPipeImage = MediaLoader.getImageElement("sprites/pipe-top.png");
    this.lowerPipeImage = MediaLoader.getImageElement(
      "sprites/pipe-bottom.png"
    );
  }

  //accepts canvas context object and draws both upper and lower pipe in the canvas
  draw(ctx) {
    ctx.drawImage(this.upperPipeImage, this.xPosition, this.yPosition);

    ctx.drawImage(
      this.lowerPipeImage,
      this.xPosition,
      this.yPosition + this.LOWER_PIPE_VERTICAL_OFFSET
    );
  }
}

class FlappyBirdCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    //constants
    this.CANVAS_WIDTH = 288;
    this.CANVAS_HEIGHT = 512;
    this.GRAVITY = 1.8;

    //setting canvas size
    this.canvas.width = this.CANVAS_WIDTH;
    this.canvas.height = this.CANVAS_HEIGHT;

    //declaring variables
    this.bird;
    this.pipes = []; //There might be more than one pipe in the screen
    this.background;
    this.foreground;
    this.gameEnd;
		this.beginScreen;
		this.score;
		this.pointAudio;
  

    this.init();
  }

  //Defining canvas height and width, canvas' context and loading images and audio
  init() {
    this.bird = new Bird(100, this.CANVAS_HEIGHT / 2);
    this.pipes.push(new Pipe(this.CANVAS_WIDTH, 0)); //A pipe object consist of both upper and lower pipe
    this.background = MediaLoader.getImageElement("sprites/background-day.png");
    this.foreground = MediaLoader.getImageElement("sprites/base.png");
		this.pointAudio = MediaLoader.getAudioElement("audio/point.wav");
		this.score = 0;
    this.beginScreen = true;
    document.addEventListener(
      "keyup",
      function(event) {
				if(event.key == "Enter"){
					if(this.beginScreen){
						this.pipes = [];
						this.pipes.push(new Pipe(this.CANVAS_WIDTH, 0));
						this.score = 0;
            this.beginScreen = false;
					}
				}
        if (event.key === " " && !this.beginScreen) {
          this.bird.wingAudio.play();
          this.bird.yPosition += this.bird.FLY_DISTANCE;
        }
      }.bind(this)
    );
  }

  playGame() {
    this.drawObjects();
    requestAnimationFrame(() => this.playGame());
  }

  drawObjects() {
		this.drawBackground();
		if(!this.beginScreen){
			this.drawText(this.score, this.CANVAS_WIDTH/2 -15, 50,50);
			this.updateAndDrawPipes();
		}else{
      this.drawText("PRESS ENTER TO START", 35,50,20);
      this.drawText("SPACE TO FLAP", 80, 80, 18)
      if(this.score > 0)
      this.drawText("Your score is "+this.score, 80,160,15)
		}
    this.updateAndDrawBird();
    this.drawForeground();
  }

  updateAndDrawBird() {
		if(!this.beginScreen)
		this.bird.yPosition += this.GRAVITY;
	
    this.bird.draw(this.ctx);
  }

  updateAndDrawPipes() {
    for (let i = 0; i < this.pipes.length; i++) {
     	 if (this.pipes[i].xPosition <= -this.pipes[i].WIDTH) {
        //Removing a pair of pipe that is out of screen
        this.pipes.shift();
				i--;
     	 } else {
				
			
				if(this.collisionDetection(this.bird, this.pipes[i])){
					this.bird.xPosition = 100;
					this.bird.yPosition = this.CANVAS_HEIGHT/2 -15;
					this.bird.dieAudio.play();
        	this.beginScreen = true;
				}

        this.pipes[i].xPosition--;
        //Draws both upper and lower pipe(pair of pipe)
				this.pipes[i].draw(this.ctx);
				
				//Respawing new pair of pipe and random vertical position between 0 and - pipe height
        if (this.pipes[i].xPosition == this.pipes[i].NEXT_PIPE_SPAWN_DISTANCE) { 
					let randomYPosition =Math.floor(Math.random() *(-25 + this.pipes[i].UPPER_PIPE_HEIGHT) - this.pipes[i].UPPER_PIPE_HEIGHT+25);
					this.pipes.push(
            new Pipe(
              this.CANVAS_WIDTH,
              randomYPosition
            )
          );
				}

				if(this.pipes[i].xPosition == 55){
          this.pointAudio.play();
          this.score++;
        }				
      }
    }
	}
	
	collisionDetection(bird, pipe) {
    //if bird touches the ground
    let hasBirdTouchedTheGround =  bird.yPosition + bird.HEIGHT >= this.CANVAS_HEIGHT - this.foreground.height;
		
      //if bird touches or is in inside the area of pipes
    let hasBirdTouchedOrIsInsideAPipe = bird.xPosition + bird.WIDTH >= pipe.xPosition 
                                                            &&
                                        bird.xPosition <= pipe.xPosition + pipe.WIDTH 
                                                            &&
                                        (bird.yPosition <= pipe.yPosition + pipe.UPPER_PIPE_HEIGHT 
                                                            ||
                                        bird.yPosition + bird.HEIGHT >= pipe.yPosition + pipe.LOWER_PIPE_VERTICAL_OFFSET);
    
      if(hasBirdTouchedTheGround || hasBirdTouchedOrIsInsideAPipe) return true;
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
      0,
      this.CANVAS_HEIGHT - this.foreground.height
    );
	}
	
	drawText(text, xPosition, yPosition, size){
			this.ctx.font = size+"px flappyBird";  
      this.ctx.textBaseline = 'top';
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
