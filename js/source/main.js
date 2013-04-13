"use strict";

(function(window) {
  var my = window.dnSite = {};
  var $win = $(window),
      $headerImg = $('#main-header img');

  // bind fittext to header
  $('#main-header h1').fitText(1.0, {minFontSize: '40px', maxFontSize: '180px'});
  $('#main-header h2').fitText();

  // banner img load loop
  my.bannerLoader = function() {
    if ($headerImg.get(0).complete) { //check for complete before starting transition

      $('#main-header').css('opacity','1');

      // init full intro if pos at top
      if ($win.scrollTop() === 0) {
        $('html,body').animate({scrollTop: $headerImg.offset().top + $headerImg.height() - $win.innerHeight()}, 2000,
          'swing', function() {
            $('#main-header h1').css('opacity', '1');
          });
      } else {
        $('#main-header h1').css('opacity', '1');
        checkSectionHeaders();
      }

    } else { //delay, try again
      setTimeout(my.bannerLoader, 100);
    }
  };

  // mobile menu button
  $('#mobile-menu').click(function() {
    $(this).toggleClass('show-mobile-menu');
    $('nav').toggleClass('show-mobile-menu');
  });

  // scroll event checker
  $win.scroll(function() {
    checkSectionHeaders();
    checkNav();
  });

  $win.resize(function() {
    checkSectionHeaders();
    checkNav();
  });

  // checks if section is in view to scroll in header.
  var checkSectionHeaders = function() {
    var winHeight = $(window).height(),
        winScroll = $(window).scrollTop();

    $('#main-content section').each(function() {
      var $t = $(this),
          p = $t.offset().top + $t.height()/5; //trigger point for trans

      if (p < winHeight + winScroll) {
        var $h = $('header', $t),
            $a = $('article', $t),
            hpos = $a.innerHeight() - $h.width() - 8;

        $('header',$t).css('bottom', hpos +'px');
        $('header h2', $t).css('opacity', '1');
      }
    });
  };

  var checkNav = function() {
    var winScroll = $(window).scrollTop(),
        $n = $('nav'),
        $h = $('#main-header h1'),
        $s = $('.spaceholder', $h);

    if ($h.offset().top + $h.height() < winScroll) {
      $n.addClass('show-nav').removeClass('hide-nav');
      $s.show();
    } else {
      $n.addClass('hide-nav').removeClass('show-nav');
      $s.hide();
    }
  };

})(window);

$(document).ready(function() {
  dnSite.bannerLoader();
});