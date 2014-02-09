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
    if (event.target.tagName.toLowerCase() === 'a' &&
        event.target.parentElement.parentElement.classList.contains('nav-menu-list')) {
      toggleMenu();
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
  });

  // highlightsEl.addEventListener('mouseenter', function(event) {
  //   headerEl.classList.add('show');
  // }, false);

  // block touch scroll when mobile menu is out
  headerEl.addEventListener('touchmove', function(event) {
    event.preventDefault();
  }, false);

  // bind fastclick & smoothyscroll
  FastClick.attach(document.body);
  smoothy.initAnchors({headerOffset: 80});

})(window, document);