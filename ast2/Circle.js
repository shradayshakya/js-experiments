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

  drawAndUpdate(width, height, circles) {
    this.draw();

    this.resolveCollision(width, height, circles);

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  resolveCollision(width, height, circles) {
    //Collision detection and resolve for each and every other ball
    for (let i = 0; i < circles.length; i++) {
      if (this === circles[i]) continue;

      //Collision detection and resolve between 2 balls
      if (
        calculateDistance(this.x, this.y, circles[i].x, circles[i].y) -
          this.radius * 2 <
        0
      ) {
        this.resolveCollisionWithElasticity(this, circles[i]);
      }
    }

    //Detect collision and resolve between left and right wall
    if (this.x > width - this.radius || this.x < this.radius) {
      this.velocity.x = -this.velocity.x;
    }

    //Detect collision and resolve betweeen upper and lower wall
    if (this.y > height - this.radius || this.y < this.radius) {
      this.velocity.y = -this.velocity.y;
    }
  }

  //Elastic collision using one Dimentional Newtonian
  resolveCollisionWithElasticity(circleA, circleB) {
    let xVelocityDiff = circleA.velocity.x - circleB.velocity.x;
    let yVelocityDiff = circleA.velocity.y - circleB.velocity.y;

    let xDist = circleB.x - circleA.x;
    let yDist = circleB.y - circleA.y;

    //Not resolving collision when two balls have accidentally overlapped eachother
    //i.e they are going in similar direction and distance between them is less than zero
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
      //Angles for rotating circles such that the circles aren't moving in only in one dimention
      let angle = -Math.atan2(circleB.y - circleA.y, circleB.x - circleA.x);

      //Mass of circles
      let massOfCircleA = 1;
      let massOfCircleB = 1;

      // Velocity before equation
      let initialRotatedVelocityOfA = this.getRotatedVelocities(
        circleA.velocity,
        angle
      );
      let initialRotatedVelocityOfB = this.getRotatedVelocities(
        circleB.velocity,
        angle
      );

      // Velocity after 1d collision newtonian equation
      let calculatedVelocityBeforeRotationA = {
        x:
          (initialRotatedVelocityOfA.x * (massOfCircleA - massOfCircleB)) /
            (massOfCircleA + massOfCircleB) +
          (initialRotatedVelocityOfB.x * 2 * massOfCircleB) /
            (massOfCircleA + massOfCircleB),
        y: initialRotatedVelocityOfA.y
      };
      let calculatedVelocityBeforeRotationB = {
        x:
          (initialRotatedVelocityOfB.x * (massOfCircleA - massOfCircleB)) /
            (massOfCircleA + massOfCircleB) +
          (initialRotatedVelocityOfA.x * 2 * massOfCircleB) /
            (massOfCircleA + massOfCircleB),
        y: initialRotatedVelocityOfB.y
      };

      // Final velocity after rotating axis back to original location
      let finalVelocityA = this.getRotatedVelocities(
        calculatedVelocityBeforeRotationA,
        -angle
      );
      let finalVelocityB = this.getRotatedVelocities(
        calculatedVelocityBeforeRotationB,
        -angle
      );

      // Swap circleA velocities for realistic bounce effect
      circleA.velocity.x = finalVelocityA.x;
      circleA.velocity.y = finalVelocityA.y;

      circleB.velocity.x = finalVelocityB.x;
      circleB.velocity.y = finalVelocityB.y;
    }
  }

  getRotatedVelocities(velocity, angle) {
    return {
      x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
      y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
  }
}

function calculateDistance(xPosition1, yPosition1, xPosition2, yPosition2) {
  var dx = xPosition2 - xPosition1;
  var dy = yPosition2 - yPosition1;
  return Math.sqrt(dx * dx + dy * dy);
}
