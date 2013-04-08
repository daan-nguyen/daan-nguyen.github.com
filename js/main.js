'use strict';

/*global jQuery */
/*!	
* FitText.js 1.1
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license 
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/

(function( $ ){
	
  $.fn.fitText = function( kompressor, options ) {
	   
    // Setup options
    var compressor = kompressor || 1,
        settings = $.extend({
          'minFontSize' : Number.NEGATIVE_INFINITY,
          'maxFontSize' : Number.POSITIVE_INFINITY
        }, options);
	
    return this.each(function(){

      // Store the object
      var $this = $(this); 
        
      // Resizer() resizes items based on the object width divided by the compressor * 10
      var resizer = function () {
        $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
      };

      // Call once to set.
      resizer();
				
      // Call on resize. Opera debounces their resize by default. 
      $(window).on('resize', resizer);
      	
    });

  };

})( jQuery );

// main.js
(function() {

	$(document).ready(function() {
		$('#main-header').css('opacity','1');
	});
	
	$(window).scroll(function() {
		var winHeight = $(this).height(),
			winScroll = $(this).scrollTop();

		$('#main-content section').each(function() {
			var t = $(this).offset().top;

			if (t < winHeight + winScroll) {
				$(this).css('opacity','1');
			}
		});
	})

	$('#main-header h1').fitText(1.0, {minFontSize: '40px', maxFontSize: '140px'});
})();