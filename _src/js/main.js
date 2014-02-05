(function() {
	'use strict';

  // mobile nav button
  var mobileOpenNavEl = document.getElementsByClassName('nav-toggle hide-sm')[0];
  var headerEl = document.getElementsByTagName('header')[0];
  var menuEl = document.getElementsByClassName('nav-cube')[0];

  // mobile menu toggle
  mobileOpenNavEl.addEventListener('click', function(event) {
    headerEl.classList.toggle('show');
    mobileOpenNavEl.classList.toggle('close');
  }, false);

  // delegate event listener
  headerEl.addEventListener('click', function(event) {
    if (event.target.classList.contains('nav-toggle-bar') ||
        event.target.parentElement.classList.contains('nav-toggle')) {
      headerEl.classList.toggle('show');
    }
  });

  // hover event for when the mouse enters the menu area
  menuEl.addEventListener('mouseenter', function(event) {
    headerEl.classList.add('show');
  }, false);

  // block touch scroll when mobile menu is out
  headerEl.addEventListener('touchmove', function(event) {
    event.preventDefault();
  }, false);

  // bind fastclick
  FastClick.attach(document.body);

})();