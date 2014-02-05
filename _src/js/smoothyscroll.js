window.smoothyScroll = (function(window, document) {
  var smoothy = {};

  // ease in out cubic from:
  // http://www.gizma.com/easing/
  var easeInOutCubic = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t*t + b;
    t -= 2;
    return c/2*(t*t*t + 2) + b;
  };

  // stop function
  var stopScrollTo = function() {
    startTime = false;
    cancelAnimationFrame(animationId);
  };

  // requires request animation frame or polyfill
  var animationId;
  var startTime;

  smoothy.scrollTo = function(startOffset, deltaOffset, duration) {
    var nowTime = (new Date()).getTime();
    if (!startTime) startTime = nowTime;
    var animationTime = nowTime - startTime;

    if (animationTime <= duration) {
      animationId = window.requestAnimationFrame(smoothy.scrollTo.bind(null, startOffset, deltaOffset, duration));
    } else {
      stopScrollTo();
    }

    document.documentElement.scrollTop = easeInOutCubic(animationTime, startOffset, deltaOffset, duration);
  };

  return smoothy;

})(window, document);

