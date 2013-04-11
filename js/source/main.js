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

      setTimeout(function(){
        $('#main-header').css('opacity','1');

        // init full intro if pos at top
        if ($win.scrollTop() === 0) {
          $('html,body').animate({scrollTop: $headerImg.offset().top + $headerImg.height() - $win.innerHeight()}, 2000,
            'swing', function() {
              $('#main-header h1, #main-header h2').css('opacity', '1');
            });
        } else {
          $('#main-header h1, #main-header h2').css('opacity', '1');
          checkSectionHeaders();
        }
      }, 300);

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
    var winHeight = $(this).height(),
        winScroll = $(this).scrollTop();

    $('#main-content section').each(function() {
      var $t = $(this),
          p = $t.offset().top + $t.height()/4; //trigger point for trans

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
    var winScroll = $(this).scrollTop(),
        $n = $('nav'),
        $h = $('#main-header'),
        $s = $('.spaceholder', $h);

    if ($h.offset().top + $h.height() < winScroll) {
      $n.addClass('show-nav').removeClass('hide-nav');
      $s.show();
    } else {
      //$('nav').height() - $('nav').css('border-bottom-width').replace(/[^-\d\.]/g, '')
      //var p = -1 * ($n.outerHeight() - $n.css('border-bottom-width').replace(/[^-\d\.]/g, ''));
      $n.addClass('hide-nav').removeClass('show-nav');
      $s.hide();
    }
  };

})(window);

$(document).ready(function() {
  dnSite.bannerLoader();
});