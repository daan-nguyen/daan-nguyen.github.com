"use strict";

(function(window, $) {
  var my = window.dnSite = {};
  var $win = $(window),
      $banner = $('#main-banner'),
      $bannerImg = $('img', $banner),
      $header = $('#main-header'),
      $headerH1 = $('h1', $header);
  var pageReady = false;

  // util functions
  var toggleMobileMenu = function() {
    $('#mobile-menu').toggleClass('show-mobile-menu');
    $('nav').toggleClass('show-mobile-menu');
  };

  // checks if section is in view to scroll in header.
  var checkSectionHeaders = function() {
    var winHeight = $(window).height(),
        winScroll = $(window).scrollTop();

    if (winScroll + winHeight > $('#main-footer').offset().top) {
      trackEvent('Content Viewed', 'Page Bottom');
      return;
    }

    $('#main-content section').each(function() {
      var $t = $(this),
          p = $t.offset().top + $t.height()/5; //trigger point for trans

      if (p < winHeight + winScroll) {
        var $h = $('header', $t),
            $h2 = $('h2', $h),
            $a = $('article', $t),
            hpos = $a.innerHeight() - $h.width() - 8;

        if ($h2.hasClass('transparent')) {
          $h.css('bottom', hpos +'px');
          $h2.removeClass('transparent');
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

  var setBannerHeight = function(width) {
    // 900/1360 is the full image size
    // we only want a viewport of this

    var ratio = 900/1360; // ratio = w/h = r
    var height = width/ratio; // h/w = 1/r, h = w/r
    var winHeight = $win.height();

    if (height > winHeight) {
      height = winHeight;
    }

    $('#main-banner').height(height);
  };

  var setImageHeight = function() {
    var imageHeight = $bannerImg.height(),
        bannerHeight = $banner.height();

    $bannerImg.css('top', -(imageHeight-bannerHeight));
  };

  var trackEvent = function(category, action) {
    _gaq.push(['_trackEvent', category, action]);
  };

  // banner img load loop
  var bannerLoader = function() {
    if ($bannerImg.get(0).complete) { //check for complete before starting transition
      $header.removeClass('transparent');

      var imgOffset = $bannerImg.height() - $banner.height();

      $bannerImg.animate({top: -imgOffset},
      3000, 'easeOutCubic', function() {
        pageReady = true;
        $headerH1.removeClass('transparent');
      });

      checkNav();
      checkSectionHeaders();

    } else { //delay, try again
      setTimeout(bannerLoader, 100);
    }
  };

  // event binds
  var bindEvents = function() {
    // event setups
    $('nav ul li a.nav-link').click(function(e) {
      e.preventDefault();
      var $o = $($(e.target).attr('href')),
          pxOffset = 20;

      if ($('nav').hasClass('show-mobile-menu')) {
        pxOffset = 35;
        toggleMobileMenu();
      }

      $('html,body').animate({scrollTop: $o.offset().top - pxOffset}, 1500, 'easeInOutCubic');
    });

    // mobile menu button
    $('#mobile-menu').click(function() {
      toggleMobileMenu();
    });

    // resume link clicked
    $('.resume-link').click(function() {
      trackEvent('Resume','Download');
    });

    // generic link track
    $('.track-link').click(function() {
      trackEvent('Link Clicked', $(this).text().toLowerCase());
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
        setBannerHeight($win.width());
        setImageHeight();
        checkSectionHeaders();
        checkNav();
      }
    });
  };

  // main init function
  my.init = function() {
    $('#main-header h1').fitText(1.0, {minFontSize: '40px', maxFontSize: '180px'});
    setBannerHeight($win.width());
    bindEvents();
    bannerLoader();
  };

})(window, jQuery);

dnSite.init();