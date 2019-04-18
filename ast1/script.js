//Constants declaration and assignment
var IMAGE_WIDTH = 960;
var AUTO_TRANS_SPEED = 10;
var EVENT_TRANS_SPEED = 50;
var PAUSE_DURATION = 500; //In milliseconds

//Variables declaration and assignment
var wrapper = document.getElementById("carouselWrapper");
var container = document.getElementById("container");
var totalWrapperWidth = wrapper.childElementCount * IMAGE_WIDTH;
var minLeft = -(totalWrapperWidth - IMAGE_WIDTH);
wrapper.style.width = totalWrapperWidth + "px";
var leftPosition = 0;
var offset;
var requestId;
var indicatorButtons = [];
var leftButton;
var rightButton;
var eventState;
var eventTravelPosition;
 var isLeftToRight;


// Carousel images transition BEGIN

//Starts the tranisition animation
function startTransition() {
  slide();
  if (leftPosition % IMAGE_WIDTH == 0 && !eventState) {
    pauseTransition(requestId);
  } else {
    requestId = requestAnimationFrame(startTransition);
  }
}

//Slides the wrapper left or right and pauses if leftPosition is zero
function slide() {
  if(eventState){
    var deviation = Math.abs(leftPosition - eventTravelPosition);
    console.log("Left Position:"+leftPosition+"   ||||||| Event Travel Position:"+ eventTravelPosition + " ||||||| Deviation:"+deviation);
    if(deviation < IMAGE_WIDTH){
      eventState = false;
    }
  }

  if (leftPosition >= 0) {
    offset = (eventState)? -EVENT_TRANS_SPEED: -AUTO_TRANS_SPEED;
    isLeftToRight = false;
  }else if (leftPosition <= minLeft) {
    offset = (eventState)? EVENT_TRANS_SPEED: AUTO_TRANS_SPEED;
    isLeftToRight = true;
  }

  if (leftPosition == 0 && !eventState) {
    setTimeout(function() {
      leftPosition += offset;
      updateWrapperPosition(leftPosition);
    }, PAUSE_DURATION);
  } else {
     leftPosition += offset;
      updateWrapperPosition(leftPosition);
  }
}

//Updates wrapper position
function updateWrapperPosition(leftPosition) {
  wrapper.style.left = leftPosition + "px";
}

//pauses transition of a second
function pauseTransition(requestId) {
  window.cancelAnimationFrame(requestId);
  setTimeout(function() {
    startTransition();
  }, PAUSE_DURATION);
}

// Carousel images transition animation END

//Returns an image button element with different image when clicked


//Buttons setup BEGIN

//LEFT BUTTON
leftButton = createButtonWithImage("left.png", "left-click.png", 50, 50, 0, 40);

leftButton.onclick = function(){
  leftPosition = (leftPosition >= -IMAGE_WIDTH)? minLeft:(leftPosition - (leftPosition % IMAGE_WIDTH)) + IMAGE_WIDTH; 
  updateWrapperPosition(leftPosition);
}
container.appendChild(leftButton);

//RIGHT BUTTON
rightButton = createButtonWithImage(
  "right.png",
  "right-click.png",
  50,
  50,
  95,
  40
);

rightButton.onclick = function() {
  leftPosition = (leftPosition <= (minLeft-IMAGE_WIDTH))? 0: (leftPosition - (leftPosition % IMAGE_WIDTH)) - IMAGE_WIDTH; 
  console.log(leftPosition);
  updateWrapperPosition(leftPosition);
};
container.appendChild(rightButton);


//INDICATOR BUTTONS
for (i = 0; i < wrapper.childElementCount; i++) {
  indicatorButtons.push(
    createButtonWithImage(
      "icon-circle.png",
      "icon-circle-click.png",
      20,
      20,
      50 + i * 2,
      90
    )
  ); 
}

indicatorButtons[0].onclick = function(){
  leftPosition = 0 * (-IMAGE_WIDTH);
  updateWrapperPosition(leftPosition);
}
container.appendChild(indicatorButtons[0]);

indicatorButtons[1].onclick = function(){
  leftPosition = 1 * (-IMAGE_WIDTH);
  updateWrapperPosition(leftPosition);
}
container.appendChild(indicatorButtons[1]);

indicatorButtons[2].onclick = function(){
  leftPosition = 2 * (-IMAGE_WIDTH);
  updateWrapperPosition(leftPosition);
}
container.appendChild(indicatorButtons[2]);


//Buttons setup END

function createButtonWithImage(
  imageName,
  clickImageName,
  width,
  height,
  leftPositionInPercent,
  topPositionInPercent
) {
  var button = document.createElement("button");
  button.style.backgroundColor = "transparent";
  button.style.border = "none";
  button.style.width = width + "px";
  button.style.height = height + "px";
  button.onfocus = function() {
    button.style.outline = "0";
  };
  var image = document.createElement("img");
  image.setAttribute("src", "images/" + imageName);
  image.style.width = "100%";
  button.appendChild(image);

  button.style.position = "absolute";
  button.style.left = leftPositionInPercent + "%";
  button.style.top = topPositionInPercent + "%";

  button.onmouseleave = function() {
    button.childNodes[0].setAttribute("src", "images/" + imageName);
  };
  button.onmouseenter = function() {
    button.childNodes[0].setAttribute("src", "images/" + clickImageName);
  };

  


  return button;
}

startTransition();

