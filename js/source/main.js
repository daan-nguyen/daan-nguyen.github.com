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

"use strict";

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
	});

	$('#main-header h1').fitText(1.0, {minFontSize: '40px', maxFontSize: '140px'});
})();