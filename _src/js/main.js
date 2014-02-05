(function() {
	'use strict';

  // mobile nav button
  var openNavEl = document.getElementsByClassName('nav-open')[0];
  var headerEl = document.getElementsByTagName('header')[0];
  openNavEl.addEventListener('click', function(event) {
    headerEl.classList.toggle('show');
  }, false);

  headerEl.addEventListener('touchmove', function(event) {
    event.preventDefault();
  }, false);

  // bind fastclick
  FastClick.attach(document.body);

})();