class Pipe {
  constructor(xPosition, yPosition) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;

    console.log(this.xPosition, this.yPosition);
    //variables initiated in init
    this.upperPipeImage;
    this.lowerPipeImage;

    //constants
    this.WIDTH = 52;
    this.UPPER_PIPE_HEIGHT = 250;
    this.LOWER_PIPE_HEIGHT = 378;
    this.UPPER_AND_LOWER_PIPE_GAP = 100;
    this.LOWER_PIPE_VERTICAL_OFFSET =
      this.UPPER_PIPE_HEIGHT + this.UPPER_AND_LOWER_PIPE_GAP;
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
