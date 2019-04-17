//Constants declaration and assignment
var IMAGE_WIDTH = 960;
var LEFT_TO_RIGHT_SPEED = -10; //Less is more
var RIGHT_TO_LEFT_SPEED = 50;
var PAUSE_DURATION = 500; //In milliseconds

//Variables declaration and assignment
var wrapper = document.getElementById("carouselWrapper");
var container = document.getElementById("container");
var totalWrapperWidth = wrapper.childElementCount * IMAGE_WIDTH;
var minLeft = -(totalWrapperWidth - IMAGE_WIDTH);
wrapper.style.width = totalWrapperWidth + "px";
var leftPosition = 0;
var offset;
var isLeftToRight;
var requestId;
var indicatorButtons=[];
var leftButton;
var rightButton;

//Buttons setup BEGIN
leftButton = createButtonWithImage("left.png","left-click.png", 50, 50 , 0 , 40);
container.appendChild(leftButton);

rightButton = createButtonWithImage("right.png","right-click.png", 50 , 50 , 95 , 40);
container.appendChild(rightButton);

for(var i=0; i< wrapper.childElementCount; i++){
  indicatorButtons.push(createButtonWithImage("icon-circle.png","icon-circle-click.png",20,20,50+(i*2),90));
  container.appendChild(indicatorButtons[i]);
}
//Buttons setup END


// Carousel images transition BEGIN

//Starts the tranisition animation 
function startTransition() {
  slide();
  if (leftPosition % IMAGE_WIDTH == 0 && isLeftToRight) {
    pauseTransition(requestId);
  } else {
    requestId = requestAnimationFrame(startTransition);
  }
}

//Slides the wrapper left or right and pauses if leftPosition is zero
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

// Carousel images transition animation END

//Returns an image button element with different image when clicked
function createButtonWithImage(imageName, clickImageName, width, height, leftPositionInPercent, topPositionInPercent){
  var button = document.createElement("button");
  button.style.backgroundColor = "transparent";
  button.style.border = "none";
  button.style.width = width + "px";
  button.style.height = height + "px";
  button.onfocus = function(){
    button.style.outline = "0";
  }
  var image = document.createElement("img");
  image.setAttribute("src","images/"+imageName);
  image.style.width = "100%";
  button.appendChild(image);

  button.style.position= "absolute";
  button.style.left = leftPositionInPercent+'%';
  button.style.top = topPositionInPercent+'%';
  button.onmousedown= function(){
    button.childNodes[0].setAttribute("src",'images/'+clickImageName);
  };
  button.onmouseup= function(){
  button.childNodes[0].setAttribute("src",'images/'+imageName);
  };
  return button;
}




startTransition();

