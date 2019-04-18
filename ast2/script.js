class Circle {
  constructor(ctx, x, y, xVelocity, yVelocity, radius, color) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.velocity = {
      x: xVelocity,
      y: yVelocity
    };
    this.radius = radius;
    this.color = color;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }

  update(width, height, circles, calculateDistance) {
    this.draw();
    for (let i = 0; i < circles.length; i++) {
      if (this === circles[i]) continue;
      if (
        calculateDistance(this.x, this.y, circles[i].x, circles[i].y) -
          this.radius * 2 <
        0
      ) {
        this.resolveCollision(this, circles[i]);
      }
    }

    if (this.x > width - this.radius || this.x < this.radius) {
      this.velocity.x = -this.velocity.x;
    }

    if (this.y > height - this.radius || this.y < this.radius) {
      this.velocity.y = -this.velocity.y;
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  rotate(velocity, angle) {
    const rotatedVelocities = {
      x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
      y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
    return rotatedVelocities;
  }

  //One Dimentional Newtonian
  resolveCollision(circleA, circleB) {
    const xVelocityDiff = circleA.velocity.x - circleB.velocity.x;
    const yVelocityDiff = circleA.velocity.y - circleB.velocity.y;

    const xDist = circleB.x - circleA.x;
    const yDist = circleB.y - circleA.y;

    //Only if circles aren't overlapping
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

      //Angles for rotating circles such that the circles aren't moving in only in one dimention
      const angle = -Math.atan2(circleB.y - circleA.y, circleB.x - circleA.x);

      //Mass of circles
      const m1 = 1;
      const m2 = 1;

      // Velocity before equation
      const u1 = this.rotate(circleA.velocity, angle);
      const u2 = this.rotate(circleB.velocity, angle);

      // Velocity after 1d collision newtonian equation
      const v1 = {
        x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
        y: u1.y
      };
      const v2 = {
        x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
        y: u2.y
      };

      // Final velocity after rotating axis back to original location
      const vFinal1 = this.rotate(v1, -angle);
      const vFinal2 = this.rotate(v2, -angle);

      // Swap circleA velocities for realistic bounce effect
      circleA.velocity.x = vFinal1.x;
      circleA.velocity.y = vFinal1.y;

      circleB.velocity.x = vFinal2.x;
      circleB.velocity.y = vFinal2.y;
    }
  }
}

class Canvas {
  constructor(canvas, height, width) {
    this.element = canvas;
    this.width = width;
    this.height = height;
    this.element.width = width;
    this.element.height = height;
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
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  start() {
    this.circles = [];
    for (let i = 0; i < 50; i++) {
      let radius = 10;
      let x = this.randomIntFromInterval(radius * 2, this.width - radius * 2);
      let y = this.randomIntFromInterval(radius * 2, this.width - radius * 2);
      let xVelocity = (Math.random() - 0.5) * 10;
      let yVelocity = (Math.random() - 0.5) * 10;

      //to avoid overlapping circles
      if (i !== 0) {
        for (let j = 0; j < this.circles.length; j++) {
          if (
            this.calculateDistance(x, y, this.circles[j].x, this.circles[j].y) -
              radius * 2 <
            5
          ) {
            x = this.randomIntFromInterval(radius * 2, this.width - radius * 2);
            y = this.randomIntFromInterval(radius * 2, this.width - radius * 2);
            j = -1;
          }
        }
      }

      this.circles.push(
        new Circle(
          this.ctx,
          x,
          y,
          xVelocity,
          yVelocity,
          radius,
          this.colors[i % this.colors.length]
        )
      );
    }

    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].update(
        this.width,
        this.height,
        this.circles,
        this.calculateDistance
      );
    }
    requestAnimationFrame(() => this.animate());
  }

  calculateDistance(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

let canvasElement = document.getElementById("canvas");
let canvas = new Canvas(canvasElement, 500, 500);
canvas.start();
