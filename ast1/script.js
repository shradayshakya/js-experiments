class ImageButton {
  constructor(
    imageName,
    clickImageName,
    width,
    height,
    leftPositionInPercent,
    topPositionInPercent
  ) {
    this.element = document.createElement("button");
    this.imageName = imageName;
    this.clickImageName = clickImageName;
    this.width = width;
    this.height = height;
    this.leftPositionInPercent = leftPositionInPercent;
    this.topPositionInPercent = topPositionInPercent;
    this.init();
  }

  init() {
    this.element.style.backgroundColor = "transparent";
    this.element.style.border = "none";
    this.element.style.width = this.width + "px";
    this.element.style.height = this.height + "px";
    this.element.onfocus = function() {
      this.element.style.outline = "0";
    }.bind(this);
    var image = document.createElement("img");
    image.setAttribute("src", "images/" + this.imageName);
    image.style.width = "100%";
    this.element.appendChild(image);

    this.element.style.position = "absolute";
    this.element.style.left = this.leftPositionInPercent + "%";
    this.element.style.top = this.topPositionInPercent + "%";

    this.element.onmouseleave = function() {
      this.element.childNodes[0].setAttribute(
        "src",
        "images/" + this.imageName
      );
    }.bind(this);
    this.element.onmouseenter = function() {
      this.element.childNodes[0].setAttribute(
        "src",
        "images/" + this.clickImageName
      );
    }.bind(this);
  }

  getButton() {
    return this.element;
  }
}

class Carousel {
  constructor(containerElement, transitionVelocity) {
    this.containerElement = containerElement;
    this.transitionVelocity = transitionVelocity;
    this.init();
  }

  init() {
    this.wrapperElement = this.containerElement.querySelector(".carousel-wrapper");

    this.images = this.containerElement.querySelectorAll("img");
    this.numberOfImages = this.images.length;

    //ADDING FAKE FIRST IMAGE AT THE BACK AND FAKR LAST IMAGE AT THE FIRST FOR LOOP EFFECT IN CAROUSEL
    let fakeFirstImage =  this.images[0].cloneNode(true);
    let fakeLastImage = this.images[this.numberOfImages-1].cloneNode(true);
    this.wrapperElement.insertBefore(fakeLastImage, this.images[0]);
    this.wrapperElement.appendChild(fakeFirstImage);
    this.numberOfImagesIncludingFakes = this.numberOfImages + 2;

    this.windowSize = this.images[0].width;
    
    this.wrapperSize = this.windowSize * (this.numberOfImages+2);

    this.wrapperElement.style.width = this.wrapperSize + "px";

    this.currentPosition = -960;
    this.counter = 1;
    this.transitionState = false;

    this.leftButtonSetup();
    this.rightButtonSetup();
    this.updateWrapperPosition();
    this.indicatorButtonsSetup();
    this.slideShow();
  }

  slideShow(){
    this.slideShowId = setInterval(()=>{
      if (!this.transitionState) {
        if(this.counter == (this.numberOfImagesIncludingFakes -2)){
          this.counter = 0;
          this.currentPosition = this.counter * -this.windowSize;
          this.updateWrapperPosition();
        }
        this.transitionState = true;
        this.counter++;
        this.slideToNewPosition(this.counter * -this.windowSize,0.5);
      }
    },3000);
  }

  leftButtonSetup() {

    this.leftButton = new ImageButton(
      "left.png",
      "left-click.png",
      50,
      50,
      0,
      40
    ).getButton();
    this.leftButton.onclick = this.back.bind(this);
    this.containerElement.appendChild(this.leftButton);
  }

  rightButtonSetup() {
    this.rightButton = new ImageButton(
      "right.png",
      "right-click.png",
      50,
      50,
      95,
      40
    ).getButton();
    this.rightButton.onclick = this.next.bind(this);
    this.containerElement.appendChild(this.rightButton);
  }
  
  indicatorButtonsSetup() {
    this.indicatorButtons = [];
    for (let i = 0; i < this.images.length; i++) {
      let button = new ImageButton(
        "icon-circle.png",
        "icon-circle-click.png",
        20,
        20,
        50 + i * 2,
        90
      ).getButton();
      button.index = i;
      button.onclick = function(){this.indicatorEvent(button)}.bind(this);
      this.indicatorButtons.push(button);
      container.appendChild(button);
    }
  }

  //triggers when left button is clicked
  back() {
    console.log(this.counter); 
    if (!this.transitionState) {
      if(this.counter==1){
        this.counter = this.numberOfImagesIncludingFakes - 1;
        this.currentPosition = this.counter * -this.windowSize;
        this.updateWrapperPosition();
      }  

      this.transitionState = true;
      this.counter--;
      this.slideToNewPosition(this.counter * -this.windowSize);
    }
  }

  //triggers when right button is clicked
  next() {
    if (!this.transitionState) {
      if(this.counter == (this.numberOfImagesIncludingFakes -2)){
        this.counter = 0;
        this.currentPosition = this.counter * -this.windowSize;
        this.updateWrapperPosition();
      }

      this.transitionState = true;
      this.counter++;
      this.slideToNewPosition(this.counter * -this.windowSize);
    }
  }

  //triggers when one of the indicator button is clicked
  indicatorEvent(triggeringIndicator){
    if (!this.transitionState) {
      this.transitionState = true;
      this.counter = triggeringIndicator.index + 1;
      this.slideToNewPosition(this.counter * -this.windowSize, 2);
    }
  }



  slideToNewPosition(newPosition, velocityMultiplier = 1) {
    if (this.getDistanceFromCurrentPosition(newPosition) === 0) {
      this.transitionState = false;
      cancelAnimationFrame(this.rafID);
    } else {
      if (newPosition > this.currentPosition) {
        this.currentPosition += this.transitionVelocity * velocityMultiplier;
      } else {
        this.currentPosition -= this.transitionVelocity * velocityMultiplier;
      }
      this.updateWrapperPosition();
      this.rafID = requestAnimationFrame(() =>
        this.slideToNewPosition(newPosition, velocityMultiplier)
      );
    }
  }

  getDistanceFromCurrentPosition(newPosition) {
    if (newPosition > this.currentPosition) {
      return newPosition - this.currentPosition;
    } else if (newPosition < this.currentPosition) {
      return this.currentPosition - newPosition;
    } else {
      return 0;
    }
  }

  updateWrapperPosition() {
    this.wrapperElement.style.left = this.currentPosition + "px";
  }
}

let carouselContainer = document.getElementById("container");
let carousel = new Carousel(carouselContainer, 30);
