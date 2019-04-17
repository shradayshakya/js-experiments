//Constants declaration and assignment
var IMAGE_WIDTH = 960;
var LEFT_TO_RIGHT_SPEED = -10; //Less is more
var RIGHT_TO_LEFT_SPEED = 50;
var PAUSE_DURATION = 500; //In milliseconds

//Variables declaration and assignment
var wrapper = document.getElementById("carousel-wrapper");
var totalWrapperWidth = wrapper.childElementCount * IMAGE_WIDTH;
var minLeft = -(totalWrapperWidth - IMAGE_WIDTH);
wrapper.style.width = totalWrapperWidth + "px";
var leftPosition = 0;
var offset;
var isLeftToRight;
var requestId;

// Functions for animation BEGIN

//Starts the tranisition animation
function startTransition() {
  slide();
  if (leftPosition % IMAGE_WIDTH == 0 && isLeftToRight) {
    pauseTransition(requestId);
  } else {
    requestId = requestAnimationFrame(startTransition);
  }
}

//Slides the wrapper left or right and pauses if left is zero
function slide() {
  if (leftPosition <= minLeft) {
    offset = RIGHT_TO_LEFT_SPEED;
    isLeftToRight = false;
  } else if (leftPosition >= 0) {
    offset = LEFT_TO_RIGHT_SPEED  ;
    isLeftToRight = true;
  }

  if (leftPosition == 0) {
    setTimeout(function() {
      updateWrapperPosition();
    }, PAUSE_DURATION);
  } else {
    updateWrapperPosition();
  }
}

//Updates wrapper position
function updateWrapperPosition() {
  leftPosition += offset;
  wrapper.style.left = leftPosition + "px";
}

//pauses transition of a second
function pauseTransition(requestId) {
  window.cancelAnimationFrame(requestId);
  setTimeout(function() {
    startTransition();
  }, PAUSE_DURATION);
}

// Functions for animation END

startTransition();
