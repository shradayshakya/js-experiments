class Canvas {
  constructor(
    canvas,
    width = 1000,
    height = 550,
    numberOfBalls = 200,
    speed = 10
  ) {
    this.element = canvas;
    this.width = width;
    this.height = height;
    this.element.width = width;
    this.element.height = height;
    this.numberOfBalls = numberOfBalls;
    this.speed = speed;
    this.init();
  }

  init() {
    this.circles = [];
    this.colors = [
      "aqua",
      "black",
      "blue",
      "fuchsia",
      "gray",
      "green",
      "lime",
      "maroon",
      "navy",
      "olive",
      "orange",
      "purple",
      "red",
      "silver",
      "teal",
      "yellow"
    ];
    this.ctx = this.element.getContext("2d");
    this.generateBalls();
  }

  start() {
    this.ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].drawAndUpdate(this.width, this.height, this.circles);
    }
    requestAnimationFrame(() => this.start());
  }

  generateBalls() {
    for (let i = 0; i < this.numberOfBalls; i++) {
      let minBallRadius = 5;
      let maxBallRadius = 7;
      let radiusRandom = this.getRandomNumberBetweenTwoNumbers(
        minBallRadius,
        maxBallRadius
      );
      let xPositionRandom = this.getRandomNumberBetweenTwoNumbers(
        radiusRandom * 2,
        this.width - radiusRandom * 2
      );
      let yPositionRandom = this.getRandomNumberBetweenTwoNumbers(
        radiusRandom * 2,
        this.height - radiusRandom * 2
      );

      //Here random number is subtracted by 0.5 to generate both positive and negative direction
      let xVelocityRandom = (Math.random() - 0.5) * this.speed;
      let yVelocityRandom = (Math.random() - 0.5) * this.speed;
      let offSetBetweenBalls = 5;

      //to avoid overlapping circles
      if (i !== 0) {
        for (let j = 0; j < this.circles.length; j++) {
          //if balls overlap, generate new x and y position
          if (
            calculateDistance(
              xPositionRandom,
              yPositionRandom,
              this.circles[j].x,
              this.circles[j].y
            ) -
              radiusRandom * 2 <
            offSetBetweenBalls
          ) {
            xPositionRandom = this.getRandomNumberBetweenTwoNumbers(
              radiusRandom * 2,
              this.width - radiusRandom * 2
            );
            yPositionRandom = this.getRandomNumberBetweenTwoNumbers(
              radiusRandom * 2,
              this.height - radiusRandom * 2
            );
            j = -1;
          }
        }
      }

      this.circles.push(
        new Circle(
          this.ctx,
          xPositionRandom,
          yPositionRandom,
          xVelocityRandom,
          yVelocityRandom,
          radiusRandom,
          this.colors[i % this.colors.length]
        )
      );
    }
  }

  getRandomNumberBetweenTwoNumbers(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
