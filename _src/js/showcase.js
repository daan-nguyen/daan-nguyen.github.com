// quick n dirty carousel

(function(window, document) {
  "use strict";

  // main elements
  var leftControl = document.getElementsByClassName('showcase-controls-left')[0];
  var rightControl = document.getElementsByClassName('showcase-controls-right')[0];
  var controlPanel = document.getElementsByClassName('showcase-controls-panel')[0];
  var slides = document.getElementsByClassName('showcase-slide');

  // vars
  var activeIndex;
  var activeSlide = document.getElementsByClassName('showcase-slide active')[0];

  if (!activeSlide) {
    slides[0].classList.add('active');
    activeIndex = 0;
  } else {
    for (var i=0; i<slides.length; i++) {
      if (activeSlide === slides[i]) {
        activeIndex = i;
        break;
      }
    }
  }

  // populate bubble panel
  for (var j=0; j<slides.length; j++) {
    var bubble = document.createElement('li');
    if (j === activeIndex) {
      bubble.classList.add('active');
    }

    controlPanel.appendChild(bubble);
  }

  // right control
  rightControl.addEventListener('click', function(event) {
    event.stopPropagation();
    var nextIndex = (activeIndex + 1 >= slides.length) ? 0 : activeIndex + 1;
    slides[nextIndex].classList.add('no-transition');
    slides[nextIndex].classList.remove('left');

    setTimeout(function() {
      slides[activeIndex].classList.remove('active');
      slides[activeIndex].classList.add('left');

      //slide in next slide
      slides[nextIndex].classList.remove('no-transition');
      slides[nextIndex].classList.add('active');

      controlPanel.children[activeIndex].classList.remove('active');
      controlPanel.children[nextIndex].classList.add('active');

      activeIndex = nextIndex;
    }, 50);
  }, false);

  // left control
  leftControl.addEventListener('click', function(event) {
    event.stopPropagation();
    var nextIndex = (activeIndex - 1 < 0) ? slides.length - 1 : activeIndex - 1;
    // move next slide into position in case it isnt
    slides[nextIndex].classList.add('no-transition');
    slides[nextIndex].classList.add('left');

    // timeout allows us to shift the next slide into position
    setTimeout(function() {
      slides[activeIndex].classList.remove('active');

      // increment index and slide in next slide
      slides[nextIndex].classList.remove('no-transition');
      slides[nextIndex].classList.remove('left');
      slides[nextIndex].classList.add('active');

      controlPanel.children[activeIndex].classList.remove('active');
      controlPanel.children[nextIndex].classList.add('active');

      activeIndex = nextIndex;
    }, 50);
  }, false);

})(window, document);