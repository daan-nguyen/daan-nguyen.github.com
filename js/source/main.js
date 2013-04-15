"use strict";

(function(window, $, _gaq) {
  var my = window.dnSite = {};
  var $win = $(window),
      $headerImg = $('#main-header img');
  var pageReady = false;

  // bind fittext to header
  $('#main-header h1').fitText(1.0, {minFontSize: '40px', maxFontSize: '180px'});

  // banner img load loop
  my.bannerLoader = function() {
    if ($headerImg.get(0).complete) { //check for complete before starting transition

      $('#main-header').css('opacity','1');

      // init full intro if pos at top
      if ($win.scrollTop() === 0) {
        $('html,body').animate({scrollTop: $headerImg.offset().top + $headerImg.height() - $win.innerHeight()},
          1200, 'swing', function() {
            pageReady = true;
            $('#main-header h1').css('opacity', '1');
          });
      } else {
        pageReady = true;
        $('#main-header h1').css('opacity', '1');
        checkSectionHeaders();
      }

    } else { //delay, try again
      setTimeout(my.bannerLoader, 100);
    }
  };

  $('nav ul li a.nav-link').click(function(e) {
    e.preventDefault();
    var $o = $($(e.target).attr('href')),
        pxOffset = 20;

    if ($('nav').hasClass('show-mobile-menu')) {
      pxOffset = 35;
      toggleMobileMenu();
    }

    $('html,body').animate({scrollTop: $o.offset().top - pxOffset}, 1000);


  });

  // even binds

  // mobile menu button
  $('#mobile-menu').click(function() {
    toggleMobileMenu();
  });

  // resume link clicked
  $('.resume-link').click(function() {
    trackEvent('Resume','Download');
  });

  // scroll event checker
  $win.scroll(function() {
    if (pageReady) {
      checkSectionHeaders();
      checkNav();
    }
  });

  $win.resize(function() {
    if (pageReady) {
      checkSectionHeaders();
      checkNav();
    }
  });

  var toggleMobileMenu = function() {
    $('#mobile-menu').toggleClass('show-mobile-menu');
    $('nav').toggleClass('show-mobile-menu');
  };

  // checks if section is in view to scroll in header.
  var checkSectionHeaders = function() {
    var winHeight = $(window).height(),
        winScroll = $(window).scrollTop();

    $('#main-content section').each(function() {
      var $t = $(this),
          p = $t.offset().top + $t.height()/5; //trigger point for trans

      if (p < winHeight + winScroll) {
        var $h = $('header', $t),
            $h2 = $('h2', $h),
            $a = $('article', $t),
            hpos = $a.innerHeight() - $h.width() - 8;

        if ($h2.css('opacity') !== '1') {
          $h.css('bottom', hpos +'px');
          $h2.css('opacity', '1');
          trackEvent('Content Viewed', $h2.text());
        }

      }
    });
  };

  var checkNav = function() {
    var winScroll = $(window).scrollTop(),
        $n = $('nav'),
        $h = $('#main-header h1');

    if ($h.offset().top < winScroll) {
      $n.addClass('show-nav').removeClass('hide-nav');
    } else {
      $n.addClass('hide-nav').removeClass('show-nav');
    }
  };

  var trackEvent = function(category, action) {
    _gaq.push(['_trackEvent', category, action]);
  };

})(window, jQuery, _gaq);

$(document).ready(function() {
  dnSite.bannerLoader();
});