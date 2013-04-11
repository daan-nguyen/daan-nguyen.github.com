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
        if ($win.scrollTop() === 0) {

          $('html,body').animate({scrollTop: $headerImg.offset().top + $headerImg.height() - $win.innerHeight()}, 2000,
            'swing', function() {
              $('#main-header h1,#main-header h2').css('opacity', '1');
            });
        } else {
          $('#main-header h1,#main-header h2').css('opacity', '1');
        }
      }, 300);

    } else { //delay, try again
      setTimeout(my.bannerLoader, 100);
    }
  };

  $win.scroll(function() {
    var winHeight = $(this).height(),
        winScroll = $(this).scrollTop();

    $('#main-content section').each(function() {
      var $t = $(this),
          $h = $('header', $t),
          p = $t.offset().top + $t.height()/5,
          hpos = $t.height() - $h.width() * 1.5;

          console.log('section: ' + $t.height() + ' head: ' + $h.width());

      if (p < winHeight + winScroll) {
        $('header',$t).css('bottom', hpos +'px');
        $('header h2', $t).css('opacity', '1');
      }
    });
  });

})(window);

$(document).ready(function() {
  dnSite.bannerLoader();
});