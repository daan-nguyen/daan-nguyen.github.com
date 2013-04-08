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

	$('#main-header h1').fitText(1.0, {minFontSize: '40px', maxFontSize: '180px'});
})();