(function(window, document) {
	'use strict';

  var mobileOpenNavEl = document.getElementsByClassName('nav-toggle mobile')[0];
  var headerEl = document.getElementsByTagName('header')[0];
  var menuEl = document.getElementsByClassName('nav-cube')[0];
  var highlightsEl = document.getElementsByClassName('nav-face-highlights')[0];

  var toggleMenu = function() {
    headerEl.classList.toggle('show');
    mobileOpenNavEl.classList.toggle('close');
  };

  var childOfElement = function(targetElement, parentElementTag) {
    while (targetElement !== document) {
      if (targetElement.tagName.toLowerCase() === parentElementTag.toLowerCase()) {
        return targetElement;
      } else {
        targetElement = targetElement.parentNode;
      }
    }
  };

  // Mobile menu toggle button
  mobileOpenNavEl.addEventListener('click', function(event) {
    toggleMenu();
  }, false);

  // Header delegate event to pick up show/close toggle
  headerEl.addEventListener('click', function(event) {
    if (event.target.classList.contains('nav-toggle-bar') ||
        event.target.classList.contains('nav-toggle') ||
        event.target.parentElement.classList.contains('nav-toggle')) {
      toggleMenu();
    }
  });

  // Hides menu after clicking a nav link
  headerEl.addEventListener('click', function(event) {
    if (childOfElement(event.target, 'a') &&
        childOfElement(event.target, 'ul')) {
      toggleMenu();
    }
  }, false);

  // Showcase expand/close
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('showcase-expand')) {
      event.preventDefault();

      var showcase = document.getElementsByClassName('showcase')[0];
      var expandControls = document.getElementsByClassName('showcase-expand');
      var showcaseImg = document.querySelector('.showcase-slide > img');

      // only going to be 2 of them.
      expandControls[0].classList.toggle('down');
      expandControls[1].classList.toggle('down');

      if (!showcase.classList.contains('active')) {
        showcase.classList.add('active');
        showcase.style.height = showcaseImg.offsetHeight + 'px';
      } else {
        showcase.classList.remove('active');
        showcase.style.height = null;
      }
    }
  }, false);


  // Adds no-transition on resize event and ignores it whilst its
  // still resizing
  var isResizing;
  var resizeEndTimer;
  window.addEventListener('resize', function(event) {
    if (!isResizing) {
      headerEl.classList.add('no-transition');
      isResizing = true;
    }
  }, false);
  // Removes the no-transition class 100ms after resizing stops
  window.addEventListener('resize', function(event) {
    if (resizeEndTimer) clearTimeout(resizeEndTimer);
    resizeEndTimer = setTimeout(function() {
      headerEl.classList.remove('no-transition');
      isResizing = false;
    }, 100);
  }, false);

  // Check for section visibility, throttled on scroll event
  var isScrolling;
  window.addEventListener('scroll', function(event) {
    if (!isScrolling) {
      isScrolling = true;

      var sectionEls = document.getElementsByTagName('section');
      var winOffset = (window.innerHeight ||
                      document.documentElement.clientHeight ||
                      document.getElementsByTagName('body')[0].clientHeight)/2;
      var pageTop = window.pageYOffset;
      var navToggleEls = document.getElementsByClassName('nav-toggle');

      for (var x = 0; x < sectionEls.length; x++) {
        var elTop = sectionEls[x].offsetTop + 100; // extra offset
        if (pageTop <=   elTop && elTop < (pageTop + winOffset)) {

          for (var y = 0; y < navToggleEls.length; y++) {
            navToggleEls[y].classList.remove('section-experience');
            navToggleEls[y].classList.remove('section-personal');
            navToggleEls[y].classList.remove('section-other');
            navToggleEls[y].classList.add('section-' + sectionEls[x].id);
          }

          break;
        }
      }

      // set throttle
      setTimeout(function() {
        isScrolling = false;
      }, 50);
    }
  }, false);

  // block touch scroll when mobile menu is out
  headerEl.addEventListener('touchmove', function(event) {
    event.preventDefault();
  }, false);

  // bind fastclick & smoothyscroll
  FastClick.attach(document.body);
  smoothie.initAnchors({headerOffset: 80});

})(window, document);