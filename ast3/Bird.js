class Bird {
  constructor(xPosition, yPosition) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.initialPositionX = xPosition;
    this.initialPositionY = yPosition;

    //variables initiated in init
    this.image;
    this.wingAudio;
    this.hitAudio;
    this.dieAudio;
    this.acceleration;
    this.images = [];
    this.imageFlag = 0;

    //constants
    this.WIDTH = 34;
    this.HEIGHT = 24;
    this.FLY_DISTANCE = -30;
    this.ACCELERATION_RATE = 0.1;
    this.GRAVITY = 0.6;
    this.FLAP_REFRESH_RATE = 12;

    this.init();
  }

  //initiating variables
  init() {
    this.images[0] = MediaLoader.getImageElement("sprites/redbird-upflap.png");
    this.images[1] = MediaLoader.getImageElement("sprites/redbird-midflap.png");
    this.images[2] = MediaLoader.getImageElement(
      "sprites/redbird-downflap.png"
    );

    this.wingAudio = MediaLoader.getAudioElement("audio/wing.wav");
    this.hitAudio = MediaLoader.getAudioElement("audio/hit.wav");
    this.dieAudio = MediaLoader.getAudioElement("audio/die.wav");
  }

  //accepts canvas context object and draws it in the canvas
  draw(ctx) {
    ctx.drawImage(
      this.images[this.imageFlag % 3],
      this.xPosition,
      this.yPosition
    );
  }
}
