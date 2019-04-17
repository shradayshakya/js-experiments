
var wrapper = document.getElementById("carousel-images");

// var leftButton = document.createElement("img");
// leftButton.setAttribute("src" ,"images/left.png");
// leftButton.style.width = "30px";
// leftButton.style.height = "30px";
// leftButton = 
// console.log(leftButton);



var left = 0;
var offset = 5;
var imageWidth = 960;
var numberOfImages = wrapper.getElementsByTagName("img").length;
var leftToRightFlag = 1;

var FPS = 60;
var LEFT_TO_RIGHT_RATE = -5;
var RIGHT_TO_LEFT_RATE = 50
var MAX_WIDTH = -(imageWidth * (numberOfImages - 1));

var start = function() {
  var currentInterval = setInterval(function() {
    slide();
    if (left % imageWidth == 0 && leftToRightFlag== 1) {
      pauseSlide(currentInterval);
    }
  }, 1000 / FPS);
};

function pauseSlide(currentInterval) {
  clearInterval(currentInterval);

  setTimeout(function() {
    start();
  }, 1000);
}

function slide() {
if(left<=MAX_WIDTH){
    offset = RIGHT_TO_LEFT_RATE;
    leftToRightFlag = 0;
}

if(left >= 0){
    offset = LEFT_TO_RIGHT_RATE;
    leftToRightFlag = 1;
}

//   offset = (left <= MAX_WIDTH || left >= 0)? (offset *= -1): offset;
  left += offset;
  wrapper.style.left = left + "px";
}
start();

