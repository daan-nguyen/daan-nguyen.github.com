(function() {
	'use strict';

  $('header').click(function() {
    $(this).toggleClass('show');
  });

  FastClick.attach(document.body);

})();