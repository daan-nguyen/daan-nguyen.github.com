(function() {
	'use strict';

  // mobile nav button
  var mobileOpenNavEl = document.getElementsByClassName('nav-toggle mobile')[0];
  var headerEl = document.getElementsByTagName('header')[0];
  var menuEl = document.getElementsByClassName('nav-cube')[0];
  var highlightsEl = document.getElementsByClassName('nav-face-highlights')[0];

  // mobile menu toggle
  mobileOpenNavEl.addEventListener('click', function(event) {
    headerEl.classList.toggle('show');
    mobileOpenNavEl.classList.toggle('close');
  }, false);

  // delegate event listener
  headerEl.addEventListener('click', function(event) {
    if (event.target.classList.contains('nav-toggle-bar') ||
        event.target.classList.contains('nav-toggle') ||
        event.target.parentElement.classList.contains('nav-toggle')) {
      headerEl.classList.toggle('show');
    }
  });

  headerEl.addEventListener('click', function(event) {
    if (event.target.tagName.toLowerCase() === 'a' &&
        event.target.parentElement.parentElement.classList.contains('nav-menu-list')) {
      headerEl.classList.remove('show');
    }
  }, false);

  // highlightsEl.addEventListener('mouseenter', function(event) {
  //   headerEl.classList.add('show');
  // }, false);

  // block touch scroll when mobile menu is out
  headerEl.addEventListener('touchmove', function(event) {
    event.preventDefault();
  }, false);

  // bind fastclick
  FastClick.attach(document.body);
  smoothy.initAnchors({headerOffset: 80});

})();